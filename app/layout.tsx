import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Shell from '@/components/Shell';
import { SessionProvider } from '@/lib/session';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-poppins' });

export const metadata: Metadata = {
  title: 'Mambanda Delivery — Carrier portal',
  description: 'Jobs, riders, tariffs and money for delivery companies working with Mambanda Market.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} h-full`}>
      <body className="min-h-full flex flex-col lg:flex-row bg-bg text-ink font-sans overflow-x-hidden">
        <SessionProvider>
          <Shell>{children}</Shell>
        </SessionProvider>
      </body>
    </html>
  );
}
