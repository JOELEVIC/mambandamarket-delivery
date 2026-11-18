'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Truck, Package, Users, DollarSign, LayoutDashboard, ShieldCheck, Bell } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Control Tower', href: '/', icon: LayoutDashboard },
    { name: 'Client Orders', href: '/client', icon: Package },
    { name: 'Carrier Portal', href: '/carrier', icon: Truck },
    { name: 'Fleet & Riders', href: '/fleet', icon: Users },
    { name: 'Reconciliation & COD', href: '/finance', icon: DollarSign },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl mambanda-gradient flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Mambanda<span className="text-amber-500">Market</span>
              </span>
              <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
                Delivery Ops
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-3">
            <button className="p-2 text-slate-400 hover:text-white relative rounded-lg hover:bg-slate-800 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2 pl-3 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold text-sm">
                OP
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-white">Logistics Admin</div>
                <div className="text-[10px] text-slate-400">Ola Trans & House</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile sub-nav */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 bg-slate-950 border-t border-slate-800 space-x-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
