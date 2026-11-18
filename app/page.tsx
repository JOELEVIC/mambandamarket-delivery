import React from 'react';
import Link from 'next/link';
import { Truck, Package, Users, DollarSign, TrendingUp, AlertCircle, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

export default function ControlTower() {
  const stats = [
    { name: 'Active Shipments', value: '1,428', change: '+12.3%', icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { name: 'Active Carriers', value: '6 Partners', change: 'Ola Trans + 5', icon: Truck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { name: 'Delivery Success Rate', value: '94.6%', change: '+1.4%', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { name: 'COD Remitted (Today)', value: '1,845,000 XAF', change: '98% Reconciled', icon: DollarSign, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  const recentJobs = [
    { id: 'SHP-9021', client: 'Mambanda Store #4', carrier: 'Ola Trans Ltd', destination: 'Akwa, Douala', status: 'In Transit', cod: '25,000 XAF', eta: '35 mins' },
    { id: 'SHP-9022', client: 'Boutique Elegance', carrier: 'House Carrier', destination: 'Bonapriso', status: 'Picked Up', cod: '12,500 XAF', eta: '15 mins' },
    { id: 'SHP-9023', client: 'Bamenda Tech Hub', carrier: 'Express Logistics', destination: 'Deido', status: 'Assigned', cod: '45,000 XAF', eta: '1 hr' },
    { id: 'SHP-9024', client: 'Kribi Seafood Market', carrier: 'Ola Trans Ltd', destination: 'Bali', status: 'Delivered', cod: '8,000 XAF', eta: 'Completed' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="mambanda-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-sm font-semibold mb-1">
              <span>Control Tower</span>
              <span>•</span>
              <span>Live Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Mambanda Market Delivery & Logistics Platform
            </h1>
            <p className="text-slate-400 mt-1 max-w-2xl text-sm">
              Managing delivery clients, multi-carrier quotes (`@carrier-platform`), agent dispatch, and escrow/COD financial reconciliation (`@mambandamarket-core-api`).
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/client"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg text-sm transition-colors shadow-lg shadow-amber-500/20 flex items-center space-x-2"
            >
              <span>New Shipment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="mambanda-card p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">{stat.name}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <p className="text-xs font-medium text-amber-400 mt-1">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center border border-slate-800`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/client" className="mambanda-card p-6 hover:border-amber-500/50 transition-all group">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">Client & Orders Dashboard</h3>
          <p className="text-slate-400 text-sm mt-1">
            Create delivery requests, compare multi-carrier quotes (Ola Trans tariff), track shipments in real-time, and manage pickup settings.
          </p>
          <div className="mt-4 flex items-center text-amber-400 text-xs font-semibold space-x-1">
            <span>Manage Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link href="/carrier" className="mambanda-card p-6 hover:border-blue-500/50 transition-all group">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">Carrier Portal & Dispatch</h3>
          <p className="text-slate-400 text-sm mt-1">
            Carrier inbox, job offers, dispatch board, coverage maps (Douala places), rate cards, and partner rules (Ola Trans integration).
          </p>
          <div className="mt-4 flex items-center text-blue-400 text-xs font-semibold space-x-1">
            <span>Open Carrier Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link href="/finance" className="mambanda-card p-6 hover:border-purple-500/50 transition-all group">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">Reconciliation & COD Ledger</h3>
          <p className="text-slate-400 text-sm mt-1">
            Append-only ledger entries, cash-on-delivery (COD) item tracking, weekly settlements, and core API escrow reconciliation.
          </p>
          <div className="mt-4 flex items-center text-purple-400 text-xs font-semibold space-x-1">
            <span>View Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* Recent Shipments Table */}
      <div className="mambanda-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Live Shipments & Status</h3>
            <p className="text-xs text-slate-400">Real-time tracking across house carrier and partner 3PLs</p>
          </div>
          <Link href="/client" className="text-xs font-semibold text-amber-400 hover:text-amber-300">
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Shipment ID</th>
                <th className="py-3 px-4">Client / Store</th>
                <th className="py-3 px-4">Carrier</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">COD Amount</th>
                <th className="py-3 px-4">ETA</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {recentJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-amber-400">{job.id}</td>
                  <td className="py-3 px-4 font-medium text-white">{job.client}</td>
                  <td className="py-3 px-4 text-slate-300">{job.carrier}</td>
                  <td className="py-3 px-4 text-slate-400">{job.destination}</td>
                  <td className="py-3 px-4 font-mono text-slate-200">{job.cod}</td>
                  <td className="py-3 px-4 text-slate-400">{job.eta}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.status === 'Delivered'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : job.status === 'In Transit'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {job.status}
                    </span>
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
