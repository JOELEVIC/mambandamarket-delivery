'use client';

import React, { useState } from 'react';
import { Truck, MapPin, Clock, Plus, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/lib/AppContext';

export default function CarrierPortal() {
  const { orders, updateOrderStatus } = useApp();
  const [activeTab, setActiveTab] = useState<'inbox' | 'coverage' | 'rates'>('inbox');

  const pendingOffers = [
    { id: 'OFF-401', client: 'Mambanda Store #2', from: 'Bonabéri', to: 'Akwa', fee: '2,500 XAF', cod: '20,000 XAF', expires: '12m' },
    { id: 'OFF-402', client: 'Boutique Elegance', from: 'Akwa', to: 'Bonapriso', fee: '1,800 XAF', cod: '15,000 XAF', expires: '8m' },
  ];

  const coverage = [
    { place: 'Akwa', zone: 'Zone 1 (Central)', deliver: true, pickup: true, eta: '90m' },
    { place: 'Bonapriso', zone: 'Zone 1 (Central)', deliver: true, pickup: true, eta: '60m' },
    { place: 'Deido', zone: 'Zone 2 (North)', deliver: true, pickup: false, eta: '120m' },
  ];

  return (
    <div className="space-y-6">
      <div className="mambanda-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="mambanda-badge inline-block mb-2">Carrier Tenant</span>
          <h1 className="text-2xl font-extrabold text-[#f4f6ef]">Ola Trans Portal & Dispatch</h1>
          <p className="text-[#8b90a3] text-xs mt-1">Manage job offers, Douala coverage map, and rate card versions.</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1a1d2b] border border-[#252839] text-[#c9ee0a]">
          ● Online
        </span>
      </div>

      <div className="flex space-x-2 border-b border-[#252839] pb-2">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'inbox' ? 'bg-[#c9ee0a] text-[#0a0b10]' : 'text-[#8b90a3] hover:text-[#f4f6ef]'
          }`}
        >
          Job Inbox & Active ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('coverage')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'coverage' ? 'bg-[#c9ee0a] text-[#0a0b10]' : 'text-[#8b90a3] hover:text-[#f4f6ef]'
          }`}
        >
          Coverage Map
        </button>
        <button
          onClick={() => setActiveTab('rates')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'rates' ? 'bg-[#c9ee0a] text-[#0a0b10]' : 'text-[#8b90a3] hover:text-[#f4f6ef]'
          }`}
        >
          Rate Cards
        </button>
      </div>

      {activeTab === 'inbox' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#f4f6ef] mb-3">Live Assigned Shipments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map((o) => (
                <div key={o.id} className="mambanda-card border-l-4 border-l-[#c9ee0a] space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-[#c9ee0a] font-bold">{o.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1a1d2b] text-[#c9ee0a] border border-[#252839]">{o.status}</span>
                  </div>
                  <div>
                    <div className="font-bold text-[#f4f6ef]">{o.clientName} ({o.clientPhone})</div>
                    <div className="text-xs text-[#8b90a3] mt-1">Destination: {o.destination}</div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#252839] text-xs">
                    <div>Fee: <span className="font-bold text-[#c9ee0a]">{o.fee}</span></div>
                    <div>COD: <span className="font-bold">{o.cod}</span></div>
                  </div>
                  <div className="flex space-x-2 pt-1">
                    <button
                      onClick={() => updateOrderStatus(o.id, 'In Transit')}
                      className="flex-1 py-1.5 bg-[#c9ee0a] text-[#0a0b10] font-bold rounded-lg text-xs"
                    >
                      Mark In Transit
                    </button>
                    <button
                      onClick={() => updateOrderStatus(o.id, 'Delivered')}
                      className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs"
                    >
                      Mark Delivered
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-[#f4f6ef] mb-3">Pending Offers Inbox</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingOffers.map((o) => (
                <div key={o.id} className="mambanda-card border-l-4 border-l-blue-500 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-blue-400 font-bold">{o.id}</span>
                    <span className="text-[11px] text-[#8b90a3] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {o.expires} left
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-[#f4f6ef]">{o.client}</div>
                    <div className="text-xs text-[#8b90a3] mt-1">{o.from} → {o.to}</div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#252839] text-xs">
                    <div>Fee: <span className="font-bold text-[#c9ee0a]">{o.fee}</span></div>
                    <div>COD: <span className="font-bold">{o.cod}</span></div>
                  </div>
                  <div className="flex space-x-2 pt-1">
                    <button className="flex-1 py-1.5 bg-blue-600 text-white font-bold rounded-lg text-xs">Accept Offer</button>
                    <button className="px-3 py-1.5 bg-[#07080f] text-[#8b90a3] font-bold rounded-lg text-xs border border-[#252839]">Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'coverage' && (
        <div className="mambanda-card space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-[#f4f6ef]">Douala Coverage Areas</h3>
            <button className="mambanda-btn text-xs py-1.5 px-3">Add Zone</button>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-[#07080f] text-[#8b90a3] uppercase tracking-wider border-b border-[#252839]">
              <tr>
                <th className="py-3 px-3">Place</th>
                <th className="py-3 px-3">Zone</th>
                <th className="py-3 px-3">Deliver</th>
                <th className="py-3 px-3">Pickup</th>
                <th className="py-3 px-3">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252839]">
              {coverage.map((c, i) => (
                <tr key={i} className="hover:bg-[#1a1d2b]/50">
                  <td className="py-3 px-3 font-bold text-[#f4f6ef]">{c.place}</td>
                  <td className="py-3 px-3 text-[#8b90a3]">{c.zone}</td>
                  <td className="py-3 px-3"><span className="text-[#c9ee0a] font-bold">Yes</span></td>
                  <td className="py-3 px-3">{c.pickup ? <span className="text-[#c9ee0a] font-bold">Yes</span> : <span className="text-[#8b90a3]">No</span>}</td>
                  <td className="py-3 px-3 font-mono">{c.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'rates' && (
        <div className="mambanda-card space-y-3">
          <h3 className="text-base font-bold text-[#f4f6ef]">Rate Card v1.2 (Ola Trans)</h3>
          <div className="p-4 bg-[#07080f] border border-[#252839] rounded-xl flex justify-between text-xs">
            <span>Base Zone 1 Delivery</span>
            <span className="font-mono font-bold text-[#c9ee0a]">1,500 XAF</span>
          </div>
          <div className="p-4 bg-[#07080f] border border-[#252839] rounded-xl flex justify-between text-xs">
            <span>Travel Agency Forwarding Surcharge</span>
            <span className="font-mono font-bold text-[#c9ee0a]">+500 XAF</span>
          </div>
        </div>
      )}
    </div>
  );
}
