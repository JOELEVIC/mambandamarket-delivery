'use client';

// Building blocks in the portal's design language: night panels, lime accent,
// Poppins, 20px cards, pill buttons. Colours come from the CSS variables in
// globals.css, never repeated as hex.
import React, { useEffect, useState } from 'react';
import { AlertCircle, Loader2, X } from 'lucide-react';
import { STAGES } from '@/lib/format';
import type { ApiError } from '@/lib/api';

export function Card({ children, className = '', hover = false }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return <div className={`mambanda-card ${hover ? 'mambanda-card-hover' : ''} ${className}`}>{children}</div>;
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="text-sm text-mute mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger'; busy?: boolean; size?: 'sm' | 'md' };
export function Button({ variant = 'primary', busy, size = 'md', className = '', children, disabled, ...rest }: BtnProps) {
  const base = size === 'sm' ? 'text-xs px-3.5 py-1.5' : 'text-sm px-5 py-2.5';
  const look = variant === 'primary' ? 'mambanda-btn' : variant === 'danger' ? 'mambanda-btn-danger' : 'mambanda-btn-ghost';
  return (
    <button className={`${look} ${base} disabled:opacity-50 disabled:pointer-events-none ${className}`} disabled={disabled || busy} {...rest}>
      {busy && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

const TONE: Record<string, string> = {
  lime: 'text-lime border-lime/30 bg-lime/10',
  green: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
  blue: 'text-sky-300 border-sky-400/30 bg-sky-400/10',
  amber: 'text-amber-300 border-amber-400/30 bg-amber-400/10',
  red: 'text-rose-300 border-rose-400/30 bg-rose-400/10',
  mute: 'text-mute border-line bg-p2',
};
export function Badge({ tone = 'mute', children }: { tone?: keyof typeof TONE | string; children: React.ReactNode }) {
  return <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${TONE[tone] ?? TONE.mute}`}>{children}</span>;
}
export function StageBadge({ stage }: { stage: string }) {
  const s = STAGES[stage] ?? { label: stage, tone: 'mute' as const };
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

export function Stat({ label, value, hint, tone }: { label: string; value: React.ReactNode; hint?: string; tone?: 'lime' | 'red' | 'amber' }) {
  const color = tone === 'red' ? 'text-rose-300' : tone === 'amber' ? 'text-amber-300' : tone === 'lime' ? 'text-lime' : 'text-ink';
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wider text-mute">{label}</p>
      <p className={`text-2xl font-extrabold mt-2 ${color}`}>{value}</p>
      {hint && <p className="text-xs text-mute mt-1">{hint}</p>}
    </Card>
  );
}

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return <div className="flex items-center gap-2 text-mute text-sm py-10 justify-center"><Loader2 className="w-4 h-4 animate-spin" />{label}</div>;
}

export function ErrorNote({ error, onRetry }: { error: ApiError | Error | string | null; onRetry?: () => void }) {
  if (!error) return null;
  const msg = typeof error === 'string' ? error : error.message;
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-rose-400/30 bg-rose-400/10 text-rose-200 text-sm px-4 py-3">
      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
      <span className="flex-1">{msg}</span>
      {onRetry && <button className="underline font-semibold" onClick={onRetry}>Retry</button>}
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="text-center py-12 px-4">
      <p className="font-bold text-ink">{title}</p>
      {children && <div className="text-sm text-mute mt-1">{children}</div>}
    </div>
  );
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title}
        className={`relative w-full ${wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'} max-h-[92vh] overflow-y-auto bg-p1 border border-line rounded-t-3xl sm:rounded-3xl p-6`}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold">{title}</h2>
          <button aria-label="Close" onClick={onClose} className="p-2 rounded-xl text-mute hover:text-ink hover:bg-p2"><X className="w-4 h-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-mute mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-mute mt-1">{hint}</span>}
    </label>
  );
}

export const inputCls = 'w-full bg-p2 border border-line rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-mute/70 focus:outline-none focus:border-lime';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ''}`} />;
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputCls} ${props.className ?? ''}`} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} ${props.className ?? ''}`} />;
}

export function Tabs<T extends string>({ value, onChange, tabs }: { value: T; onChange: (v: T) => void; tabs: Array<{ id: T; label: string; count?: number }> }) {
  return (
    <div className="flex gap-1 p-1 bg-p1 border border-line rounded-full w-fit max-w-full overflow-x-auto mb-6">
      {tabs.map((t) => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`whitespace-nowrap text-sm font-semibold px-4 py-2 rounded-full transition ${value === t.id ? 'bg-lime text-on-lime' : 'text-mute hover:text-ink'}`}>
          {t.label}{t.count != null && <span className="ml-1.5 opacity-70">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-mute border-b border-line">
            {head.map((h) => <th key={h} className="py-3 pr-4 font-semibold whitespace-nowrap">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

let toastSet: ((t: { msg: string; tone: 'ok' | 'err' } | null) => void) | null = null;
export function toast(msg: string, tone: 'ok' | 'err' = 'ok') {
  toastSet?.({ msg, tone });
}
export function Toaster() {
  const [t, setT] = useState<{ msg: string; tone: 'ok' | 'err' } | null>(null);
  useEffect(() => {
    toastSet = setT;
    return () => { toastSet = null; };
  }, []);
  useEffect(() => {
    if (!t) return;
    const id = setTimeout(() => setT(null), 4000);
    return () => clearTimeout(id);
  }, [t]);
  if (!t) return null;
  return (
    <div role="status" className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-full text-sm font-semibold shadow-2xl border ${t.tone === 'ok' ? 'bg-p2 border-lime/40 text-ink' : 'bg-rose-950 border-rose-400/40 text-rose-100'}`}>
      {t.msg}
    </div>
  );
}

/** Run an async action with a busy flag and a toast for the outcome. */
export function useAction() {
  const [busy, setBusy] = useState<string | null>(null);
  const run = async <T,>(key: string, fn: () => Promise<T>, ok?: string): Promise<T | undefined> => {
    setBusy(key);
    try {
      const r = await fn();
      if (ok) toast(ok);
      return r;
    } catch (e) {
      toast((e as Error).message, 'err');
      return undefined;
    } finally {
      setBusy(null);
    }
  };
  return { busy, run };
}
