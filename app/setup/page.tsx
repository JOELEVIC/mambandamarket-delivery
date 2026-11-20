'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { del, get, patch, post } from '@/lib/api';
import { useApi, useSession } from '@/lib/session';
import { day } from '@/lib/format';
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, Modal, PageHeader, Select, Spinner, Table, Tabs, Textarea, useAction } from '@/components/ui';

type Tab = 'tariffs' | 'hubs' | 'coverage' | 'policies';
type Lane = { from: string; to: string; band?: string; tier?: string; price_cents: number; restricted?: boolean };

const PICKUP_MODES: Array<[string, string]> = [
  ['free', 'No pickup charge'], ['flat', 'Flat pickup fee'], ['double_delivery', 'Pickup costs the same as the delivery'],
  ['delivery_discount', 'Pickup = delivery minus a discount'], ['pickup_zone_tariff', 'Pickup priced like a delivery from your hub'],
];

function Tariffs() {
  const { can } = useSession();
  const cards = useApi<{ items: any[] }>('/carrier/rate-cards');
  const [edit, setEdit] = useState<any | null>(null);
  const [imp, setImp] = useState<{ name: string; csv: string; preview?: any } | null>(null);
  const { busy, run } = useAction();
  const manage = can('setup.manage');

  const saveCard = async () => {
    const body = { name: edit.name, lanes: edit.lanes, pickup_rule: edit.pickup_rule, cod_fee_bps: Number(edit.cod_fee_bps ?? 0) };
    const r = await run('save', () => (edit.id ? patch(`/carrier/rate-cards/${edit.id}`, body) : post('/carrier/rate-cards', { ...body, base_fare_cents: 0, per_kg_cents: 0 })), 'Saved as draft');
    if (r) { setEdit({ ...edit, ...(r as any).item }); void cards.reload(); }
  };
  const publish = async (id: string) => { if (await run('pub', () => post(`/carrier/rate-cards/${id}/publish`), 'Published — buyers are quoted from it now')) { setEdit(null); void cards.reload(); } };
  const dry = async () => { const r = await run('dry', () => post('/carrier/rate-cards/import', { name: imp!.name, csv: imp!.csv, dry_run: true })); if (r) setImp({ ...imp!, preview: r }); };
  const doImport = async () => { const r = await run('imp', () => post('/carrier/rate-cards/import', { name: imp!.name, csv: imp!.csv, pickup_rule: { mode: 'double_delivery' } }), 'Imported as a draft'); if (r) { setImp(null); void cards.reload(); setEdit((r as any).item); } };

  return (
    <>
      <div className="flex gap-2 mb-4">
        {manage && <Button onClick={() => setEdit({ name: 'New tariff', lanes: [], pickup_rule: { mode: 'free' }, cod_fee_bps: 0 })}><Plus className="w-4 h-4" />New tariff</Button>}
        {manage && <Button variant="ghost" onClick={() => setImp({ name: 'Douala tariff', csv: '' })}><Upload className="w-4 h-4" />Import CSV</Button>}
      </div>
      <Card>
        <ErrorNote error={cards.error} onRetry={cards.reload} />
        {cards.loading && !cards.data ? <Spinner /> : (cards.data?.items.length ?? 0) === 0 ? <Empty title="No tariff yet">Buyers can only choose you once a tariff is published.</Empty> : (
          <Table head={['Tariff', 'Destinations', 'Pickup', 'Status', 'Updated']}>
            {cards.data!.items.map((c) => (
              <tr key={c.id} className="cursor-pointer hover:bg-p2/60" onClick={() => setEdit({ ...c })}>
                <td className="py-3 pr-4 font-bold">{c.name} <span className="text-xs text-mute">v{c.version}</span></td>
                <td className="py-3 pr-4">{(c.lanes ?? []).length || 'by weight'}</td>
                <td className="py-3 pr-4 text-mute">{PICKUP_MODES.find(([m]) => m === c.pickup_rule?.mode)?.[1] ?? '—'}</td>
                <td className="py-3 pr-4"><Badge tone={c.status === 'published' ? 'green' : c.status === 'draft' ? 'amber' : 'mute'}>{c.status}</Badge></td>
                <td className="py-3 pr-4 text-mute">{day(c.updated_at)}</td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? `Tariff · ${edit.name}` : 'New tariff'} wide>
        {edit && (
          <div className="space-y-5">
            {edit.status === 'published' && <p className="text-sm text-amber-300">Saving changes makes a new draft version; publish it to start quoting from it.</p>}
            <div className="grid sm:grid-cols-3 gap-3">
              <Field label="Name"><Input value={edit.name} disabled={!manage} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field>
              <Field label="Pickup rule"><Select disabled={!manage} value={edit.pickup_rule?.mode ?? 'free'} onChange={(e) => setEdit({ ...edit, pickup_rule: { ...edit.pickup_rule, mode: e.target.value } })}>{PICKUP_MODES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select></Field>
              {edit.pickup_rule?.mode === 'flat' && <Field label="Pickup fee (FCFA)"><Input type="number" value={edit.pickup_rule.amount_cents ?? 0} onChange={(e) => setEdit({ ...edit, pickup_rule: { ...edit.pickup_rule, amount_cents: Number(e.target.value) } })} /></Field>}
              {edit.pickup_rule?.mode === 'delivery_discount' && <Field label="Discount %"><Input type="number" min={0} max={100} value={(edit.pickup_rule.discount_bps ?? 0) / 100} onChange={(e) => setEdit({ ...edit, pickup_rule: { ...edit.pickup_rule, discount_bps: Math.round(Number(e.target.value) * 100) } })} /></Field>}
              <Field label="Cash-on-delivery fee %" hint="Charged on the cash collected, rounded up to 25 FCFA"><Input type="number" min={0} step={0.5} disabled={!manage} value={(edit.cod_fee_bps ?? 0) / 100} onChange={(e) => setEdit({ ...edit, cod_fee_bps: Math.round(Number(e.target.value) * 100) })} /></Field>
            </div>
            <div className="max-h-[45vh] overflow-y-auto">
              <Table head={['From', 'To', 'Price (FCFA)', 'Restricted', '']}>
                {(edit.lanes as Lane[]).map((l, i) => (
                  <tr key={i}>
                    <td className="py-2 pr-2"><Input value={l.from} disabled={!manage} onChange={(e) => { const lanes = [...edit.lanes]; lanes[i] = { ...l, from: e.target.value }; setEdit({ ...edit, lanes }); }} /></td>
                    <td className="py-2 pr-2"><Input value={l.to} disabled={!manage} onChange={(e) => { const lanes = [...edit.lanes]; lanes[i] = { ...l, to: e.target.value }; setEdit({ ...edit, lanes }); }} /></td>
                    <td className="py-2 pr-2 w-36"><Input type="number" min={0} step={25} value={l.price_cents} disabled={!manage} onChange={(e) => { const lanes = [...edit.lanes]; lanes[i] = { ...l, price_cents: Number(e.target.value) }; setEdit({ ...edit, lanes }); }} /></td>
                    <td className="py-2 pr-2 text-center"><input type="checkbox" checked={!!l.restricted} disabled={!manage} onChange={(e) => { const lanes = [...edit.lanes]; lanes[i] = { ...l, restricted: e.target.checked }; setEdit({ ...edit, lanes }); }} /></td>
                    <td className="py-2">{manage && <button aria-label="Remove" className="text-mute hover:text-rose-300" onClick={() => setEdit({ ...edit, lanes: edit.lanes.filter((_: Lane, k: number) => k !== i) })}><Trash2 className="w-4 h-4" /></button>}</td>
                  </tr>
                ))}
              </Table>
              {(edit.lanes ?? []).length === 0 && <p className="text-sm text-mute py-4">“From” is <b>hub</b> (your office), a neighbourhood, a zone, or <b>*</b> for anywhere. “To” is a neighbourhood name.</p>}
            </div>
            {manage && (
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEdit({ ...edit, lanes: [...edit.lanes, { from: 'hub', to: '', price_cents: 1000 }] })}><Plus className="w-4 h-4" />Add destination</Button>
                <span className="flex-1" />
                <Button variant="ghost" busy={busy === 'save'} onClick={saveCard}>Save draft</Button>
                {edit.id && edit.status !== 'published' && <Button busy={busy === 'pub'} onClick={() => publish(edit.id)}>Publish</Button>}
                {edit.id && edit.status === 'published' && <Button variant="danger" busy={busy === 'arc'} onClick={async () => { if (await run('arc', () => post(`/carrier/rate-cards/${edit.id}/archive`), 'Archived')) { setEdit(null); void cards.reload(); } }}>Archive</Button>}
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal open={!!imp} onClose={() => setImp(null)} title="Import a tariff sheet" wide>
        {imp && (
          <div className="space-y-4">
            <p className="text-sm text-mute">Columns: <code>from_scope, from_ref, to_place_name, is_restricted, size_band, tier, delivery_fee, eta_min, eta_max</code>. Export your Google Sheet as CSV.</p>
            <Field label="Tariff name"><Input value={imp.name} onChange={(e) => setImp({ ...imp, name: e.target.value })} /></Field>
            <input type="file" accept=".csv,text/csv" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setImp({ ...imp, csv: await f.text(), preview: undefined }); }} className="text-sm" />
            <Textarea rows={6} value={imp.csv} onChange={(e) => setImp({ ...imp, csv: e.target.value, preview: undefined })} placeholder="…or paste the CSV here" />
            {imp.preview && (
              <div className="rounded-2xl bg-p2 border border-line p-4 text-sm space-y-1">
                <p><b>{imp.preview.lanes}</b> destinations read.</p>
                {imp.preview.errors?.length > 0 && <p className="text-rose-300">{imp.preview.errors.join(' · ')}</p>}
                {imp.preview.unknown_places?.length > 0 && <p className="text-amber-300">Not yet in Mambanda's place list (quotes to these won't match until we add them): {imp.preview.unknown_places.join(', ')}</p>}
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="ghost" busy={busy === 'dry'} disabled={!imp.csv} onClick={dry}>Check</Button>
              <Button busy={busy === 'imp'} disabled={!imp.preview || imp.preview.errors?.length > 0} onClick={doImport}>Import as draft</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

function Hubs() {
  const { can } = useSession();
  const hubs = useApi<{ items: any[] }>('/carrier/hubs');
  const [f, setF] = useState<any | null>(null);
  const { busy, run } = useAction();
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { name: f.name, address: f.address, contact_phone: f.contact_phone || undefined, is_main: !!f.is_main };
    if (await run('h', () => (f.id ? patch(`/carrier/hubs/${f.id}`, body) : post('/carrier/hubs', body)), 'Saved')) { setF(null); void hubs.reload(); }
  };
  return (
    <>
      {can('setup.manage') && <Button className="mb-4" onClick={() => setF({ name: '', address: '' })}><Plus className="w-4 h-4" />Add hub</Button>}
      <Card>
        {hubs.loading && !hubs.data ? <Spinner /> : (hubs.data?.items.length ?? 0) === 0 ? <Empty title="No hubs">Add the office where parcels are dropped and cash is handed in.</Empty> : (
          <Table head={['Hub', 'Address', 'Phone', '']}>
            {hubs.data!.items.map((h) => (
              <tr key={h.id} className={h.is_active ? '' : 'opacity-50'}>
                <td className="py-3 pr-4 font-bold">{h.name} {h.is_main && <Badge tone="lime">Main</Badge>}</td>
                <td className="py-3 pr-4">{h.address}</td><td className="py-3 pr-4">{h.contact_phone ?? '—'}</td>
                <td className="py-3 text-right space-x-2">{can('setup.manage') && h.is_active && <><Button size="sm" variant="ghost" onClick={() => setF(h)}>Edit</Button><Button size="sm" variant="danger" onClick={() => run('d', () => del(`/carrier/hubs/${h.id}`), 'Removed').then(() => hubs.reload())}>Remove</Button></>}</td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
      <Modal open={!!f} onClose={() => setF(null)} title={f?.id ? 'Edit hub' : 'Add hub'}>
        {f && <form onSubmit={save} className="space-y-4">
          <Field label="Name"><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required /></Field>
          <Field label="Address / landmark"><Input value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} required /></Field>
          <Field label="Phone"><Input value={f.contact_phone ?? ''} onChange={(e) => setF({ ...f, contact_phone: e.target.value })} /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.is_main} onChange={(e) => setF({ ...f, is_main: e.target.checked })} />Main office</label>
          <Button type="submit" busy={busy === 'h'} className="w-full">Save</Button>
        </form>}
      </Modal>
    </>
  );
}

function Coverage() {
  const { can } = useSession();
  const zones = useApi<{ items: any[] }>('/carrier/coverage');
  const [f, setF] = useState<any | null>(null);
  const { busy, run } = useAction();
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { zone_name: f.zone_name, neighborhoods: String(f.text ?? '').split(/[\n,]+/).map((s) => s.trim()).filter(Boolean) };
    if (await run('z', () => (f.id ? patch(`/carrier/coverage/${f.id}`, body) : post('/carrier/coverage', body)), 'Saved')) { setF(null); void zones.reload(); }
  };
  return (
    <>
      <p className="text-sm text-mute mb-4">Your tariff decides where you deliver. Zones here group neighbourhoods for your dispatchers.</p>
      {can('setup.manage') && <Button className="mb-4" onClick={() => setF({ zone_name: '', text: '' })}><Plus className="w-4 h-4" />Add zone</Button>}
      <div className="grid sm:grid-cols-2 gap-4">
        {(zones.data?.items ?? []).filter((z) => z.is_active).map((z) => (
          <Card key={z.id} hover><div onClick={() => can('setup.manage') && setF({ ...z, text: (z.neighborhoods ?? []).join(', ') })}>
            <p className="font-extrabold">{z.zone_name}</p><p className="text-sm text-mute mt-1">{(z.neighborhoods ?? []).join(', ') || '—'}</p>
          </div></Card>
        ))}
      </div>
      <Modal open={!!f} onClose={() => setF(null)} title="Zone">
        {f && <form onSubmit={save} className="space-y-4">
          <Field label="Zone name"><Input value={f.zone_name} onChange={(e) => setF({ ...f, zone_name: e.target.value })} required /></Field>
          <Field label="Neighbourhoods" hint="Comma or line separated"><Textarea rows={5} value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} /></Field>
          <div className="flex gap-2"><Button type="submit" busy={busy === 'z'} className="flex-1">Save</Button>{f.id && <Button type="button" variant="danger" onClick={() => run('zd', () => del(`/carrier/coverage/${f.id}`), 'Removed').then(() => { setF(null); void zones.reload(); })}>Remove</Button>}</div>
        </form>}
      </Modal>
    </>
  );
}

function Policies() {
  const { can } = useSession();
  const [p, setP] = useState<any | null>(null);
  const { busy, run } = useAction();
  useEffect(() => { void get<{ policy: any }>('/carrier/policies').then((r) => setP(r.policy ?? {})); }, []);
  if (!p) return <Spinner />;
  const m = can('setup.manage');
  const save = () => run('p', () => patch('/carrier/policies', {
    max_cod_amount: Number(p.max_cod_amount ?? 0), auto_accept_jobs: !!p.auto_accept_jobs, max_attempts: Number(p.max_attempts ?? 2),
    require_delivery_code: p.require_delivery_code !== false, allow_fragile: !!p.allow_fragile, allow_perishable: !!p.allow_perishable,
    ...(p.cutoff_time ? { cutoff_time: String(p.cutoff_time).slice(0, 5) } : {}),
  }), 'Policies saved');
  return (
    <Card className="max-w-2xl space-y-5">
      <Field label="Largest cash-on-delivery you accept (FCFA)" hint="0 = no limit. Bigger COD jobs are not offered to you."><Input type="number" disabled={!m} value={p.max_cod_amount ?? 0} onChange={(e) => setP({ ...p, max_cod_amount: e.target.value })} /></Field>
      <Field label="Delivery attempts before return"><Select disabled={!m} value={p.max_attempts ?? 2} onChange={(e) => setP({ ...p, max_attempts: e.target.value })}>{[1, 2, 3].map((n) => <option key={n}>{n}</option>)}</Select></Field>
      <Field label="Same-day cut-off"><Input type="time" disabled={!m} value={(p.cutoff_time ?? '').slice(0, 5)} onChange={(e) => setP({ ...p, cutoff_time: e.target.value })} /></Field>
      {[['auto_accept_jobs', 'Accept every job automatically'], ['require_delivery_code', 'Require the buyer’s code to complete a delivery (recommended)'], ['allow_fragile', 'Carry fragile items'], ['allow_perishable', 'Carry perishable food']].map(([k, l]) => (
        <label key={k} className="flex items-center gap-3 text-sm"><input type="checkbox" disabled={!m} checked={k === 'require_delivery_code' ? p[k] !== false : !!p[k]} onChange={(e) => setP({ ...p, [k]: e.target.checked })} />{l}</label>
      ))}
      {p.platform_fee_bps != null && <p className="text-sm text-mute">Mambanda fee on your delivery fees: <b className="text-ink">{p.platform_fee_bps / 100}%</b> (set in your agreement).</p>}
      {m && <Button busy={busy === 'p'} onClick={save}>Save policies</Button>}
    </Card>
  );
}

export default function SetupPage() {
  const [tab, setTab] = useState<Tab>('tariffs');
  return (
    <div>
      <PageHeader title="Coverage & tariffs" subtitle="Where you deliver, what it costs, and how you work." />
      <Tabs value={tab} onChange={setTab} tabs={[{ id: 'tariffs', label: 'Tariffs' }, { id: 'hubs', label: 'Hubs' }, { id: 'coverage', label: 'Zones' }, { id: 'policies', label: 'Policies' }]} />
      {tab === 'tariffs' && <Tariffs />}{tab === 'hubs' && <Hubs />}{tab === 'coverage' && <Coverage />}{tab === 'policies' && <Policies />}
    </div>
  );
}
