'use client';

import React from 'react';
import { Users, Truck, ShieldCheck, MapPin, Phone, Plus } from 'lucide-react';

export default function FleetPage() {
  const riders = [
    { id: 'RID-101', name: 'Jean-Pierre Kamga', phone: '+237 699 11 22 33', vehicle: 'Yamaha Moto (CE 402 J)', hub: 'Bonabéri Hub', codFloat: '45,000 XAF', status: 'On Duty' },
    { id: 'RID-102', name: 'Emmanuel Talla', phone: '+237 677 44 55 66', vehicle: 'Scooter (LT 881 A)', hub: 'Akwa Depot', codFloat: '12,000 XAF', status: 'On Delivery' },
    { id: 'RID-103', name: 'Samuel Eto', phone: '+237 655 33 22 11', vehicle: 'Yamaha Moto (CE 901 B)', hub: 'Bonapriso Depot', codFloat: '0 XAF', status: 'Off Duty' },
    { id: 'RID-104', name: 'Patrick Mbarga', phone: '+237 690 99 88 77', vehicle: 'Van (LT 332 C)', hub: 'Bonabéri Hub', codFloat: '180,000 XAF', status: 'On Duty' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-sm font-semibold mb-1">
            <span>Fleet Management</span>
            <span>•</span>
            <span>Delivery Agents & Riders</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Riders, Vehicles & COD Float</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage delivery personnel, vehicle assignments, shift handovers, and cash-on-delivery (COD) float limits.
          </p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm transition-colors flex items-center space-x-2 shadow-lg shadow-emerald-500/20">
          <Plus className="w-4 h-4" />
          <span>Add New Rider</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="mambanda-card p-5">
          <div className="text-xs text-slate-400">Total Riders</div>
          <div className="text-2xl font-bold text-white mt-1">24 Active</div>
          <div className="text-xs text-emerald-400 mt-1">18 currently on duty</div>
        </div>
        <div className="mambanda-card p-5">
          <div className="text-xs text-slate-400">Vehicles Fleet</div>
          <div className="text-2xl font-bold text-white mt-1">20 Motos / 4 Vans</div>
          <div className="text-xs text-blue-400 mt-1">100% Insured</div>
        </div>
        <div className="mambanda-card p-5">
          <div className="text-xs text-slate-400">Total COD Float Held</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">237,000 XAF</div>
          <div className="text-xs text-amber-400 mt-1">Within rider limits</div>
        </div>
        <div className="mambanda-card p-5">
          <div className="text-xs text-slate-400">Hubs Operating</div>
          <div className="text-2xl font-bold text-white mt-1">3 Hubs</div>
          <div className="text-xs text-emerald-400 mt-1">Bonabéri, Akwa, Bonapriso</div>
        </div>
      </div>

      <div className="mambanda-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Registered Riders & Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Rider ID & Name</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Assigned Vehicle</th>
                <th className="py-3 px-4">Home Hub</th>
                <th className="py-3 px-4">COD Float Held</th>
                <th className="py-3 px-4">Shift Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {riders.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{r.name}</div>
                    <div className="font-mono text-xs text-amber-400">{r.id}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 flex items-center space-x-1.5 pt-4">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{r.phone}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{r.vehicle}</td>
                  <td className="py-3.5 px-4 text-slate-400">{r.hub}</td>
                  <td className="py-3.5 px-4 font-mono text-amber-400 font-medium">{r.codFloat}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      r.status === 'On Duty'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : r.status === 'On Delivery'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-md">
                      View Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
