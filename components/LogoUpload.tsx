'use client';

// Company logo / banner: pick a picture, it uploads straight to storage
// through a signed URL, then the API checks it (this company's folder, an
// image, 2 MB max) and saves it. Buyers see the logo on delivery options.
import React, { useRef, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import { api, post, supabase } from '@/lib/api';
import { Button, toast } from './ui';

const MAX = 2 * 1024 * 1024;
const TYPES: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };

export default function LogoUpload({ kind = 'logo', url, name, disabled, onChange }: {
  kind?: 'logo' | 'banner';
  url: string | null;
  name: string;
  disabled?: boolean;
  onChange: (profile: Record<string, unknown>) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const isLogo = kind === 'logo';

  const upload = async (file: File) => {
    const ext = TYPES[file.type];
    if (!ext) return toast('Use a JPG, PNG or WEBP picture', 'err');
    if (file.size > MAX) return toast('Pictures up to 2 MB', 'err');
    setBusy(true);
    try {
      const u = await post<{ bucket: string; path: string; token: string }>('/carrier/profile/logo/upload-url', { kind, ext });
      const { error } = await supabase().storage.from(u.bucket).uploadToSignedUrl(u.path, u.token, file, { contentType: file.type, upsert: false });
      if (error) throw new Error(error.message);
      const r = await post<{ profile: Record<string, unknown> }>('/carrier/profile/logo', { kind, path: u.path });
      onChange(r.profile);
      toast(isLogo ? 'Logo updated' : 'Banner updated');
    } catch (e) {
      toast((e as Error).message, 'err');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      const r = await api<{ profile: Record<string, unknown> }>(`/carrier/profile/logo?kind=${kind}`, { method: 'DELETE' });
      onChange(r.profile);
      toast(isLogo ? 'Logo removed' : 'Banner removed');
    } catch (e) {
      toast((e as Error).message, 'err');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className={`${isLogo ? 'w-20 h-20 rounded-2xl' : 'w-40 h-20 rounded-xl'} shrink-0 overflow-hidden border border-line bg-p2 flex items-center justify-center`}>
        {url
          // eslint-disable-next-line @next/next/no-img-element -- remote storage URL, sized by the box
          ? <img src={url} alt={`${name} ${kind}`} className="w-full h-full object-cover" />
          : <span className="text-2xl font-extrabold text-lime">{isLogo ? (name.slice(0, 1) || '?') : ''}</span>}
      </div>
      <div className="space-y-2">
        <p className="text-sm text-mute">{isLogo ? 'Square works best, at least 256 × 256. JPG, PNG or WEBP, up to 2 MB.' : 'Wide picture, about 1200 × 400. Up to 2 MB.'}</p>
        <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void upload(f); }} />
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="ghost" busy={busy} disabled={disabled} onClick={() => input.current?.click()}>
            <ImagePlus className="w-4 h-4" />{url ? 'Replace' : 'Upload'}
          </Button>
          {url && <Button type="button" size="sm" variant="ghost" disabled={disabled || busy} onClick={remove}><Trash2 className="w-4 h-4" />Remove</Button>}
        </div>
      </div>
    </div>
  );
}
