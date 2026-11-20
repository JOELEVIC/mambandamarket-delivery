'use client';

import React from 'react';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { useSession } from '@/lib/session';
import { Card, PageHeader } from '@/components/ui';

const DESK_WHATSAPP = process.env.NEXT_PUBLIC_DESK_WHATSAPP ?? '';
const DESK_EMAIL = process.env.NEXT_PUBLIC_DESK_EMAIL ?? 'delivery@mambandamarket.com';

export default function SupportPage() {
  const { me } = useSession();
  const subject = encodeURIComponent(`[${me?.active_carrier.name ?? 'Carrier'}] `);
  return (
    <div>
      <PageHeader title="Support" subtitle="Talk to the Mambanda delivery desk." />
      <div className="grid sm:grid-cols-3 gap-4">
        {DESK_WHATSAPP && (
          <a href={`https://wa.me/${DESK_WHATSAPP.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer"><Card hover><MessageCircle className="w-6 h-6 text-lime mb-3" /><p className="font-extrabold">WhatsApp</p><p className="text-sm text-mute">Fastest for a job on the road.</p></Card></a>
        )}
        <a href={`mailto:${DESK_EMAIL}?subject=${subject}`}><Card hover><Mail className="w-6 h-6 text-lime mb-3" /><p className="font-extrabold">Email</p><p className="text-sm text-mute">{DESK_EMAIL}</p></Card></a>
        <Card><Phone className="w-6 h-6 text-lime mb-3" /><p className="font-extrabold">Disputes and money</p><p className="text-sm text-mute">Dispute a statement line from Money → Statements; we answer within 5 working days.</p></Card>
      </div>
    </div>
  );
}
