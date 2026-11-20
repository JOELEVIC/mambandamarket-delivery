'use client';

import React, { useEffect, useState } from 'react';
import { get, patch } from '@/lib/api';
import { useSession } from '@/lib/session';
import { Badge, Button, Card, Field, Input, PageHeader, Select, Spinner, Textarea, useAction } from '@/components/ui';

export default function SettingsPage() {
  const { can, me, reload } = useSession();
  const [p, setP] = useState<any | null>(null);
  const { busy, run } = useAction();
  useEffect(() => { void get<{ profile: any }>('/carrier/profile').then((r) => setP(r.profile)); }, [me?.active_carrier.carrier_id]);
  if (!p) return <Spinner />;
  const m = can('profile.manage');
  const owner = me?.active_carrier.role === 'owner';
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const body: Record<string, unknown> = {
      name: p.name, contact_email: p.contact_email || undefined, contact_phone: p.contact_phone || undefined, tax_id: p.tax_id || null,
      transport_license: p.transport_license || null, description: p.description || null, support_whatsapp: p.support_whatsapp || null,
      logo_url: p.logo_url || null,
    };
    if (owner) { body.settlement_channel = p.settlement_channel; body.settlement_details = p.settlement_details ?? {}; }
    if (await run('s', () => patch('/carrier/profile', body), 'Saved')) void reload();
  };
  const sd = p.settlement_details ?? {};
  return (
    <div>
      <PageHeader title="Company" subtitle="How buyers and Mambanda see your business." />
      <form onSubmit={save} className="grid lg:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <div className="flex items-center gap-2"><h2 className="font-extrabold">Business</h2><Badge tone={p.status === 'active' ? 'green' : 'amber'}>{p.status === 'active' ? 'verified' : p.status}</Badge></div>
          <Field label="Company name"><Input disabled={!m} value={p.name ?? ''} onChange={(e) => setP({ ...p, name: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="RCCM"><Input disabled={!m} value={p.transport_license ?? ''} onChange={(e) => setP({ ...p, transport_license: e.target.value })} /></Field>
            <Field label="NIU (tax id)"><Input disabled={!m} value={p.tax_id ?? ''} onChange={(e) => setP({ ...p, tax_id: e.target.value })} /></Field>
          </div>
          <Field label="Contact email"><Input type="email" disabled={!m} value={p.contact_email ?? ''} onChange={(e) => setP({ ...p, contact_email: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone"><Input disabled={!m} value={p.contact_phone ?? ''} onChange={(e) => setP({ ...p, contact_phone: e.target.value })} /></Field>
            <Field label="Support WhatsApp"><Input disabled={!m} value={p.support_whatsapp ?? ''} onChange={(e) => setP({ ...p, support_whatsapp: e.target.value })} /></Field>
          </div>
          <Field label="Logo URL"><Input disabled={!m} value={p.logo_url ?? ''} onChange={(e) => setP({ ...p, logo_url: e.target.value })} /></Field>
          <Field label="About"><Textarea rows={3} disabled={!m} value={p.description ?? ''} onChange={(e) => setP({ ...p, description: e.target.value })} /></Field>
        </Card>
        <Card className="space-y-4">
          <h2 className="font-extrabold">Where Mambanda pays you</h2>
          <p className="text-sm text-mute">Only the owner can change this. Statements in your favour are paid here.</p>
          <Field label="Method"><Select disabled={!owner} value={p.settlement_channel ?? 'momo'} onChange={(e) => setP({ ...p, settlement_channel: e.target.value })}><option value="momo">MTN MoMo</option><option value="orange_money">Orange Money</option><option value="bank">Bank transfer</option></Select></Field>
          <Field label={p.settlement_channel === 'bank' ? 'Account holder' : 'Account name'}><Input disabled={!owner} value={sd.account_name ?? ''} onChange={(e) => setP({ ...p, settlement_details: { ...sd, account_name: e.target.value } })} /></Field>
          <Field label={p.settlement_channel === 'bank' ? 'Bank and account number' : 'Mobile money number'}><Input disabled={!owner} value={sd.account_number ?? ''} onChange={(e) => setP({ ...p, settlement_details: { ...sd, account_number: e.target.value } })} /></Field>
          {m && <Button type="submit" busy={busy === 's'}>Save changes</Button>}
        </Card>
      </form>
    </div>
  );
}
