'use client';

import React, { useState } from 'react';
import { Package, Plus, Search, MapPin, Truck, CheckCircle2, Clock, Filter, AlertCircle } from 'lucide-react';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'quote' | 'stores'>('orders');
  const [selectedCarrier, setSelectedCarrier] = useState<string>('ola_trans');

  const orders = [
    { id: 'SHP-9021', destination: 'Akwa, Douala', carrier: 'Ola Trans Ltd', status: 'In Transit', fee: '2,500 XAF', cod: '25,000 XAF', date: 'Today, 14:20' },
    { id: 'SHP-9022', destination: 'Bonapriso, Douala', carrier: 'House Carrier', status: 'Picked Up', fee: '1,800 XAF', cod: '12,500 XAF', date: 'Today, 12:10' },
    { id: 'SHP-9018', destination: 'Deido, Douala', carrier: 'Express Logistics', status: 'Delivered', fee: '2,200 XAF', cod: '0 XAF', date: 'Yesterday' },
    { id: 'SHP-9015', destination: 'Bali, Douala', carrier: 'Ola Trans Ltd', status: 'Delivered', fee: '3,000 XAF', cod: '45,000 XAF', date: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-sm font-semibold mb-1">
            <span>Client Dashboard</span>
            <span>•</span>
            <span>Vendor Shipping</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Delivery Requests & Quotes</h1>
          <p className="text-slate-400 text-sm mt-1">
            Create shipment orders, compare multi-carrier quotes (Ola Trans tariff rules), and track delivery codes.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('quote')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg text-sm transition-colors flex items-center space-x-2 shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Get Quote & Book</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'orders' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          My Orders & Shipments ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('quote')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'quote' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Multi-Carrier Quote Engine
        </button>
        <button
          onClick={() => setActiveTab('stores')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'stores' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Store Pickup Settings
        </button>
      </div>

      {/* Tab Content: Orders */}
      {activeTab === 'orders' && (
        <div className="mambanda-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by ID, destination..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-amber-500">
                <option>All Statuses</option>
                <option>In Transit</option>
                <option>Delivered</option>
                <option>Pending Pickup</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Tracking ID</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Carrier</th>
                  <th className="py-3 px-4">Delivery Fee</th>
                  <th className="py-3 px-4">COD Amount</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-amber-400">{order.id}</td>
                    <td className="py-3.5 px-4 font-medium text-white flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.destination}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 flex items-center space-x-1.5">
                      <Truck className="w-3.5 h-3.5 text-blue-400" />
                      <span>{order.carrier}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-200">{order.fee}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-200">{order.cod}</td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs">{order.date}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : order.status === 'In Transit'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-md transition-colors">
                        Track Live
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Quote Engine */}
      {activeTab === 'quote' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="mambanda-card p-6 lg:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-white">Request Shipping Quote</h3>
            <p className="text-xs text-slate-400">Select pickup and dropoff places in Douala/Yaoundé to compare active carrier tariffs.</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Pickup Location</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
                  <option>Bonabéri Hub (Head Office)</option>
                  <option>Akwa Central Store</option>
                  <option>Bonapriso Depots</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Dropoff Place</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
                  <option>Akwa – Commercial Avenue</option>
                  <option>Bonapriso – Rue Joss</option>
                  <option>Deido – Rond-point</option>
                  <option>Bali – Elf Station</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Parcel Size Band</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
                  <option>Small (Under 5kg / Envelope)</option>
                  <option>Standard (5kg - 15kg / Box)</option>
                  <option>Large (15kg - 30kg / Carton)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Cash on Delivery (COD) Amount</label>
                <input
                  type="text"
                  defaultValue="25,000 XAF"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2">
                <button className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg text-sm transition-colors shadow-lg shadow-amber-500/20">
                  Compare Carrier Quotes
                </button>
              </div>
            </div>
          </div>

          <div className="mambanda-card p-6 lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Available Carrier Options</h3>
                <p className="text-xs text-slate-400">Sorted by price & ETA based on active carrier rate cards</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/20">
                3 Carriers Available
              </span>
            </div>

            <div className="space-y-3">
              {/* Option 1 */}
              <div className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedCarrier === 'ola_trans' ? 'bg-amber-500/10 border-amber-500/50' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`} onClick={() => setSelectedCarrier('ola_trans')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                      OT
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">Ola Trans Ltd</span>
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-400 rounded">Recommended</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">Rating: 4.6★ (128 reviews) • ETA: 120-180 mins</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-amber-400">2,500 XAF</div>
                    <div className="text-[10px] text-slate-400">Pickup + Delivery included</div>
                  </div>
                </div>
              </div>

              {/* Option 2 */}
              <div className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedCarrier === 'house' ? 'bg-amber-500/10 border-amber-500/50' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`} onClick={() => setSelectedCarrier('house')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                      MC
                    </div>
                    <div>
                      <div className="font-semibold text-white">House Carrier (Mambanda Desk)</div>
                      <div className="text-xs text-slate-400 mt-0.5">Rating: 4.8★ (450 reviews) • ETA: 90 mins</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">2,800 XAF</div>
                    <div className="text-[10px] text-slate-400">Priority Dispatch</div>
                  </div>
                </div>
              </div>

              {/* Option 3 */}
              <div className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedCarrier === 'express' ? 'bg-amber-500/10 border-amber-500/50' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`} onClick={() => setSelectedCarrier('express')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                      EL
                    </div>
                    <div>
                      <div className="font-semibold text-white">Express Logistics 3PL</div>
                      <div className="text-xs text-slate-400 mt-0.5">Rating: 4.3★ (64 reviews) • ETA: 60 mins (Moto)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">3,500 XAF</div>
                    <div className="text-[10px] text-slate-400">Express Delivery</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg text-sm transition-colors shadow-lg shadow-amber-500/20">
                Confirm Booking with Selected Carrier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Stores */}
      {activeTab === 'stores' && (
        <div className="mambanda-card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Pickup Store Configuration</h3>
          <p className="text-xs text-slate-400">Configure pickup addresses, contact persons, and preferred carrier defaults.</p>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Store Name</label>
                <input type="text" defaultValue="Mambanda Central Store #4" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Pickup Contact Phone</label>
                <input type="text" defaultValue="+237 690 00 11 22" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Pickup Address & Landmark</label>
              <input type="text" defaultValue="Bonabéri Douala, near Express Union junction" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
