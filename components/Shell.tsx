'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Building2, Code2, DollarSign, LayoutDashboard, LifeBuoy, LogOut, Map, Menu, Package, Truck, Users, UserCog, X, Bike, ChevronsUpDown, BadgeCheck, BookOpen,
} from 'lucide-react';
import { WelcomeTour } from './Guide';
import ApplyForm from './ApplyForm';
import { PUBLIC_PREFIXES, useSession } from '@/lib/session';
import { ROLE_LABEL } from '@/lib/format';
import { Button, Card, Spinner, Toaster } from './ui';

const NAV = [
  { name: 'Control Tower', href: '/', icon: LayoutDashboard, perm: 'jobs.view' },
  { name: 'Jobs', href: '/jobs', icon: Package, perm: 'jobs.view' },
  { name: 'Fleet & Riders', href: '/fleet', icon: Users, perm: 'riders.view' },
  { name: 'Coverage & Tariffs', href: '/setup', icon: Map, perm: 'setup.view' },
  { name: 'Money', href: '/finance', icon: DollarSign, perm: 'finance.view' },
  { name: 'Team', href: '/team', icon: UserCog, perm: 'team.view' },
  { name: 'Developers', href: '/developers', icon: Code2, perm: 'developers.manage' },
  { name: 'Company', href: '/settings', icon: Building2, perm: 'profile.view' },
  { name: 'Guide', href: '/guide', icon: BookOpen, perm: null },
  { name: 'Support', href: '/support', icon: LifeBuoy, perm: null },
];

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-lime text-on-lime flex items-center justify-center shadow-lg"><Truck className="w-5 h-5" /></div>
      <div className="leading-tight">
        <span className="text-base font-extrabold tracking-tight">Mambanda<span className="text-lime">Delivery</span></span>
        <span className="block text-[10px] uppercase tracking-[0.2em] text-mute">Carrier portal</span>
      </div>
    </div>
  );
}

