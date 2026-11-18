'use client';

import React from 'react';
import { Users, Truck, Phone, Plus } from 'lucide-react';

export default function FleetPage() {
  const riders = [
    { id: 'RID-101', name: 'Jean-Pierre Kamga', phone: '+237 699 11 22 33', vehicle: 'Yamaha Moto', hub: 'Bonabéri Hub', codFloat: '45,000 XAF', status: 'On Duty' },
    { id: 'RID-102', name: 'Emmanuel Talla', phone: '+237 677 44 55 66', vehicle: 'Scooter', hub: 'Akwa Depot', codFloat: '12,000 XAF', status: 'On Delivery' },
    { id: 'RID-103', name: 'Patrick Mbarga', phone: '+237 690 99 88 77', vehicle: 'Van', hub: 'Bonabéri Hub', codFloat: '180,000 XAF', status: 'On Duty' },
  ];

  return (
    <div className="space-y-6">
      <div className="mambanda-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="mambanda-badge inline-block mb-2">Fleet Management</span>
          <h1 className="text-2xl font-extrabold text-[#f4f6ef]">Riders & Vehicle Roster</h1>
          <p className="text-[#8b90a3] text-xs mt-1">Manage delivery agents, shift handovers, and COD float limits.</p>
        </div>
        <button className="mambanda-btn text-xs">
          <Plus className="w-4 h-4" />
          <span>Add Rider</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="mambanda-card">
          <span className="text-[11px] font-bold uppercase text-[#8b90a3]">Active Riders</span>
          <div className="text-2xl font-extrabold text-[#f4f6ef] mt-1">18 Online</div>
        </div>
        <div className="mambanda-card">
          <span className="text-[11px] font-bold uppercase text-[#8b90a3]">COD Float Held</span>
          <div className="text-2xl font-extrabold text-[#c9ee0a] mt-1">237,000 XAF</div>
        </div>
        <div className="mambanda-card">
          <span className="text-[11px] font-bold uppercase text-[#8b90a3]">Hubs Operating</span>
          <div className="text-2xl font-extrabold text-[#f4f6ef] mt-1">3 Hubs</div>
        </div>
      </div>

      <div className="mambanda-card space-y-4">
        <h3 className="text-base font-bold text-[#f4f6ef]">Agent Directory</h3>
        <table className="w-full text-left text-xs">
          <thead className="bg-[#07080f] text-[#8b90a3] uppercase tracking-wider border-b border-[#252839]">
            <tr>
              <th className="py-3 px-3">Rider</th>
              <th className="py-3 px-3">Phone</th>
              <th className="py-3 px-3">Vehicle</th>
              <th className="py-3 px-3">Hub</th>
              <th className="py-3 px-3">COD Float</th>
              <th className="py-3 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#252839] text-[#f4f6ef]">
            {riders.map((r) => (
              <tr key={r.id} className="hover:bg-[#1a1d2b]/50">
                <td className="py-3 px-3 font-bold">{r.name} <span className="block font-mono text-[10px] text-[#c9ee0a]">{r.id}</span></td>
                <td className="py-3 px-3 text-[#8b90a3]">{r.phone}</td>
                <td className="py-3 px-3">{r.vehicle}</td>
                <td className="py-3 px-3 text-[#8b90a3]">{r.hub}</td>
                <td className="py-3 px-3 font-mono text-[#c9ee0a] font-bold">{r.codFloat}</td>
                <td className="py-3 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1a1d2b] border border-[#252839] text-[#c9ee0a]">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
