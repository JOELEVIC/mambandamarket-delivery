'use client';

import React, { useState } from 'react';
import { Users, Truck, Phone, Plus, ShieldAlert, CheckCircle2, X } from 'lucide-react';

export default function FleetPage() {
  const [riders, setRiders] = useState([
    { id: 'RID-101', name: 'Jean-Pierre Kamga', phone: '+237 699 11 22 33', vehicle: 'Yamaha Moto', hub: 'Bonabéri Hub', codFloat: '45,000 XAF', status: 'On Duty' },
    { id: 'RID-102', name: 'Emmanuel Talla', phone: '+237 677 44 55 66', vehicle: 'Scooter', hub: 'Akwa Depot', codFloat: '12,000 XAF', status: 'On Delivery' },
    { id: 'RID-103', name: 'Patrick Mbarga', phone: '+237 690 99 88 77', vehicle: 'Van', hub: 'Bonabéri Hub', codFloat: '180,000 XAF', status: 'On Duty' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newVehicle, setNewVehicle] = useState('Yamaha Moto');
  const [newHub, setNewHub] = useState('Bonabéri Hub');

  const handleAddRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;
    const newRider = {
      id: `RID-${Math.floor(100 + Math.random() * 900)}`,
      name: newName,
      phone: newPhone,
      vehicle: newVehicle,
      hub: newHub,
      codFloat: '0 XAF',
      status: 'On Duty',
    };
    setRiders([newRider, ...riders]);
    setNewName('');
    setNewPhone('');
    setShowAddModal(false);
  };

  const toggleStatus = (id: string) => {
    setRiders(riders.map(r => {
      if (r.id === id) {
        const nextStatus = r.status === 'Suspended' ? 'On Duty' : 'Suspended';
        return { ...r, status: nextStatus };
      }
      return r;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="mambanda-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="mambanda-badge inline-block mb-2">Fleet Management</span>
          <h1 className="text-2xl font-extrabold text-[#f4f6ef]">Riders & Vehicle Roster</h1>
          <p className="text-[#8b90a3] text-xs mt-1">Manage delivery agents, suspend/activate personnel, and monitor COD float limits.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="mambanda-btn text-xs">
          <Plus className="w-4 h-4" />
          <span>Add New Rider</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="mambanda-card">
          <span className="text-[11px] font-bold uppercase text-[#8b90a3]">Active Riders</span>
          <div className="text-2xl font-extrabold text-[#f4f6ef] mt-1">{riders.filter(r => r.status !== 'Suspended').length} Online</div>
        </div>
        <div className="mambanda-card">
          <span className="text-[11px] font-bold uppercase text-[#8b90a3]">COD Float Held</span>
          <div className="text-2xl font-extrabold text-[#c9ee0a] mt-1">237,000 XAF</div>
        </div>
        <div className="mambanda-card">
          <span className="text-[11px] font-bold uppercase text-[#8b90a3]">Suspended Agents</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{riders.filter(r => r.status === 'Suspended').length} Suspended</div>
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
              <th className="py-3 px-3 text-right">Actions</th>
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
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    r.status === 'Suspended'
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      : 'bg-[#1a1d2b] border-[#252839] text-[#c9ee0a]'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => toggleStatus(r.id)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                      r.status === 'Suspended'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                    }`}
                  >
                    {r.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Rider Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="mambanda-card w-full max-w-md space-y-4 border border-[#c9ee0a]/30">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#f4f6ef]">Add New Delivery Rider</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#8b90a3] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddRider} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#8b90a3] mb-1">Rider Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. David Nlend"
                  className="w-full bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#8b90a3] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+237 6..."
                  className="w-full bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#8b90a3] mb-1">Vehicle Type</label>
                <select
                  value={newVehicle}
                  onChange={(e) => setNewVehicle(e.target.value)}
                  className="w-full bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef]"
                >
                  <option value="Yamaha Moto">Yamaha Moto</option>
                  <option value="Scooter">Scooter</option>
                  <option value="Delivery Van">Delivery Van</option>
                  <option value="Bicycle">Bicycle</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#8b90a3] mb-1">Assigned Hub</label>
                <select
                  value={newHub}
                  onChange={(e) => setNewHub(e.target.value)}
                  className="w-full bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef]"
                >
                  <option value="Bonabéri Hub">Bonabéri Hub (HQ)</option>
                  <option value="Akwa Depot">Akwa Depot</option>
                  <option value="Bonapriso Depot">Bonapriso Depot</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#07080f] text-[#8b90a3] text-xs font-bold rounded-xl border border-[#252839]"
                >
                  Cancel
                </button>
                <button type="submit" className="mambanda-btn text-xs">
                  Save & Onboard Rider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
