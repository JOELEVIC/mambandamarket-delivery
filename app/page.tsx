'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useApi, useSession } from '@/lib/session';
import { when, xaf } from '@/lib/format';
import { Card, Empty, ErrorNote, PageHeader, Spinner, StageBadge, Stat } from '@/components/ui';
import JobDrawer from '@/components/JobDrawer';

export default function ControlTower() {
  const { me, can } = useSession();
  const inbox = useApi<{ items: any[]; total: number }>('/carrier/inbox?limit=10');
  const jobs = useApi<{ items: any[]; total: number }>('/carrier/jobs?scope=open&limit=12');
  const riders = useApi<{ items: any[] }>(can('riders.view') ? '/carrier/riders' : null);
  const money = useApi<any>(can('finance.view') ? '/carrier/finance/summary' : null);
  const score = useApi<any>('/carrier/scorecards');
  const [open, setOpen] = useState<string | null>(null);
  const refresh = () => { void inbox.reload(); void jobs.reload(); void riders.reload(); void money.reload(); };

  const online = (riders.data?.items ?? []).filter((r) => r.is_active && r.availability_status !== 'offline').length;
  const codTone = money.data?.cod_state === 'ok' ? undefined : money.data?.cod_state === 'due' ? 'amber' : 'red';

  return (
    <div>
      <PageHeader title={`Good day, ${me?.active_carrier.name}`} subtitle="What needs you now." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat label="New offers" value={inbox.data?.total ?? '—'} tone={(inbox.data?.total ?? 0) > 0 ? 'lime' : undefined} hint="Answer within 30 minutes" />
        <Stat label="Jobs in progress" value={jobs.data?.total ?? '—'} />
        <Stat label="Riders on duty" value={riders.data ? `${online}/${riders.data.items.filter((r) => r.is_active).length}` : '—'} />
        {money.data
          ? <Stat label={money.data.balance_cents >= 0 ? 'You owe Mambanda' : 'Mambanda owes you'} value={xaf(Math.abs(money.data.balance_cents))} tone={codTone as any}
              hint={money.data.cod_state === 'due' ? 'Remittance due' : money.data.cod_state === 'blocked' ? 'COD jobs blocked — remit now' : money.data.cod_state === 'suspend' ? 'Overdue: account at risk' : 'Up to date'} />
          : <Stat label="Success rate (30 d)" value={score.data?.success_rate != null ? `${Math.round(score.data.success_rate * 100)}%` : '—'} />}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold">Offers waiting</h2>
            <Link href="/jobs" className="text-sm text-lime font-semibold flex items-center gap-1">All jobs <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <ErrorNote error={inbox.error} onRetry={inbox.reload} />
          {inbox.loading && !inbox.data ? <Spinner /> : (inbox.data?.items.length ?? 0) === 0 ? <Empty title="No offers right now">New jobs from Mambanda appear here.</Empty> : (
            <ul className="divide-y divide-line">
              {inbox.data!.items.map((o) => (
                <li key={o.id}><button onClick={() => setOpen(o.shipping_request_id)} className="w-full text-left py-3 flex items-center gap-3 hover:bg-p2/50 rounded-xl px-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{o.job?.reference} · {o.job?.from_location} → {o.job?.to_location}</p>
                    <p className="text-xs text-mute">{o.job?.item_title} · collect {xaf(o.job?.amount_to_collect_cents)} · expires {when(o.expires_at).replace(' ago', '')}</p>
                  </div>
                  <span className="font-extrabold text-lime text-sm">{xaf(o.job?.quoted_total_cents)}</span>
                </button></li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="font-extrabold mb-4">On the road</h2>
          <ErrorNote error={jobs.error} onRetry={jobs.reload} />
          {jobs.loading && !jobs.data ? <Spinner /> : (jobs.data?.items.length ?? 0) === 0 ? <Empty title="Nothing in progress" /> : (
            <ul className="divide-y divide-line">
              {jobs.data!.items.filter((j) => j.stage !== 'offered').map((j) => (
                <li key={j.id}><button onClick={() => setOpen(j.id)} className="w-full text-left py-3 flex items-center gap-3 hover:bg-p2/50 rounded-xl px-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{j.reference} · {j.to_location}</p>
                    <p className="text-xs text-mute">{j.contact_name ?? 'Buyer'} · {when(j.updated_at)}</p>
                  </div>
                  <StageBadge stage={j.stage} />
                </button></li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      <JobDrawer id={open} onClose={() => setOpen(null)} onChanged={refresh} />
    </div>
  );
}
