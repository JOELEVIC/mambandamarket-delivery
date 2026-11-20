'use client';

// One job, everything a dispatcher does with it: accept/decline an offer,
// assign a rider, move it along, deliver with the buyer's code, record a
// failed attempt. Used by the Control Tower, Jobs and the embedded job screen.
import React, { useEffect, useState } from 'react';
import { MapPin, Phone, User } from 'lucide-react';
import { get, post } from '@/lib/api';
import { useSession } from '@/lib/session';
import { NEXT_STAGES, STAGES, when, xaf } from '@/lib/format';
import { Button, ErrorNote, Field, Input, Modal, Select, Spinner, StageBadge, useAction } from './ui';

type Detail = { job: any; events: any[]; offers: any[]; rider: any; proofs: any[] };
const FAIL_REASONS = [['no_answer', 'Buyer not answering'], ['address_not_found', 'Address not found'], ['refused', 'Refused the parcel'], ['no_cash', 'Buyer had no cash'], ['reschedule', 'Asked for another day'], ['unsafe', 'Unsafe to deliver'], ['other', 'Other']];

export default function JobDrawer({ id, onClose, onChanged }: { id: string | null; onClose: () => void; onChanged?: () => void }) {
  const { can } = useSession();
  const [d, setD] = useState<Detail | null>(null);
  const [err, setErr] = useState<Error | null>(null);
  const [riders, setRiders] = useState<any[]>([]);
  const [riderId, setRiderId] = useState('');
  const [code, setCode] = useState('');
  const [failReason, setFailReason] = useState('no_answer');
  const [mode, setMode] = useState<'none' | 'deliver' | 'fail'>('none');
  const { busy, run } = useAction();

  const load = async () => {
    if (!id) return;
    try { setD(await get<Detail>(`/carrier/jobs/${id}`)); setErr(null); } catch (e) { setErr(e as Error); }
  };
  useEffect(() => {
    setD(null); setMode('none'); setCode('');
    void load();
    if (id && can('jobs.manage')) void get<{ items: any[] }>('/carrier/riders').then((r) => setRiders(r.items.filter((x) => x.is_active))).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const act = async (key: string, fn: () => Promise<unknown>, ok: string) => {
    const r = await run(key, fn, ok);
    if (r !== undefined) { await load(); onChanged?.(); setMode('none'); }
  };

  const j = d?.job;
  const openOffer = d?.offers.find((o) => o.status === 'offered');
  return (
    <Modal open={!!id} onClose={onClose} title={j ? `${j.reference} · ${j.item_title ?? 'Parcel'}` : 'Job'} wide>
      {err && <ErrorNote error={err} onRetry={load} />}
      {!d && !err && <Spinner />}
      {j && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <StageBadge stage={j.stage} />
            {j.env === 'test' && <span className="mambanda-badge">Sandbox</span>}
            <span className="text-sm text-mute">Updated {when(j.updated_at)}</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-p2 border border-line p-4 space-y-2 text-sm">
              <p className="text-xs uppercase tracking-wider text-mute font-semibold">Pickup</p>
              <p className="flex gap-2"><MapPin className="w-4 h-4 text-lime shrink-0" />{j.from_location}{j.pickup_address ? ` — ${j.pickup_address}` : ''}</p>
              {j.pickup_contact_name && <p className="flex gap-2"><User className="w-4 h-4 text-mute" />{j.pickup_contact_name}</p>}
              {j.pickup_phone && <p className="flex gap-2"><Phone className="w-4 h-4 text-mute" />{j.pickup_phone}</p>}
            </div>
            <div className="rounded-2xl bg-p2 border border-line p-4 space-y-2 text-sm">
              <p className="text-xs uppercase tracking-wider text-mute font-semibold">Delivery</p>
              <p className="flex gap-2"><MapPin className="w-4 h-4 text-lime shrink-0" />{j.to_location}{j.delivery_address ? ` — ${j.delivery_address}` : ''}</p>
              <p className="flex gap-2"><User className="w-4 h-4 text-mute" />{j.contact_name ?? '—'}</p>
              <p className="flex gap-2"><Phone className="w-4 h-4 text-mute" />{j.contact_phone ?? '—'}</p>
              {j.details_hidden && <p className="text-xs text-amber-300">Full buyer details appear once you accept the job.</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-p2 border border-line p-3"><p className="text-xs text-mute">Your fee</p><p className="font-extrabold">{xaf(j.quoted_total_cents)}</p></div>
            <div className="rounded-2xl bg-p2 border border-line p-3"><p className="text-xs text-mute">Collect at door</p><p className="font-extrabold text-lime">{xaf(j.amount_to_collect_cents)}</p></div>
            <div className="rounded-2xl bg-p2 border border-line p-3"><p className="text-xs text-mute">Attempts</p><p className="font-extrabold">{j.failed_attempts ?? 0}</p></div>
          </div>
          {j.note && <p className="text-sm text-mute border-l-2 border-lime pl-3">{j.note}</p>}

          {/* Actions */}
          {can('jobs.manage') && openOffer && (
            <div className="flex flex-wrap gap-2 items-center">
              <p className="text-sm text-amber-300 mr-auto">Offer expires {when(openOffer.expires_at).replace(' ago', '')}</p>
              <Button busy={busy === 'accept'} onClick={() => act('accept', () => post(`/carrier/jobs/${openOffer.id}/accept`), 'Job accepted')}>Accept job</Button>
              <Button variant="ghost" busy={busy === 'decline'} onClick={() => act('decline', () => post(`/carrier/jobs/${openOffer.id}/decline`, {}), 'Declined — back to Mambanda')}>Decline</Button>
            </div>
          )}

          {can('jobs.manage') && ['carrier_accepted', 'assigned'].includes(j.stage) && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={riderId} onChange={(e) => setRiderId(e.target.value)} className="flex-1">
                <option value="">{d.rider ? `Assigned: ${d.rider.name} — change…` : 'Choose a rider…'}</option>
                {riders.map((r) => <option key={r.id} value={r.id} disabled={r.availability_status === 'offline' && r.source === 'mambanda_app'}>{r.name} · {r.availability_status} · {xaf(r.cash_on_hand_cents)} held</option>)}
              </Select>
              <Button disabled={!riderId} busy={busy === 'assign'} onClick={() => act('assign', () => post(`/carrier/jobs/${id}/assign`, { rider_id: riderId }), 'Rider assigned')}>Assign</Button>
              {j.stage === 'assigned' && <Button variant="ghost" busy={busy === 'unassign'} onClick={() => act('unassign', () => post(`/carrier/jobs/${id}/unassign`), 'Rider removed')}>Unassign</Button>}
            </div>
          )}

          {can('jobs.scan') && (
            <div className="flex flex-wrap gap-2">
              {(NEXT_STAGES[j.stage] ?? []).map((to) => (
                <Button key={to} variant="ghost" size="sm" busy={busy === to} onClick={() => act(to, () => post(`/carrier/jobs/${id}/stage`, { to }), `Marked ${STAGES[to]?.label.toLowerCase()}`)}>{STAGES[to]?.label}</Button>
              ))}
              {j.stage === 'out_for_delivery' && <Button size="sm" onClick={() => setMode('deliver')}>Delivered…</Button>}
              {j.stage === 'out_for_delivery' && <Button variant="danger" size="sm" onClick={() => setMode('fail')}>Failed attempt…</Button>}
              {j.code_locked_at && can('jobs.manage') && <Button variant="ghost" size="sm" busy={busy === 'unlock'} onClick={() => act('unlock', () => post(`/carrier/jobs/${id}/unlock-code`), 'Code unlocked')}>Unlock code</Button>}
            </div>
          )}

          {mode === 'deliver' && (
            <form className="rounded-2xl border border-lime/40 p-4 space-y-3" onSubmit={(e) => { e.preventDefault(); void act('deliver', () => post(`/carrier/jobs/${id}/deliver`, { code }), 'Delivered'); }}>
              <Field label="Buyer's 6-digit code" hint="The buyer reads it from their Mambanda app. 5 wrong tries lock it."><Input inputMode="numeric" pattern="\d{6}" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} required /></Field>
              <Button type="submit" busy={busy === 'deliver'}>Confirm delivery</Button>
            </form>
          )}
          {mode === 'fail' && (
            <form className="rounded-2xl border border-rose-400/40 p-4 space-y-3" onSubmit={(e) => { e.preventDefault(); void act('fail', () => post(`/carrier/jobs/${id}/fail`, { reason: failReason }), 'Attempt recorded'); }}>
              <Field label="What happened?"><Select value={failReason} onChange={(e) => setFailReason(e.target.value)}>{FAIL_REASONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select></Field>
              <Button type="submit" variant="danger" busy={busy === 'fail'}>Record failed attempt</Button>
            </form>
          )}

          {d.rider && (
            <p className="text-sm"><span className="text-mute">Rider:</span> <b>{d.rider.name}</b> · {d.rider.phone}{d.rider.last_ping_at ? ` · last seen ${when(d.rider.last_ping_at)}` : ''}</p>
          )}

          <div>
            <p className="text-xs uppercase tracking-wider text-mute font-semibold mb-3">Timeline</p>
            <ol className="space-y-3 border-l border-line ml-2">
              {d.events.map((e) => (
                <li key={e.id} className="pl-4 relative">
                  <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-lime" />
                  <p className="text-sm font-semibold">{STAGES[e.event_type]?.label ?? e.event_type} <span className="text-xs text-mute font-normal">· {e.actor_type} · {when(e.happened_at)}</span></p>
                  {e.notes && <p className="text-xs text-mute">{e.notes}</p>}
                </li>
              ))}
              {d.events.length === 0 && <li className="pl-4 text-sm text-mute">No events yet.</li>}
            </ol>
          </div>
        </div>
      )}
    </Modal>
  );
}
