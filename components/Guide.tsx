'use client';

// First-use help for the carrier portal (carrier-platform/16-carrier-onboarding.md §10):
//   * WelcomeTour — once per person and company, steps depend on their role;
//   * PageTip     — one dismissible tip at the top of a page;
//   * GUIDE       — the full guide, shown on /guide and reused by the tour.
// "Seen" flags live in localStorage: losing them only shows a tip again.
import React, { useState } from 'react';
import Link from 'next/link';
import { Lightbulb, X } from 'lucide-react';
import { useSession } from '@/lib/session';
import { Button, Modal } from './ui';

function seen(key: string): boolean {
  try { return window.localStorage.getItem(key) === '1'; } catch { return true; }
}
function markSeen(key: string) {
  try { window.localStorage.setItem(key, '1'); } catch { /* private mode: show again next time */ }
}

export type GuideSection = { id: string; title: string; perm: string | null; points: string[]; href?: string };

/** The guide, in the order a new company meets things. */
export const GUIDE: GuideSection[] = [
  {
    id: 'verify', title: 'Get verified', perm: 'profile.view', href: '/onboarding',
    points: [
      'Until Mambanda approves your company you can set everything up, but no jobs arrive.',
      'Get verified lists what is missing, each step with a link to the page that fixes it.',
      'Upload your RCCM, NIU, transport licence, goods-in-transit insurance and the manager’s ID, accept the carrier agreement, then press Submit. Review usually takes 2 working days.',
    ],
  },
  {
    id: 'setup', title: 'Coverage & tariffs', perm: 'setup.view', href: '/setup',
    points: [
      'Add at least one hub: where parcels are dropped and riders start.',
      'Coverage zones are the neighbourhoods you deliver to. Buyers only see you on routes your published rate card covers.',
      'A rate card is a draft until you publish it. You can import your tariff as CSV. Prices are rounded up to 25 FCFA.',
    ],
  },
  {
    id: 'fleet', title: 'Riders', perm: 'riders.view', href: '/fleet',
    points: [
      'Add a rider with their phone number: they get an invite code (share it by WhatsApp, or by email if you add one).',
      'In the Mambanda Delivery app they tap “I have an invite code” and are linked to your company automatically.',
      'The cash limit stops new cash-on-delivery jobs once a rider holds that much. Removing a rider takes them out of your fleet straight away.',
    ],
  },
  {
    id: 'jobs', title: 'Jobs', perm: 'jobs.view', href: '/jobs',
    points: [
      'A buyer who picks you creates an offer. Accept it before the countdown ends, or it goes to another company.',
      'The buyer’s name and phone appear once you accept. Assign an available rider; the buyer follows the parcel live.',
      'At the door the rider enters the buyer’s 6-digit code. Five wrong tries lock it; a manager can unlock it from the job.',
      'Failed delivery: the rider picks a reason. After the second failed attempt the parcel goes back to the seller.',
    ],
  },
  {
    id: 'money', title: 'Money', perm: 'finance.view', href: '/finance',
    points: [
      'Cash a rider collects belongs to Mambanda until you remit it. Your delivery fee is deducted on your ledger.',
      'Remit within 48 hours: Money → Pay by MoMo (confirms by itself), or declare a transfer with its reference.',
      'After 5 days unpaid, cash-on-delivery jobs pause; after 10 days the account is suspended.',
      'Each week you get a statement. Agree it, or dispute a single line with a reason.',
    ],
  },
  {
    id: 'team', title: 'Your team', perm: 'team.view', href: '/team',
    points: [
      'Owners and managers invite staff by email. Roles: manager, dispatcher (jobs and riders), finance (money), hub agent (scans and cash hand-overs), viewer.',
      'Only the owner can change where Mambanda pays you.',
    ],
  },
];

/** Shown once per person and company after the portal opens. */
export function WelcomeTour() {
  const { me, can, status } = useSession();
  const [dismissed, setDismissed] = useState(false);
  const [step, setStep] = useState(0);
  const key = me ? `mk-tour-v1:${me.user.id}:${me.active_carrier.carrier_id}` : '';
  // Only reached in the browser: the shell renders a spinner until the session
  // is ready, so reading localStorage while rendering cannot mismatch the server.
  const open = status === 'ready' && !!me && me.active_carrier.role !== 'rider' && !!key && !dismissed && !seen(key)
  if (!open || !me) return null;
  const steps = GUIDE.filter((g) => !g.perm || can(g.perm)).filter((g) => g.id !== 'verify' || me.active_carrier.status !== 'active');
  const close = () => { markSeen(key); setDismissed(true); };
  const s = steps[step];
  if (!s) return null;
  return (
    <Modal open onClose={close} title={step === 0 ? `Welcome to your portal, ${me.active_carrier.name}` : s.title}>
      {step === 0 && <p className="text-sm text-mute mb-4">A one-minute tour of what you can do here. You can reopen it any time from Guide in the menu.</p>}
      {step === 0 && <h3 className="font-extrabold mb-2">{s.title}</h3>}
      <ul className="space-y-2 text-sm list-disc pl-5">{s.points.map((p) => <li key={p}>{p}</li>)}</ul>
      <div className="flex items-center justify-between mt-6">
        <span className="text-xs text-mute">{step + 1} / {steps.length}</span>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={close}>Skip</Button>
          {step < steps.length - 1
            ? <Button onClick={() => setStep(step + 1)}>Next</Button>
            : <Button onClick={close}>{me.active_carrier.status === 'active' ? 'Start' : 'Go to Get verified'}</Button>}
        </div>
      </div>
    </Modal>
  );
}

/** A dismissible tip at the top of a page; gone for good once closed. */
export function PageTip({ id, title, children, href, cta }: { id: string; title: string; children: React.ReactNode; href?: string; cta?: string }) {
  const { me } = useSession();
  const key = me ? `mk-tip-v1:${me.user.id}:${id}` : '';
  const [dismissed, setDismissed] = useState(false);
  // Pages render after sign-in, in the browser only (see WelcomeTour).
  if (dismissed || !key || seen(key)) return null;
  return (
    <div className="mb-6 rounded-2xl border border-lime/30 bg-lime/5 p-4 flex gap-3">
      <Lightbulb className="w-5 h-5 text-lime shrink-0 mt-0.5" />
      <div className="flex-1 text-sm">
        <p className="font-bold mb-1">{title}</p>
        <div className="text-mute">{children}</div>
        {href && <Link href={href} className="inline-block mt-2 font-semibold text-lime hover:underline">{cta ?? 'Read the guide'}</Link>}
      </div>
      <button aria-label="Dismiss tip" onClick={() => { markSeen(key); setDismissed(true); }} className="p-1 h-fit rounded-lg text-mute hover:text-ink"><X className="w-4 h-4" /></button>
    </div>
  );
}