function Sidebar() {
  const { me, can, signOut, switchCarrier } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [picker, setPicker] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  const isRider = me?.active_carrier.role === 'rider';
  const onboarding = !!me && !['active', 'suspended', 'revoked'].includes(me.active_carrier.status);
  const items = isRider
    ? [{ name: 'My deliveries', href: '/ride', icon: Bike, perm: null }, NAV[NAV.length - 1]!]
    : [...(onboarding ? [{ name: 'Get verified', href: '/onboarding', icon: BadgeCheck, perm: null }] : []), ...NAV.filter((n) => !n.perm || can(n.perm))];

  const nav = (
    <nav className="flex flex-col h-full">
      <div className="px-5 py-6"><Brand /></div>
      <div className="px-3 flex-1 space-y-1 overflow-y-auto">
        {items.map((n) => {
          const active = n.href === '/' ? pathname === '/' : pathname.startsWith(n.href);
          return (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${active ? 'bg-lime text-on-lime' : 'text-mute hover:text-ink hover:bg-p2'}`}>
              <n.icon className="w-4 h-4" />{n.name}
            </Link>
          );
        })}
      </div>
      {me && (
        <div className="p-3 border-t border-line space-y-2">
          <button onClick={() => setPicker((v) => !v)} disabled={me.memberships.length < 2}
            className="w-full text-left flex items-center gap-3 p-3 rounded-xl bg-p2 border border-line hover:border-lime/50 disabled:hover:border-line">
            <div className="w-9 h-9 rounded-lg bg-p1 border border-line flex items-center justify-center font-extrabold text-lime">{me.active_carrier.name.slice(0, 1)}</div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold truncate">{me.active_carrier.name}</p>
              <p className="text-xs text-mute truncate">{ROLE_LABEL[me.active_carrier.role] ?? me.active_carrier.role} · {me.user.email}</p>
            </div>
            {me.memberships.length > 1 && <ChevronsUpDown className="w-4 h-4 text-mute" />}
          </button>
          {picker && me.memberships.filter((m) => m.carrier_id !== me.active_carrier.carrier_id).map((m) => (
            <button key={m.carrier_id} onClick={() => { setPicker(false); switchCarrier(m.carrier_id); }}
              className="w-full text-left text-sm px-3 py-2 rounded-lg text-mute hover:text-ink hover:bg-p2">{m.name} <span className="text-xs">· {ROLE_LABEL[m.role]}</span></button>
          ))}
          {me.active_carrier.status !== 'active' && (
            <p className="text-xs text-amber-300 px-1">Status: {me.active_carrier.status}. {me.active_carrier.status === 'pending' ? 'Mambanda is verifying your company; you can keep setting up.' : me.active_carrier.status === 'applied' ? 'Finish the checklist and submit it to go live.' : me.active_carrier.status === 'rejected' ? 'Mambanda asked for changes — see Get verified.' : ''}</p>
          )}
          <button onClick={signOut} className="w-full flex items-center gap-2 text-sm text-mute hover:text-ink px-3 py-2 rounded-lg"><LogOut className="w-4 h-4" />Sign out</button>
        </div>
      )}
    </nav>
  );

  return (
    <>
      <div className="lg:hidden flex items-center justify-between bg-p1 border-b border-line px-4 py-3 sticky top-0 z-40">
        <Brand />
        <button aria-label="Open menu" onClick={() => setOpen(true)} className="p-2 rounded-lg bg-p2 border border-line text-mute"><Menu className="w-5 h-5" /></button>
      </div>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-p1 border-r border-line">
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="absolute top-5 right-4 p-2 text-mute"><X className="w-5 h-5" /></button>
            {nav}
          </div>
        </div>
      )}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-p1 border-r border-line z-30">{nav}</aside>
    </>
  );
}

function Gate({ children }: { children: React.ReactNode }) {
  const { status, choices, switchCarrier, signOut, error, me } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [applying, setApplying] = useState(false);
  useEffect(() => {
    if (status === 'ready' && me?.active_carrier.role === 'rider' && pathname !== '/ride' && pathname !== '/support') router.replace('/ride');
    // A company still being verified has no jobs to show: land on its checklist.
    else if (status === 'ready' && pathname === '/' && me && ['applied', 'pending', 'rejected'].includes(me.active_carrier.status)) router.replace('/onboarding');
  }, [status, me, pathname, router]);
  if (status === 'loading' || status === 'signed_out') return <Spinner label="Opening your portal…" />;
  if (status === 'choose') {
    return (
      <Card className="max-w-md mx-auto mt-16">
        <h2 className="text-lg font-extrabold mb-1">Which company?</h2>
        <p className="text-sm text-mute mb-5">You work for more than one carrier. Pick one; you can switch from the menu.</p>
        <div className="space-y-2">{choices.map((c) => <Button key={c.carrier_id} variant="ghost" className="w-full justify-between" onClick={() => switchCarrier(c.carrier_id)}>{c.name}<span className="text-xs text-mute">{ROLE_LABEL[c.role]}</span></Button>)}</div>
      </Card>
    );
  }
  if (status === 'no_carrier') {
    if (applying) {
      return (
        <Card className="max-w-3xl mx-auto mt-10">
          <h2 className="text-xl font-extrabold mb-1">Become a Mambanda delivery partner</h2>
          <p className="text-sm text-mute mb-6">Tell us about your company. You can set up hubs, prices and riders right after; jobs start once Mambanda has verified you.</p>
          <ApplyForm onCancel={() => setApplying(false)} />
        </Card>
      );
    }
    return (
      <Card className="max-w-md mx-auto mt-16 text-center">
        <h2 className="text-lg font-extrabold mb-2">No delivery company on this account</h2>
        <p className="text-sm text-mute mb-6">Riders and staff: ask your company to invite you (Team or Fleet), then open the link they send. Delivery companies: register yours and get verified.</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Button onClick={() => setApplying(true)}>Register my delivery company</Button>
          <Button variant="ghost" onClick={() => router.push('/invite')}>I have an invite code</Button>
          <Button variant="ghost" onClick={signOut}>Sign out</Button>
        </div>
      </Card>
    );
  }
  return <>{error && <p className="text-sm text-rose-300 mb-4">{error}</p>}<WelcomeTour />{children}</>;
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (isPublic) return <>{children}<Toaster /></>;
  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8"><Gate>{children}</Gate></main>
        <footer className="border-t border-line text-xs text-mute py-4 px-6">Mambanda Delivery · carrier portal</footer>
      </div>
      <Toaster />
    </>
  );
}
