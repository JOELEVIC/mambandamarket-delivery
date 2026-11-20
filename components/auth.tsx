'use client';

import React from 'react';
import { Truck } from 'lucide-react';

/** Phone-only riders sign in with their number; it maps to the login address their invite created. */
export function loginIdentifier(v: string): string {
  const s = v.trim();
  if (s.includes('@')) return s.toLowerCase();
  const digits = s.replace(/[^0-9]/g, '').replace(/^00/, '');
  return `rider.${digits.startsWith('237') ? digits : `237${digits}`}@delivery.mambandamarket.com`;
}

export function AuthFrame({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-11 h-11 rounded-2xl bg-lime text-on-lime flex items-center justify-center"><Truck className="w-6 h-6" /></div>
          <span className="text-xl font-extrabold tracking-tight">Mambanda<span className="text-lime">Delivery</span></span>
        </div>
        <div className="mambanda-card">
          <h1 className="text-xl font-extrabold">{title}</h1>
          {subtitle && <p className="text-sm text-mute mt-1 mb-6">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}

