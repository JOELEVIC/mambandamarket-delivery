'use client';

// The full portal guide: everything the first-use tour covers, kept on one
// page so staff can come back to it. Sections a role cannot use are hidden.
import React from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/session';
import { GUIDE } from '@/components/Guide';
import { Card, PageHeader } from '@/components/ui';

export default function GuidePage() {
  const { can, me } = useSession();
  const sections = GUIDE.filter((g) => !g.perm || can(g.perm));
  return (
    <div>
      <PageHeader title="Guide" subtitle={`How ${me?.active_carrier.name ?? 'your company'} works with Mambanda, step by step.`} />
      <div className="grid lg:grid-cols-2 gap-6">
        {sections.map((g, i) => (
          <Card key={g.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold"><span className="text-lime mr-2">{i + 1}.</span>{g.title}</h2>
              {g.href && <Link href={g.href} className="text-sm font-semibold text-lime hover:underline">Open</Link>}
            </div>
            <ul className="space-y-2 text-sm list-disc pl-5 text-mute">{g.points.map((p) => <li key={p}>{p}</li>)}</ul>
          </Card>
        ))}
        <Card className="space-y-2">
          <h2 className="font-extrabold">Riders use the app, not this portal</h2>
          <p className="text-sm text-mute">The Mambanda Delivery app walks each rider through availability, jobs, the buyer’s code and cash the first time they open it. Riders who sign in here are sent to “My deliveries”.</p>
        </Card>
        <Card className="space-y-2">
          <h2 className="font-extrabold">Need help?</h2>
          <p className="text-sm text-mute">Write to Mambanda from Support. Disputes about a statement line are answered within 5 working days.</p>
          <Link href="/support" className="text-sm font-semibold text-lime hover:underline">Open Support</Link>
        </Card>
      </div>
    </div>
  );
}
