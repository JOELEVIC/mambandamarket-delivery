'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { del, patch, post } from '@/lib/api';
import { useApi, useSession } from '@/lib/session';
import { when, xaf } from '@/lib/format';
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, Modal, PageHeader, Select, Spinner, Table, useAction } from '@/components/ui';
import InviteResult, { type InviteRes } from '@/components/InviteResult';

const AVAIL_TONE: Record<string, string> = { available: 'green', busy: 'blue', break: 'amber', offline: 'mute' };

export default function FleetPage() {
  const { can } = useSession();
  const riders = useApi<{ items: any[] }>('/carrier/riders');
  const invites = useApi<{ items: any[] }>('/carrier/invites');
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [invite, setInvite] = useState<InviteRes | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', vehicle_type: 'bike', license_plate: '', max_cod_float_cents: 100000 });
  const { busy, run } = useAction();
  const manage = can('riders.manage');

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await run('add', () => post<{ item: any; invite: InviteRes }>('/carrier/riders', { ...form, license_plate: form.license_plate || null, invite: true }), 'Rider added');
    if (r) { setAdding(false); setInvite(r.invite); setForm({ name: '', phone: '', vehicle_type: 'bike', license_plate: '', max_cod_float_cents: 100000 }); void riders.reload(); void invites.reload(); }
  };
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await run('save', () => patch(`/carrier/riders/${editing.id}`, {
      name: editing.name, phone: editing.phone, vehicle_type: editing.vehicle_type, license_plate: editing.license_plate || null,
      max_cod_float_cents: Number(editing.max_cod_float_cents), kyc_status: editing.kyc_status,
    }), 'Saved');
    if (r) { setEditing(null); void riders.reload(); }
  };

  const pendingRiderInvites = (invites.data?.items ?? []).filter((i) => i.role === 'rider' && !i.claimed_at && !i.revoked_at && new Date(i.expires_at) > new Date());

  return (
    <div>
      <PageHeader title="Fleet & riders" subtitle="Who rides for you, where they are, and how much cash they carry."
        actions={manage && <Button onClick={() => setAdding(true)}><Plus className="w-4 h-4" />Add rider</Button>} />
      <Card>
        <ErrorNote error={riders.error} onRetry={riders.reload} />
        {riders.loading && !riders.data ? <Spinner /> : (riders.data?.items.length ?? 0) === 0 ? (
          <Empty title="No riders yet">Add a rider; they get an invite code to sign in to the Mambanda Delivery app.</Empty>
        ) : (
          <Table head={['Rider', 'Status', 'Jobs', 'Cash held', 'Last seen', 'Account', '']}>
            {riders.data!.items.map((r) => (
              <tr key={r.id} className={r.is_active ? '' : 'opacity-50'}>
                <td className="py-3 pr-4"><p className="font-bold">{r.name}</p><p className="text-xs text-mute">{r.phone} · {r.vehicle_type}{r.license_plate ? ` · ${r.license_plate}` : ''}</p></td>
                <td className="py-3 pr-4"><Badge tone={AVAIL_TONE[r.availability_status] ?? 'mute'}>{r.is_active ? r.availability_status : 'inactive'}</Badge></td>
                <td className="py-3 pr-4">{r.active_jobs}</td>
                <td className="py-3 pr-4 whitespace-nowrap"><span className={r.cash_on_hand_cents > r.max_cod_float_cents * 0.8 ? 'text-amber-300 font-bold' : ''}>{xaf(r.cash_on_hand_cents)}</span><span className="text-xs text-mute"> / {xaf(r.max_cod_float_cents)}</span></td>
                <td className="py-3 pr-4 text-mute whitespace-nowrap">{when(r.last_ping_at)}</td>
                <td className="py-3 pr-4">{r.source !== 'mambanda_app' ? <Badge tone="blue">Partner app</Badge> : r.has_account ? <Badge tone="green">Signed up</Badge> : <Badge tone="amber">Invited</Badge>}</td>
                <td className="py-3 pr-4 text-right whitespace-nowrap space-x-2">
                  {manage && !r.has_account && r.source === 'mambanda_app' && r.is_active && <Button size="sm" variant="ghost" busy={busy === `inv${r.id}`} onClick={async () => { const x = await run(`inv${r.id}`, () => post<InviteRes>(`/carrier/riders/${r.id}/invite`)); if (x) setInvite(x); }}>New code</Button>}
                  {manage && <Button size="sm" variant="ghost" onClick={() => setEditing({ ...r })}>Edit</Button>}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {pendingRiderInvites.length > 0 && (
        <Card className="mt-6">
          <h2 className="font-extrabold mb-3">Invites not yet used</h2>
          <ul className="divide-y divide-line text-sm">{pendingRiderInvites.map((i) => (
            <li key={i.id} className="py-2 flex justify-between gap-2"><span>{i.name} · {i.phone}</span><span className="text-mute">expires {new Date(i.expires_at).toLocaleDateString('en-GB')}</span>
              {manage && <button className="text-rose-300 text-xs" onClick={() => run('rev', () => del(`/carrier/invites/${i.id}`), 'Invite revoked').then(() => invites.reload())}>Revoke</button>}</li>
          ))}</ul>
        </Card>
      )}

      <Modal open={adding} onClose={() => setAdding(false)} title="Add a rider">
        <form onSubmit={add} className="space-y-4">
          <Field label="Full name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
          <Field label="Phone (they sign in with it)"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="677 12 34 56" required /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Vehicle"><Select value={form.vehicle_type} onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })}>{['bike', 'car', 'van', 'truck', 'foot'].map((v) => <option key={v}>{v}</option>)}</Select></Field>
            <Field label="Plate"><Input value={form.license_plate} onChange={(e) => setForm({ ...form, license_plate: e.target.value })} /></Field>
          </div>
          <Field label="Cash limit (FCFA)" hint="New cash-on-delivery jobs are refused once the rider holds this much."><Input type="number" min={0} step={5000} value={form.max_cod_float_cents} onChange={(e) => setForm({ ...form, max_cod_float_cents: Number(e.target.value) })} /></Field>
          <Button type="submit" busy={busy === 'add'} className="w-full">Add and create invite</Button>
        </form>
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit rider">
        {editing && (
          <form onSubmit={save} className="space-y-4">
            <Field label="Name"><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="Phone"><Input value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Vehicle"><Select value={editing.vehicle_type} onChange={(e) => setEditing({ ...editing, vehicle_type: e.target.value })}>{['bike', 'car', 'van', 'truck', 'foot'].map((v) => <option key={v}>{v}</option>)}</Select></Field>
              <Field label="Plate"><Input value={editing.license_plate ?? ''} onChange={(e) => setEditing({ ...editing, license_plate: e.target.value })} /></Field>
            </div>
            <Field label="Cash limit (FCFA)"><Input type="number" value={editing.max_cod_float_cents} onChange={(e) => setEditing({ ...editing, max_cod_float_cents: e.target.value })} /></Field>
            <Field label="Papers checked (ID, licence, moto registration)"><Select value={editing.kyc_status} onChange={(e) => setEditing({ ...editing, kyc_status: e.target.value })}>{['pending', 'submitted', 'verified', 'rejected'].map((v) => <option key={v}>{v}</option>)}</Select></Field>
            <div className="flex gap-2">
              <Button type="submit" busy={busy === 'save'} className="flex-1">Save</Button>
              {editing.is_active
                ? <Button type="button" variant="danger" busy={busy === 'off'} onClick={async () => { if (await run('off', () => del(`/carrier/riders/${editing.id}`), 'Rider deactivated')) { setEditing(null); void riders.reload(); } }}>Deactivate</Button>
                : <Button type="button" variant="ghost" busy={busy === 'on'} onClick={async () => { if (await run('on', () => patch(`/carrier/riders/${editing.id}`, { is_active: true }), 'Rider reactivated')) { setEditing(null); void riders.reload(); } }}>Reactivate</Button>}
            </div>
          </form>
        )}
      </Modal>

      <Modal open={!!invite} onClose={() => setInvite(null)} title="Invite ready">{invite && <InviteResult res={invite} onDone={() => setInvite(null)} />}</Modal>
    </div>
  );
}
