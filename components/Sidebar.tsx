'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Truck, Package, Users, DollarSign, LayoutDashboard, Menu, X, ShieldCheck, Settings, MessageSquare, Building2, Save, CheckCircle2 } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Company settings state
  const [companyName, setCompanyName] = useState('Ola Trans Ltd (Partner 3PL)');
  const [rccm, setRccm] = useState('RC/DLA/2024/B/1892');
  const [niu, setNiu] = useState('M08241289341P');
  const [contactEmail, setContactEmail] = useState('olatranslimited@gmail.com');
  const [contactPhone, setContactPhone] = useState('+237 678 23 74 56');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { name: 'Control Tower', href: '/', icon: LayoutDashboard, tooltip: 'Global operations & analytics' },
    { name: 'Client Orders', href: '/client', icon: Package, tooltip: 'Shipping requests, quotes & store fulfillment' },
    { name: 'Carrier Portal', href: '/carrier', icon: Truck, tooltip: 'Ola Trans dispatch inbox, coverage & rate cards' },
    { name: 'Tariffs & Settings', href: '/carrier/settings', icon: Settings, tooltip: 'Configure zones, pickup tariffs & audit logs' },
    { name: 'Fleet & Riders', href: '/fleet', icon: Users, tooltip: 'Agent roster, vehicles, shifts & COD float' },
    { name: 'Reconciliation', href: '/finance', icon: DollarSign, tooltip: 'Append-only ledger, COD & escrow settlements' },
    { name: 'Support / Contact', href: '/support', icon: MessageSquare, tooltip: 'Direct support & messaging with Mambanda Market' },
  ];

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setSettingsModalOpen(false);
    }, 1500);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between bg-[#11131e] border-b border-[#252839] px-4 py-3 sticky top-0 z-40">
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
            aria-label="Toggle navigation menu"
            className="p-2 text-[#8b90a3] hover:text-[#f4f6ef] rounded-lg bg-[#1a1d2b] border border-[#252839]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#11131e] border-r border-[#252839] flex flex-col transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
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
            aria-label="Close navigation menu"
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

        {/* User Footer Profile / Company Settings Trigger */}
        <div className="p-4 border-t border-[#252839] bg-[#07080f]/50">
          <button
            onClick={() => setSettingsModalOpen(true)}
            className="w-full text-left flex items-center space-x-3 p-2.5 rounded-xl bg-[#1a1d2b] border border-[#252839] hover:border-[#c9ee0a] transition-all group cursor-pointer"
            title="Click to open Account & Company Settings"
          >
            <div className="w-9 h-9 rounded-full bg-[#252839] text-[#c9ee0a] font-bold flex items-center justify-center text-xs border border-[#c9ee0a]/20 group-hover:scale-105 transition-transform">
              OT
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#f4f6ef] truncate">Ola Trans Ltd</p>
              <p className="text-[10px] text-[#8b90a3] truncate">Company Settings</p>
            </div>
            <Settings className="w-4 h-4 text-[#8b90a3] group-hover:text-[#c9ee0a] flex-shrink-0 transition-colors" />
          </button>
        </div>
      </aside>

      {/* Account & Company Settings Modal */}
      {settingsModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="mambanda-card w-full max-w-lg space-y-4 border border-[#c9ee0a]/30">
            <div className="flex justify-between items-center border-b border-[#252839] pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#c9ee0a]" />
                <h3 className="text-lg font-bold text-[#f4f6ef]">Account & Company Settings</h3>
              </div>
              <button onClick={() => setSettingsModalOpen(false)} className="text-[#8b90a3] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {savedSuccess ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <div className="font-bold text-sm">Company Settings Updated!</div>
                <p className="text-xs text-[#8b90a3]">Changes saved successfully across all tenant nodes.</p>
              </div>
            ) : (
              <form onSubmit={handleSaveCompany} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#8b90a3] mb-1">Company Legal Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef]"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#8b90a3] mb-1">RCCM Registration</label>
                    <input
                      type="text"
                      value={rccm}
                      onChange={(e) => setRccm(e.target.value)}
                      className="w-full bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#8b90a3] mb-1">NIU Tax Number</label>
                    <input
                      type="text"
                      value={niu}
                      onChange={(e) => setNiu(e.target.value)}
                      className="w-full bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef]"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#8b90a3] mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#8b90a3] mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef]"
                      required
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setSettingsModalOpen(false)}
                    className="px-4 py-2 bg-[#07080f] text-[#8b90a3] text-xs font-bold rounded-xl border border-[#252839]"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="mambanda-btn text-xs">
                    <Save className="w-4 h-4" />
                    <span>Save Company Settings</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
