'use client';

// "Become a delivery partner": a signed-in Mambanda user registers their
// company. It is created in status `applied` with them as owner — the portal
// opens for setup straight away, but no jobs arrive until Mambanda approves it
// (carrier-platform/16-carrier-onboarding.md).
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { activeCarrier, post } from '@/lib/api';
import { useSession } from '@/lib/session';
import { Button, Field, Input, Select, Textarea, useAction } from './ui';

const VEHICLES: Array<[string, string]> = [['moto', 'Motorbike'], ['bike', 'Bicycle'], ['tricycle', 'Tricycle'], ['car', 'Car'], ['van', 'Van'], ['truck', 'Truck']];

export default function ApplyForm({ onCancel }: { onCancel?: () => void }) {
  const router = useRouter();
  const { reload } = useSession();
  const { busy, run } = useAction();
  const [f, setF] = useState({
    name: '', legal_name: '', registration_number: '', tax_id: '', city: 'Douala', address: '', contact_phone: '', support_whatsapp: '',
    fleet_size: 1, vehicle_types: ['moto'] as string[], integration_tier: 'portal', description: '',
  });
  const set = (k: keyof typeof f, v: unknown) => setF((x) => ({ ...x, [k]: v }));
  const toggle = (v: string) => set('vehicle_types', f.vehicle_types.includes(v) ? f.vehicle_types.filter((x) => x !== v) : [...f.vehicle_types, v]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = Object.fromEntries(Object.entries({ ...f, fleet_size: Number(f.fleet_size) }).filter(([, v]) => v !== '' && !(Array.isArray(v) && v.length === 0)));
    const r = await run('apply', () => post<{ carrier: { id: string } }>('/carrier-applications', body), 'Company registered — finish the checklist to go live');
    if (!r) return;
    activeCarrier.set(r.carrier.id);
    await reload();
    router.push('/onboarding');
  };

  return (
    <form onSubmit={submit} className="space-y-4 text-left">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Trading name"><Input value={f.name} onChange={(e) => set('name', e.target.value)} required minLength={2} placeholder="Ola Trans" /></Field>
        <Field label="Legal name (as on the RCCM)"><Input value={f.legal_name} onChange={(e) => set('legal_name', e.target.value)} required minLength={2} placeholder="Ola Trans SARL" /></Field>
        <Field label="RCCM number" hint="Optional now, needed to go live"><Input value={f.registration_number} onChange={(e) => set('registration_number', e.target.value)} /></Field>
        <Field label="NIU (tax number)" hint="Optional now, needed to go live"><Input value={f.tax_id} onChange={(e) => set('tax_id', e.target.value)} /></Field>
        <Field label="City"><Select value={f.city} onChange={(e) => set('city', e.target.value)}>{['Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Garoua', 'Limbé', 'Buea', 'Kribi', 'Other'].map((c) => <option key={c}>{c}</option>)}</Select></Field>
        <Field label="Address"><Input value={f.address} onChange={(e) => set('address', e.target.value)} placeholder="Quartier, street, landmark" /></Field>
        <Field label="Company phone"><Input inputMode="tel" value={f.contact_phone} onChange={(e) => set('contact_phone', e.target.value)} required minLength={8} placeholder="6XX XX XX XX" /></Field>
        <Field label="Support WhatsApp"><Input inputMode="tel" value={f.support_whatsapp} onChange={(e) => set('support_whatsapp', e.target.value)} /></Field>
        <Field label="Riders / vehicles today"><Input type="number" min={1} value={f.fleet_size} onChange={(e) => set('fleet_size', e.target.value)} required /></Field>
        <Field label="How will you work with Mambanda?">
          <Select value={f.integration_tier} onChange={(e) => set('integration_tier', e.target.value)}>
            <option value="portal">This portal + the Mambanda rider app</option>
            <option value="api">Our own dispatch software (API)</option>
            <option value="oauth">Our own rider app (Sign in with Mambanda)</option>
            <option value="embed">Our own app, showing Mambanda screens (embed)</option>
          </Select>
        </Field>
      </div>
      <Field label="Vehicles">
        <div className="flex flex-wrap gap-2">
          {VEHICLES.map(([v, l]) => (
            <button type="button" key={v} onClick={() => toggle(v)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${f.vehicle_types.includes(v) ? 'bg-lime text-on-lime border-lime' : 'border-line text-mute hover:text-ink'}`}>{l}</button>
          ))}
        </div>
      </Field>
      <Field label="About your company"><Textarea rows={3} value={f.description} onChange={(e) => set('description', e.target.value)} placeholder="Areas you cover, years in business, what you deliver" /></Field>
      <p className="text-xs text-mute">You become the owner of this company on Mambanda. Nothing is published until Mambanda has checked your documents.</p>
      <div className="flex gap-2">
        <Button type="submit" busy={busy === 'apply'} disabled={f.vehicle_types.length === 0}>Register my company</Button>
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel}>Back</Button>}
      </div>
    </form>
  );
}
