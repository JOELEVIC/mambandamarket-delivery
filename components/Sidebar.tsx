'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Truck, Package, Users, DollarSign, LayoutDashboard, Menu, X, ShieldCheck, Settings } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Control Tower', href: '/', icon: LayoutDashboard, tooltip: 'Global operations & analytics' },
    { name: 'Client Orders', href: '/client', icon: Package, tooltip: 'Shipping requests, quotes & store fulfillment' },
    { name: 'Carrier Portal', href: '/carrier', icon: Truck, tooltip: 'Ola Trans dispatch inbox, coverage & rate cards' },
    { name: 'Tariffs & Settings', href: '/carrier/settings', icon: Settings, tooltip: 'Configure zones, pickup tariffs & audit logs' },
    { name: 'Fleet & Riders', href: '/fleet', icon: Users, tooltip: 'Agent roster, vehicles, shifts & COD float' },
    { name: 'Reconciliation', href: '/finance', icon: DollarSign, tooltip: 'Append-only ledger, COD & escrow settlements' },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between bg-[#11131e] border-b border-[#252839] px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#c9ee0a] text-[#0a0b10] flex items-center justify-center font-extrabold shadow-lg">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-[#f4f6ef]">
              Mambanda<span className="text-[#c9ee0a]">Market</span>
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-[#8b90a3] hover:text-[#f4f6ef] rounded-lg bg-[#1a1d2b] border border-[#252839]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#11131e] border-r border-[#252839] flex flex-col transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#252839] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#c9ee0a] text-[#0a0b10] flex items-center justify-center font-extrabold shadow-lg shadow-[#c9ee0a]/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-[#f4f6ef]">
                Mambanda<span className="text-[#c9ee0a]">Market</span>
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b90a3]">
                Delivery Ops v1
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-[#8b90a3] hover:text-[#f4f6ef]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#c9ee0a] text-[#0a0b10] shadow-md shadow-[#c9ee0a]/20'
                      : 'text-[#8b90a3] hover:bg-[#1a1d2b] hover:text-[#f4f6ef]'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
                {/* Tooltip on hover */}
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#1a1d2b] text-[#f4f6ef] text-[11px] font-medium rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-[#252839] shadow-xl hidden lg:block">
                  {item.tooltip}
                </div>
              </div>
            );
          })}
        </nav>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-[#252839] bg-[#07080f]/50">
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-[#1a1d2b] border border-[#252839]">
            <div className="w-9 h-9 rounded-full bg-[#252839] text-[#c9ee0a] font-bold flex items-center justify-center text-xs border border-[#c9ee0a]/20">
              OP
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#f4f6ef] truncate">Logistics Admin</p>
              <p className="text-[10px] text-[#8b90a3] truncate">Ola Trans & House</p>
            </div>
            <ShieldCheck className="w-4 h-4 text-[#c9ee0a] flex-shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
}
