'use client';

// The rider's day, on the web: used by /ride (a rider signed in to the portal)
// and by the embedded rider screens inside a partner's app. Same /rider API as
// the Mambanda Delivery mobile app.
import React, { useEffect, useState } from 'react';
import { MapPin, Phone } from 'lucide-react';
import { ApiError, get, post } from '@/lib/api';
import { STAGES, when, xaf } from '@/lib/format';
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, Select, Spinner, StageBadge, Tabs, useAction } from './ui';

const NEXT: Record<string, Array<[string, string]>> = {
  assigned: [['picked_up', 'I have the parcel']],
  picked_up: [['out_for_delivery', 'On my way to the buyer'], ['at_hub', 'Dropped at the hub']],
  at_hub: [['out_for_delivery', 'Out for delivery']],
  delivery_failed: [['out_for_delivery', 'Try again'], ['at_hub', 'Back at the hub']],
  returning: [['returned', 'Returned to sender']],
};

export default function RiderJobs({ only }: { only?: string }) {
  const [me, setMe] = useState<any | null>(null);
  const [tab, setTab] = useState<'active' | 'done'>('active');
  const [jobs, setJobs] = useState<any[] | null>(null);
  const [err, setErr] = useState<ApiError | null>(null);
  const [code, setCode] = useState<Record<string, string>>({});
  const [fail, setFail] = useState<Record<string, string>>({});
  const { busy, run } = useAction();

  const load = async () => {
    try {
      const [m, j] = await Promise.all([get('/rider/me'), get<{ items: any[] }>(`/rider/jobs?scope=${tab}`)]);
      setMe(m);
      setJobs(only ? j.items.filter((x) => x.id === only) : j.items);
      setErr(null);
    } catch (e) { setErr(e as ApiError); }
  };
  useEffect(() => { void load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [tab]);
  useEffect(() => {
    if (!navigator.geolocation || !jobs?.length) return;
    const ping = () => navigator.geolocation.getCurrentPosition((p) => void post('/rider/location', { lat: p.coords.latitude, lng: p.coords.longitude }).catch(() => undefined), () => undefined, { maximumAge: 60_000 });
    ping();
    const id = setInterval(ping, 60_000);
    return () => clearInterval(id);
  }, [jobs?.length]);

  const go = async (key: string, fn: () => Promise<unknown>, ok: string) => { if (await run(key, fn, ok) !== undefined) void load(); };

  if (err) return <ErrorNote error={err.code === 'not_a_rider' ? 'This account is not a rider. Ask your company for a rider invite.' : err} onRetry={load} />;
  if (!me || !jobs) return <Spinner />;
  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-0"><p className="font-extrabold">{me.rider?.name}</p><p className="text-sm text-mute">{me.carrier?.name}</p></div>
        <div className="text-right"><p className="text-xs text-mute">Cash with you</p><p className="font-extrabold text-lime">{xaf(me.cash_on_hand_cents)}</p></div>
        <Select className="w-40" value={me.rider?.availability_status} onChange={(e) => go('av', () => post('/rider/status', { status: e.target.value }), 'Status updated')}>
          {['available', 'busy', 'break', 'offline'].map((s) => <option key={s}>{s}</option>)}
        </Select>
      </Card>
      {!only && <Tabs value={tab} onChange={setTab} tabs={[{ id: 'active', label: 'To do', count: tab === 'active' ? jobs.length : undefined }, { id: 'done', label: 'Done' }]} />}
      {jobs.length === 0 && <Card><Empty title={tab === 'active' ? 'No deliveries assigned' : 'Nothing finished in the last 2 weeks'}>Your dispatcher assigns jobs to you.</Empty></Card>}
      {jobs.map((j) => (
        <Card key={j.id} className="space-y-3">
          <div className="flex items-center justify-between gap-2"><p className="font-extrabold">{j.reference}</p><StageBadge stage={j.stage} /></div>
          <p className="text-sm flex gap-2"><MapPin className="w-4 h-4 text-mute shrink-0" />From {j.from_location}{j.pickup_address ? ` — ${j.pickup_address}` : ''}</p>
          <p className="text-sm flex gap-2"><MapPin className="w-4 h-4 text-lime shrink-0" />To {j.to_location}{j.delivery_address ? ` — ${j.delivery_address}` : ''}</p>
          <div className="flex flex-wrap gap-2 items-center text-sm">
            <span>{j.contact_name}</span>
            {j.contact_phone && !j.details_hidden && <a className="mambanda-btn-ghost text-xs px-3 py-1.5" href={`tel:${j.contact_phone}`}><Phone className="w-3.5 h-3.5" />Call</a>}
            {j.contact_phone && !j.details_hidden && <a className="mambanda-btn-ghost text-xs px-3 py-1.5" href={`https://wa.me/${String(j.contact_phone).replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer">WhatsApp</a>}
            {j.amount_to_collect_cents > 0 && <Badge tone="lime">Collect {xaf(j.amount_to_collect_cents)}</Badge>}
          </div>
          {tab === 'active' && (
            <div className="flex flex-wrap gap-2">
              {(NEXT[j.stage] ?? []).map(([to, label]) => <Button key={to} size="sm" busy={busy === `${j.id}${to}`} onClick={() => go(`${j.id}${to}`, () => post(`/rider/jobs/${j.id}/stage`, { to, happened_at: new Date().toISOString() }), STAGES[to]?.label ?? 'Updated')}>{label}</Button>)}
            </div>
          )}
          {j.stage === 'out_for_delivery' && (
            <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-line">
              <form onSubmit={(e) => { e.preventDefault(); void go(`${j.id}d`, () => post(`/rider/jobs/${j.id}/deliver`, { code: code[j.id], happened_at: new Date().toISOString() }), 'Delivered'); }} className="space-y-2">
                <Field label="Buyer's code"><Input inputMode="numeric" maxLength={6} pattern="\d{6}" value={code[j.id] ?? ''} onChange={(e) => setCode({ ...code, [j.id]: e.target.value.replace(/\D/g, '') })} required /></Field>
                <Button type="submit" size="sm" busy={busy === `${j.id}d`}>Delivered</Button>
              </form>
              <form onSubmit={(e) => { e.preventDefault(); void go(`${j.id}f`, () => post(`/rider/jobs/${j.id}/fail`, { reason: fail[j.id] ?? 'no_answer' }), 'Attempt recorded'); }} className="space-y-2">
                <Field label="Could not deliver"><Select value={fail[j.id] ?? 'no_answer'} onChange={(e) => setFail({ ...fail, [j.id]: e.target.value })}>
                  <option value="no_answer">Buyer not answering</option><option value="address_not_found">Address not found</option><option value="refused">Refused</option><option value="no_cash">No cash</option><option value="reschedule">Another day</option><option value="unsafe">Unsafe</option><option value="other">Other</option>
                </Select></Field>
                <Button type="submit" size="sm" variant="danger" busy={busy === `${j.id}f`}>Record attempt</Button>
              </form>
            </div>
          )}
          <p className="text-xs text-mute">Updated {when(j.updated_at)}</p>
        </Card>
      ))}
    </div>
  );
}
