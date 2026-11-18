'use client';

import React, { useState } from 'react';
import { Truck, Users, MapPin, DollarSign, CheckCircle2, Clock, ShieldCheck, Plus, Settings } from 'lucide-react';

export default function CarrierPortal() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'dispatch' | 'coverage' | 'rates'>('inbox');

  const pendingOffers = [
    { id: 'OFF-401', client: 'Mambanda Store #2', from: 'Bonabéri', to: 'Akwa', fee: '2,500 XAF', cod: '20,000 XAF', expires: '12 mins' },
    { id: 'OFF-402', client: 'Boutique Elegance', from: 'Akwa', to: 'Bonapriso', fee: '1,800 XAF', cod: '15,000 XAF', expires: '8 mins' },
    { id: 'OFF-403', client: 'Bamenda Tech Hub', from: 'Deido', to: 'Bali', fee: '3,200 XAF', cod: '50,000 XAF', expires: '14 mins' },
  ];

  const coveragePlaces = [
    { place: 'Akwa', zone: 'Zone 1 (Douala Central)', deliver: true, pickup: true, eta: '90m' },
    { place: 'Bonapriso', zone: 'Zone 1 (Douala Central)', deliver: true, pickup: true, eta: '60m' },
    { place: 'Deido', zone: 'Zone 2 (Douala North)', deliver: true, pickup: false, eta: '120m' },
    { place: 'Bonabéri', zone: 'Zone 3 (Douala West)', deliver: true, pickup: true, eta: '45m' },
    { place: 'Bali', zone: 'Zone 1 (Douala Central)', deliver: true, pickup: true, eta: '90m' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-sm font-semibold mb-1">
            <span>Carrier Portal</span>
            <span>•</span>
            <span>Ola Trans Ltd Tenant</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Carrier Dispatch & Rate Management</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your incoming job offers, rider dispatch board, Douala coverage map, and rate card versions (`@carrier-platform`).
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Active Tenant (Online)</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'inbox' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Job Offer Inbox ({pendingOffers.length})
        </button>
        <button
          onClick={() => setActiveTab('dispatch')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'dispatch' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Dispatch Board & Riders
        </button>
        <button
          onClick={() => setActiveTab('coverage')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'coverage' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Coverage & Hubs (Douala)
        </button>
        <button
          onClick={() => setActiveTab('rates')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'rates' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Rate Card & Surcharges
        </button>
      </div>

      {/* Tab: Job Offer Inbox */}
      {activeTab === 'inbox' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pendingOffers.map((offer) => (
              <div key={offer.id} className="mambanda-card p-5 space-y-3 border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-blue-400 font-bold">{offer.id}</span>
                  <span className="flex items-center space-x-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    <Clock className="w-3 h-3" />
                    <span>Expires in {offer.expires}</span>
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-white">{offer.client}</div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{offer.from} → {offer.to}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-sm">
                  <div>
                    <span className="text-xs text-slate-400">Delivery Fee:</span>
                    <div className="font-bold text-amber-400">{offer.fee}</div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">COD Value:</span>
                    <div className="font-bold text-white">{offer.cod}</div>
                  </div>
                </div>
                <div className="flex space-x-2 pt-2">
                  <button className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors">
                    Accept Offer
                  </button>
                  <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs transition-colors">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Coverage */}
      {activeTab === 'coverage' && (
        <div className="mambanda-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Carrier Coverage Map (Douala Tariff)</h3>
              <p className="text-xs text-slate-400">Configuring pickup and delivery capabilities across 46 places in Douala</p>
            </div>
            <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors flex items-center space-x-1">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Coverage Area</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Place / Quarter</th>
                  <th className="py-3 px-4">Zone</th>
                  <th className="py-3 px-4">Can Deliver</th>
                  <th className="py-3 px-4">Can Pickup</th>
                  <th className="py-3 px-4">Target ETA</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {coveragePlaces.map((cov, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white">{cov.place}</td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs">{cov.zone}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${cov.deliver ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                        {cov.deliver ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${cov.pickup ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                        {cov.pickup ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">{cov.eta}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-xs text-blue-400 hover:text-blue-300 font-semibold">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Dispatch Board & Rates stubs */}
      {activeTab === 'dispatch' && (
        <div className="mambanda-card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Rider Dispatch Board</h3>
          <p className="text-xs text-slate-400">Assign active riders to confirmed shipments. Monitor rider shifts and active GPS coordinates.</p>
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center text-slate-400">
            <Users className="w-10 h-10 mx-auto mb-2 text-blue-400" />
            <p className="font-semibold text-white">12 Riders On Duty</p>
            <p className="text-xs mt-1">Bonabéri Hub: 5 riders • Akwa Depot: 7 riders</p>
          </div>
        </div>
      )}

      {activeTab === 'rates' && (
        <div className="mambanda-card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Rate Card & Surcharges (Ola Trans Tariff)</h3>
          <p className="text-xs text-slate-400">Published v1.2 Rate Card. Includes travel agency surcharge (+500 XAF) and pickup rules.</p>
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
              <span className="text-slate-300">Base Zone 1 Delivery (Standard)</span>
              <span className="font-mono font-bold text-amber-400">1,500 XAF</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
              <span className="text-slate-300">Pickup Surcharge (Double Delivery / -20%)</span>
              <span className="font-mono font-bold text-amber-400">1,000 XAF</span>
            </div>
            <div className="flex justify-between items-center text-sm pb-1">
              <span className="text-slate-300">Travel Agency Forwarding Surcharge</span>
              <span className="font-mono font-bold text-amber-400">+500 XAF</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
