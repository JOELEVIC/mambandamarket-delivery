'use client';

import React, { useState } from 'react';
import { Package, Plus, Search, MapPin, Truck, CheckCircle2, Clock } from 'lucide-react';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'quote' | 'stores'>('orders');
  const [selectedCarrier, setSelectedCarrier] = useState<string>('ola_trans');

  const orders = [
    { id: 'SHP-9021', destination: 'Akwa, Douala', carrier: 'Ola Trans Ltd', status: 'In Transit', fee: '2,500 XAF', cod: '25,000 XAF', date: 'Today, 14:20' },
    { id: 'SHP-9022', destination: 'Bonapriso, Douala', carrier: 'House Carrier', status: 'Picked Up', fee: '1,800 XAF', cod: '12,500 XAF', date: 'Today, 12:10' },
    { id: 'SHP-9018', destination: 'Deido, Douala', carrier: 'Express Logistics', status: 'Delivered', fee: '2,200 XAF', cod: '0 XAF', date: 'Yesterday' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mambanda-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="mambanda-badge inline-block mb-2">Vendor Portal</span>
          <h1 className="text-2xl font-extrabold text-[#f4f6ef]">Client Shipping & Quotes</h1>
          <p className="text-[#8b90a3] text-xs mt-1">Manage delivery requests and multi-carrier tariff quotes.</p>
        </div>
        <button
          onClick={() => setActiveTab('quote')}
          className="mambanda-btn text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Quote</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[#252839] pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders' ? 'bg-[#c9ee0a] text-[#0a0b10]' : 'text-[#8b90a3] hover:text-[#f4f6ef]'
          }`}
        >
          Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('quote')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'quote' ? 'bg-[#c9ee0a] text-[#0a0b10]' : 'text-[#8b90a3] hover:text-[#f4f6ef]'
          }`}
        >
          Quote Engine
        </button>
        <button
          onClick={() => setActiveTab('stores')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'stores' ? 'bg-[#c9ee0a] text-[#0a0b10]' : 'text-[#8b90a3] hover:text-[#f4f6ef]'
          }`}
        >
          Store Settings
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="mambanda-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8b90a3]" />
              <input
                type="text"
                placeholder="Search shipments..."
                className="w-full bg-[#07080f] border border-[#252839] rounded-xl pl-9 pr-4 py-2 text-xs text-[#f4f6ef] focus:outline-none focus:border-[#c9ee0a]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#07080f] text-[#8b90a3] uppercase tracking-wider border-b border-[#252839]">
                <tr>
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3 px-3">Destination</th>
                  <th className="py-3 px-3">Carrier</th>
                  <th className="py-3 px-3">Fee</th>
                  <th className="py-3 px-3">COD</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252839] text-[#f4f6ef]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#1a1d2b]/50 transition-colors">
                    <td className="py-3 px-3 font-mono text-[#c9ee0a] font-bold">{o.id}</td>
                    <td className="py-3 px-3 text-[#8b90a3]">{o.destination}</td>
                    <td className="py-3 px-3">{o.carrier}</td>
                    <td className="py-3 px-3 font-mono">{o.fee}</td>
                    <td className="py-3 px-3 font-mono">{o.cod}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1a1d2b] border border-[#252839] text-[#c9ee0a]">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button className="text-[11px] font-bold text-[#c9ee0a] hover:underline">Track</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'quote' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="mambanda-card lg:col-span-1 space-y-3">
            <h3 className="text-base font-bold text-[#f4f6ef]">Request Quote</h3>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#8b90a3] mb-1">Pickup Hub</label>
              <select className="w-full bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef]">
                <option>Bonabéri Head Office</option>
                <option>Akwa Central</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#8b90a3] mb-1">Dropoff Place</label>
              <select className="w-full bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef]">
                <option>Akwa – Commercial Avenue</option>
                <option>Bonapriso – Rue Joss</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#8b90a3] mb-1">COD Value</label>
              <input type="text" defaultValue="25,000 XAF" className="w-full bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef]" />
            </div>
            <button className="w-full mambanda-btn text-xs mt-2 justify-center">Calculate Tariffs</button>
          </div>

          <div className="mambanda-card lg:col-span-2 space-y-3">
            <h3 className="text-base font-bold text-[#f4f6ef]">Carrier Options</h3>
            <div className="space-y-2">
              <div className="p-3 bg-[#07080f] border border-[#c9ee0a] rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#f4f6ef]">Ola Trans Ltd <span className="mambanda-badge ml-2 text-[9px]">Best Value</span></div>
                  <div className="text-[11px] text-[#8b90a3]">ETA: 120m • 4.6★</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold text-[#c9ee0a]">2,500 XAF</div>
                </div>
              </div>
              <div className="p-3 bg-[#07080f] border border-[#252839] rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#f4f6ef]">House Carrier</div>
                  <div className="text-[11px] text-[#8b90a3]">ETA: 90m • 4.8★</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold text-[#f4f6ef]">2,800 XAF</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stores' && (
        <div className="mambanda-card space-y-3">
          <h3 className="text-base font-bold text-[#f4f6ef]">Store Pickup Settings</h3>
          <input type="text" defaultValue="Mambanda Central Store #4" className="w-full bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef]" />
        </div>
      )}
    </div>
  );
}
