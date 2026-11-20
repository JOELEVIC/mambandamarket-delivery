'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useApi } from '@/lib/session';
import { when, xaf } from '@/lib/format';
import { Card, Empty, ErrorNote, Input, PageHeader, Spinner, StageBadge, Table, Tabs } from '@/components/ui';
import JobDrawer from '@/components/JobDrawer';

type Tab = 'offers' | 'open' | 'done' | 'test';

export default function JobsPage() {
  const [tab, setTab] = useState<Tab>('offers');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const inbox = useApi<{ items: any[]; total: number }>('/carrier/inbox?limit=100');
  const path = tab === 'offers' ? null : tab === 'test'
    ? '/carrier/jobs?scope=all&env=test&limit=100'
    : `/carrier/jobs?scope=${tab}&limit=100${q ? `&q=${encodeURIComponent(q)}` : ''}`;
  const jobs = useApi<{ items: any[]; total: number }>(path);
  const rows = tab === 'offers' ? (inbox.data?.items ?? []).map((o) => ({ ...o.job, offer: o })) : jobs.data?.items ?? [];
  const loading = tab === 'offers' ? inbox.loading && !inbox.data : jobs.loading && !jobs.data;

  return (
    <div>
      <PageHeader title="Jobs" subtitle="Offers from Mambanda, jobs in progress and the history." />
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <Tabs value={tab} onChange={setTab} tabs={[{ id: 'offers', label: 'Offers', count: inbox.data?.total }, { id: 'open', label: 'In progress' }, { id: 'done', label: 'Finished' }, { id: 'test', label: 'Sandbox' }]} />
        {tab !== 'offers' && (
          <div className="relative mb-6 sm:w-64"><Search className="w-4 h-4 absolute left-3 top-3 text-mute" /><Input className="pl-9" placeholder="MB-10234" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        )}
      </div>
      <Card>
        <ErrorNote error={tab === 'offers' ? inbox.error : jobs.error} />
        {loading ? <Spinner /> : rows.length === 0 ? <Empty title={tab === 'offers' ? 'No open offers' : 'No jobs here'} /> : (
          <Table head={['Reference', 'Route', 'Buyer', 'Your fee', 'Collect', 'Stage', 'Updated']}>
            {rows.map((j: any) => (
              <tr key={j.id} onClick={() => setOpen(j.id)} className="cursor-pointer hover:bg-p2/60">
                <td className="py-3 pr-4 font-bold whitespace-nowrap">{j.reference}</td>
                <td className="py-3 pr-4">{j.from_location} → {j.to_location}</td>
                <td className="py-3 pr-4 whitespace-nowrap">{j.contact_name ?? '—'}</td>
                <td className="py-3 pr-4 whitespace-nowrap">{xaf(j.quoted_total_cents)}</td>
                <td className="py-3 pr-4 whitespace-nowrap text-lime">{xaf(j.amount_to_collect_cents)}</td>
                <td className="py-3 pr-4"><StageBadge stage={j.stage} /></td>
                <td className="py-3 pr-4 text-mute whitespace-nowrap">{when(j.offer?.expires_at ? j.offer.offered_at : j.updated_at)}</td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
      <JobDrawer id={open} onClose={() => setOpen(null)} onChanged={() => { void inbox.reload(); void jobs.reload(); }} />
    </div>
  );
}
