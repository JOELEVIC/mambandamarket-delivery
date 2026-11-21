'use client';

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { get, post } from '@/lib/api';
import { useApi, useSession } from '@/lib/session';
import { day, ENTRY_LABEL, when, xaf } from '@/lib/format';
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, Modal, PageHeader, Select, Spinner, Stat, Table, Tabs, Textarea, useAction } from '@/components/ui';
import { PageTip } from '@/components/Guide';

type Tab = 'ledger' | 'remittances' | 'statements';
const METHOD: Record<string, string> = { cash: 'Cash', mtn_momo: 'MTN MoMo', orange_money: 'Orange Money', bank: 'Bank' };

export default function FinancePage() {
  const { can } = useSession();
  const [tab, setTab] = useState<Tab>('ledger');
  const sum = useApi<any>('/carrier/finance/summary');
  const ledger = useApi<{ items: any[]; total: number }>(tab === 'ledger' ? '/carrier/ledger?limit=200' : null);
  const rem = useApi<{ items: any[] }>(tab === 'remittances' ? '/carrier/remittances?limit=100' : null);
  const st = useApi<{ items: any[] }>(tab === 'statements' ? '/carrier/settlements' : null);
  const riders = useApi<{ items: any[] }>('/carrier/riders');
  const [declare, setDeclare] = useState<null | { kind: string; rider_id?: string; amount: number; method: string; reference: string }>(null);
  const [open, setOpen] = useState<any | null>(null);
  const [dispute, setDispute] = useState<{ entry: any; reason: string } | null>(null);
  // Pay what we owe straight by MTN MoMo: the prompt lands on the number given,
  // and the remittance confirms itself once MTN says SUCCESSFUL.
  const [momo, setMomo] = useState<null | { amount: number; msisdn: string; txId?: string; status?: string; reason?: string | null }>(null);
  const payMomo = async (e: React.FormEvent) => {
    e.preventDefault();
    const m = momo!;
    const r = await run('momo', () => post<{ momo: { id: string; status: string } }>('/carrier/remittances/momo', { amount_cents: Number(m.amount), msisdn: m.msisdn }),
      'Approve the payment on the phone (MoMo prompt or *126#)');
    if (!r) return;
    setMomo({ ...m, txId: r.momo.id, status: 'pending' });
    for (let i = 0; i < 20; i++) {
      await new Promise((ok) => setTimeout(ok, 4000));
      const s = await post<{ momo: { status: string; failure_reason: string | null } }>(`/carrier/remittances/momo/${r.momo.id}/refresh`).catch(() => null);
      if (s && s.momo.status !== 'pending') {
        setMomo((cur) => cur && { ...cur, status: s.momo.status, reason: s.momo.failure_reason });
        void sum.reload(); void rem.reload(); void ledger.reload();
        return;
      }
    }
  };
  const { busy, run } = useAction();

  const s = sum.data;
  const owe = (s?.balance_cents ?? 0) >= 0;

  const exportCsv = () => {
    const rows = [['date', 'type', 'reference', 'amount_fcfa', 'memo'], ...(ledger.data?.items ?? []).map((e) => [e.created_at, e.entry_type, e.shipping_requests?.reference ?? e.reference ?? '', e.amount_cents, (e.memo ?? '').replace(/,/g, ' ')])];
    const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'mambanda-ledger.csv'; a.click();
  };

  const submitDeclare = async (e: React.FormEvent) => {
    e.preventDefault();
    const d = declare!;
    const r = await run('dec', () => post('/carrier/remittances', { kind: d.kind, rider_id: d.rider_id || undefined, amount_cents: Number(d.amount), method: d.method, reference: d.reference || undefined }),
      d.kind === 'carrier_remit' ? 'Declared — Mambanda confirms once the money arrives' : 'Hand-over recorded');
    if (r) { setDeclare(null); void sum.reload(); void rem.reload(); }
  };
  const openStatement = async (id: string) => setOpen(await get(`/carrier/settlements/${id}`));

  return (
    <div>
      <PageHeader title="Money" subtitle="Cash collected for Mambanda, your fees, what you remitted and your statements."
        actions={<>
          {can('cod.confirm') && <Button variant="ghost" onClick={() => setDeclare({ kind: 'rider_handover', amount: 0, method: 'cash', reference: '' })}>Rider handed cash in</Button>}
          {can('finance.manage') && <Button variant="ghost" onClick={() => setDeclare({ kind: 'carrier_remit', amount: Math.max(0, s?.balance_cents ?? 0), method: 'mtn_momo', reference: '' })}>Declare a transfer</Button>}
          {can('finance.manage') && <Button onClick={() => setMomo({ amount: Math.max(0, s?.balance_cents ?? 0), msisdn: '' })}>Pay by MoMo</Button>}
        </>} />
      <PageTip id="money" title="Remit cash within 48 hours" href="/guide">Cash your riders collect belongs to Mambanda until you remit it. Pay by MoMo confirms by itself; a declared transfer is confirmed by Mambanda. After 5 days unpaid, cash-on-delivery jobs pause.</PageTip>

      <ErrorNote error={sum.error} onRetry={sum.reload} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat label={owe ? 'You owe Mambanda' : 'Mambanda owes you'} value={s ? xaf(Math.abs(s.balance_cents)) : '—'} tone={s?.cod_state === 'ok' ? 'lime' : s?.cod_state === 'due' ? 'amber' : 'red'} />
        <Stat label="Awaiting confirmation" value={s ? xaf(s.pending_remittances_cents) : '—'} hint="Remittances you declared" />
        <Stat label="Oldest unremitted cash" value={s?.oldest_unremitted_at ? when(s.oldest_unremitted_at) : '—'} hint="Due 48 h after delivery" />
        <Stat label="Cash with riders" value={s ? xaf((s.riders_cash ?? []).reduce((a: number, r: any) => a + Number(r.cash_on_hand_cents), 0)) : '—'} />
      </div>
      {s && s.cod_state !== 'ok' && (
        <div className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-100 text-sm px-4 py-3">
          {s.cod_state === 'due' && 'Cash collected more than 48 hours ago is due. Remit it to keep receiving cash-on-delivery jobs.'}
          {s.cod_state === 'blocked' && 'Cash older than 5 days: new cash-on-delivery jobs are paused until you remit.'}
          {s.cod_state === 'suspend' && 'Cash older than 10 days: your account will be suspended. Remit now and contact Mambanda.'}
        </div>
      )}

      <Tabs value={tab} onChange={setTab} tabs={[{ id: 'ledger', label: 'Ledger' }, { id: 'remittances', label: 'Remittances' }, { id: 'statements', label: 'Statements' }]} />

      {tab === 'ledger' && (
        <Card>
          <div className="flex justify-between mb-3"><p className="text-sm text-mute">Positive lines add to what you owe; negative lines reduce it.</p><Button size="sm" variant="ghost" onClick={exportCsv}><Download className="w-4 h-4" />CSV</Button></div>
          {ledger.loading && !ledger.data ? <Spinner /> : (ledger.data?.items.length ?? 0) === 0 ? <Empty title="No money movements yet">Lines appear when your riders deliver.</Empty> : (
            <Table head={['Date', 'What', 'Job', 'Amount', 'Statement']}>
              {ledger.data!.items.map((e) => (
                <tr key={e.id}>
                  <td className="py-2.5 pr-4 text-mute whitespace-nowrap">{day(e.created_at)}</td>
                  <td className="py-2.5 pr-4">{ENTRY_LABEL[e.entry_type] ?? e.entry_type}{e.method ? <span className="text-xs text-mute"> · {METHOD[e.method]}</span> : null}</td>
                  <td className="py-2.5 pr-4">{e.shipping_requests?.reference ?? e.reference ?? '—'}</td>
                  <td className={`py-2.5 pr-4 font-bold whitespace-nowrap ${e.amount_cents > 0 ? 'text-ink' : 'text-lime'}`}>{e.amount_cents > 0 ? '+' : '−'}{xaf(Math.abs(e.amount_cents))}</td>
                  <td className="py-2.5 pr-4">{e.settlement_id ? <Badge tone="mute">settled</Badge> : <Badge tone="amber">open</Badge>}</td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      )}

      {tab === 'remittances' && (
        <Card>
          {rem.loading && !rem.data ? <Spinner /> : (rem.data?.items.length ?? 0) === 0 ? <Empty title="No remittances yet" /> : (
            <Table head={['Date', 'Kind', 'Rider', 'Amount', 'Method', 'Reference', 'Status', '']}>
              {rem.data!.items.map((r) => (
                <tr key={r.id}>
                  <td className="py-2.5 pr-4 text-mute whitespace-nowrap">{day(r.created_at)}</td>
                  <td className="py-2.5 pr-4">{r.kind === 'carrier_remit' ? 'To Mambanda' : r.kind === 'rider_remit' ? 'Rider → Mambanda' : 'Rider → hub'}</td>
                  <td className="py-2.5 pr-4">{r.carrier_riders?.name ?? '—'}</td>
                  <td className="py-2.5 pr-4 font-bold">{xaf(r.amount_cents)}</td>
                  <td className="py-2.5 pr-4">{METHOD[r.method]}</td>
                  <td className="py-2.5 pr-4 text-mute">{r.reference ?? '—'}</td>
                  <td className="py-2.5 pr-4"><Badge tone={r.status === 'confirmed' ? 'green' : r.status === 'rejected' ? 'red' : 'amber'}>{r.status}</Badge>{r.reject_reason && <p className="text-xs text-rose-300">{r.reject_reason}</p>}</td>
                  <td className="py-2.5 text-right">{r.kind === 'rider_handover' && r.status === 'declared' && can('cod.confirm') && (
                    <span className="space-x-1"><Button size="sm" busy={busy === `c${r.id}`} onClick={() => run(`c${r.id}`, () => post(`/carrier/remittances/${r.id}/review`, { decision: 'confirmed' }), 'Confirmed').then(() => rem.reload())}>Received</Button>
                      <Button size="sm" variant="danger" onClick={() => run(`r${r.id}`, () => post(`/carrier/remittances/${r.id}/review`, { decision: 'rejected', reason: 'Not received' }), 'Rejected').then(() => rem.reload())}>Not received</Button></span>
                  )}</td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      )}

      {tab === 'statements' && (
        <Card>
          {st.loading && !st.data ? <Spinner /> : (st.data?.items.length ?? 0) === 0 ? <Empty title="No statements yet">Mambanda issues one every week (Monday) for the week before.</Empty> : (
            <Table head={['Period', 'Cash collected', 'Your fees', 'Mambanda fee', 'Remitted', 'Balance', 'Status']}>
              {st.data!.items.map((x) => (
                <tr key={x.id} onClick={() => openStatement(x.id)} className="cursor-pointer hover:bg-p2/60">
                  <td className="py-2.5 pr-4 whitespace-nowrap">{day(x.statement_period_start)} – {day(x.statement_period_end)}</td>
                  <td className="py-2.5 pr-4">{xaf(x.total_cod_collected_cents)}</td>
                  <td className="py-2.5 pr-4">{xaf(x.delivery_fees_cents)}</td>
                  <td className="py-2.5 pr-4">{xaf(x.commission_cents)}</td>
                  <td className="py-2.5 pr-4">{xaf(x.remitted_cents)}</td>
                  <td className="py-2.5 pr-4 font-bold">{x.balance_cents >= 0 ? `You owe ${xaf(x.balance_cents)}` : `We owe ${xaf(-x.balance_cents)}`}</td>
                  <td className="py-2.5 pr-4"><Badge tone={x.status === 'paid' ? 'green' : x.status === 'disputed' ? 'red' : x.status === 'agreed' ? 'blue' : 'amber'}>{x.status}</Badge></td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      )}

      <Modal open={!!declare} onClose={() => setDeclare(null)} title={declare?.kind === 'carrier_remit' ? 'Declare a remittance to Mambanda' : 'Cash handed in by a rider'}>
        {declare && (
          <form onSubmit={submitDeclare} className="space-y-4">
            {declare.kind === 'rider_handover' && (
              <Field label="Rider"><Select value={declare.rider_id ?? ''} onChange={(e) => setDeclare({ ...declare, rider_id: e.target.value })} required>
                <option value="">Choose…</option>{(riders.data?.items ?? []).map((r) => <option key={r.id} value={r.id}>{r.name} · holds {xaf(r.cash_on_hand_cents)}</option>)}
              </Select></Field>
            )}
            <Field label="Amount (FCFA)"><Input type="number" min={1} value={declare.amount} onChange={(e) => setDeclare({ ...declare, amount: Number(e.target.value) })} required /></Field>
            <Field label="How"><Select value={declare.method} onChange={(e) => setDeclare({ ...declare, method: e.target.value })}>{(declare.kind === 'carrier_remit' ? ['mtn_momo', 'orange_money', 'bank', 'cash'] : ['cash', 'mtn_momo', 'orange_money']).map((m) => <option key={m} value={m}>{METHOD[m]}</option>)}</Select></Field>
            {declare.method !== 'cash' && <Field label="Transaction reference" hint="From the MoMo / Orange Money SMS or bank slip"><Input value={declare.reference} onChange={(e) => setDeclare({ ...declare, reference: e.target.value })} required /></Field>}
            <Button type="submit" busy={busy === 'dec'} className="w-full">Record</Button>
          </form>
        )}
      </Modal>

      <Modal open={!!momo} onClose={() => setMomo(null)} title="Pay Mambanda by MTN MoMo">
        {momo && !momo.txId && (
          <form onSubmit={payMomo} className="space-y-4">
            <p className="text-sm text-mute">We send a payment request to this number. Approve it on the phone and the money is credited to your balance automatically — no reference to type.</p>
            <Field label="Amount (FCFA)"><Input type="number" min={1} value={momo.amount} onChange={(e) => setMomo({ ...momo, amount: Number(e.target.value) })} required /></Field>
            <Field label="MTN MoMo number that pays" hint="6XX XX XX XX"><Input inputMode="tel" value={momo.msisdn} onChange={(e) => setMomo({ ...momo, msisdn: e.target.value })} required /></Field>
            <Button type="submit" busy={busy === 'momo'} className="w-full">Send payment request</Button>
          </form>
        )}
        {momo?.txId && (
          <div className="space-y-3 text-sm">
            {momo.status === 'pending' && <><Spinner label="Waiting for the approval on the phone…" /><p className="text-mute">Dial *126# if the prompt did not appear. You can close this window; the payment still counts when it is approved.</p></>}
            {momo.status === 'succeeded' && <p className="text-lime font-bold">Paid. {xaf(momo.amount)} is off your balance.</p>}
            {momo.status === 'failed' && <p className="text-rose-300">Not paid: {momo.reason ?? 'the request was declined or timed out'}. Nothing was taken; try again.</p>}
            <Button variant="ghost" className="w-full" onClick={() => setMomo(null)}>Close</Button>
          </div>
        )}
      </Modal>

      <Modal open={!!open} onClose={() => setOpen(null)} title="Statement" wide>
        {open && (
          <div className="space-y-4">
            <p className="text-sm">{day(open.settlement.statement_period_start)} – {day(open.settlement.statement_period_end)} · <Badge tone="lime">{open.settlement.status}</Badge></p>
            <Table head={['Date', 'Line', 'Job', 'Amount', '']}>
              {open.lines.map((l: any) => {
                const d = open.disputes.find((x: any) => x.entry_id === l.id);
                return (
                  <tr key={l.id}>
                    <td className="py-2 pr-4 text-mute">{day(l.created_at)}</td><td className="py-2 pr-4">{ENTRY_LABEL[l.entry_type]}</td>
                    <td className="py-2 pr-4">{l.shipping_requests?.reference ?? '—'}</td><td className="py-2 pr-4 font-bold">{xaf(l.amount_cents)}</td>
                    <td className="py-2 text-right">{d ? <Badge tone={d.status === 'open' ? 'amber' : d.status === 'upheld' ? 'green' : 'red'}>dispute {d.status}</Badge>
                      : ['issued', 'disputed'].includes(open.settlement.status) && can('finance.manage') && <button className="text-xs text-rose-300" onClick={() => setDispute({ entry: l, reason: '' })}>Dispute</button>}</td>
                  </tr>
                );
              })}
            </Table>
            <p className="font-extrabold">{open.settlement.balance_cents >= 0 ? `Balance: you owe ${xaf(open.settlement.balance_cents)}` : `Balance: Mambanda owes you ${xaf(-open.settlement.balance_cents)}`}</p>
            {['issued', 'disputed'].includes(open.settlement.status) && can('finance.manage') && (
              <Button busy={busy === 'agree'} onClick={async () => { if (await run('agree', () => post(`/carrier/settlements/${open.settlement.id}/agree`), 'Statement agreed')) { setOpen(null); void st.reload(); } }}>Agree statement</Button>
            )}
          </div>
        )}
      </Modal>
      <Modal open={!!dispute} onClose={() => setDispute(null)} title="Dispute a line">
        {dispute && (
          <form className="space-y-4" onSubmit={async (e) => { e.preventDefault(); if (await run('disp', () => post(`/carrier/settlements/${open.settlement.id}/disputes`, { entry_id: dispute.entry.id, reason: dispute.reason }), 'Dispute sent; Mambanda answers within 5 working days')) { setDispute(null); await openStatement(open.settlement.id); } }}>
            <p className="text-sm">{ENTRY_LABEL[dispute.entry.entry_type]} · {xaf(dispute.entry.amount_cents)}</p>
            <Field label="What is wrong?"><Textarea rows={4} value={dispute.reason} onChange={(e) => setDispute({ ...dispute, reason: e.target.value })} required minLength={5} /></Field>
            <Button type="submit" variant="danger" busy={busy === 'disp'} className="w-full">Send dispute</Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
