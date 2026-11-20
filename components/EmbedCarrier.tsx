'use client';

// Carrier screens for the embedded mode. They need the session context
// (permissions), which the provider loads from /carrier/me with the embed token.
import React, { useState } from 'react';
import { useApi, useSession } from '@/lib/session';
import { when, xaf } from '@/lib/format';
import { Card, Empty, Spinner, StageBadge, Stat } from './ui';
import JobDrawer from './JobDrawer';

export default function EmbedCarrier({ screen, params }: { screen: string; params: Record<string, string> }) {
  const { status } = useSession();
  const [open, setOpen] = useState<string | null>(screen === 'carrier.job' ? params.job_id ?? null : null);
  const inbox = useApi<{ items: any[] }>(screen === 'carrier.inbox' && status === 'ready' ? '/carrier/inbox' : null);
  const money = useApi<any>(screen === 'carrier.finance' && status === 'ready' ? '/carrier/finance/summary' : null);
  if (status !== 'ready') return <Spinner />;
  if (screen === 'carrier.finance') {
    return money.data ? (
      <div className="grid grid-cols-2 gap-4">
        <Stat label={money.data.balance_cents >= 0 ? 'You owe Mambanda' : 'Mambanda owes you'} value={xaf(Math.abs(money.data.balance_cents))} tone="lime" />
        <Stat label="Awaiting confirmation" value={xaf(money.data.pending_remittances_cents)} />
      </div>
    ) : <Spinner />;
  }
  return (
    <>
      {screen === 'carrier.inbox' && (
        <Card>
          {!inbox.data ? <Spinner /> : inbox.data.items.length === 0 ? <Empty title="No offers" /> : (
            <ul className="divide-y divide-line">{inbox.data.items.map((o) => (
              <li key={o.id}><button className="w-full text-left py-3 flex gap-3 items-center" onClick={() => setOpen(o.shipping_request_id)}>
                <div className="flex-1"><p className="font-bold text-sm">{o.job?.reference} · {o.job?.to_location}</p><p className="text-xs text-mute">expires {when(o.expires_at).replace(' ago', '')}</p></div>
                <StageBadge stage={o.job?.stage ?? 'offered'} /><span className="font-extrabold text-lime text-sm">{xaf(o.job?.quoted_total_cents)}</span>
              </button></li>
            ))}</ul>
          )}
        </Card>
      )}
      <JobDrawer id={open} onClose={() => setOpen(null)} onChanged={() => void inbox.reload()} />
    </>
  );
}
