import React from 'react';
import Link from 'next/link';
import { Truck, Package, Users, DollarSign, CheckCircle2, ArrowRight, Activity, Zap, Shield } from 'lucide-react';

export default function ControlTower() {
  const stats = [
    { name: 'Active Shipments', value: '1,428', change: '+12.3%', icon: Package, tooltip: 'Total shipments in progress across all carriers' },
    { name: 'Active Carriers', value: '6 Partners', change: 'Ola Trans + 5', icon: Truck, tooltip: 'Verified multi-tenant logistics partners' },
    { name: 'Delivery SLA', value: '94.6%', change: '+1.4%', icon: CheckCircle2, tooltip: 'On-time delivery percentage within SLA' },
    { name: 'COD Remitted', value: '1.85M XAF', change: '98% Reconciled', icon: DollarSign, tooltip: 'Cash-on-delivery collected & remitted today' },
  ];

  const recentJobs = [
    { id: 'SHP-9021', client: 'Mambanda Store #4', carrier: 'Ola Trans Ltd', destination: 'Akwa, Douala', status: 'In Transit', cod: '25,000 XAF', eta: '35m' },
    { id: 'SHP-9022', client: 'Boutique Elegance', carrier: 'House Carrier', destination: 'Bonapriso', status: 'Picked Up', cod: '12,500 XAF', eta: '15m' },
    { id: 'SHP-9023', client: 'Bamenda Tech Hub', carrier: 'Express Logistics', destination: 'Deido', status: 'Assigned', cod: '45,000 XAF', eta: '1h' },
    { id: 'SHP-9024', client: 'Kribi Seafood', carrier: 'Ola Trans Ltd', destination: 'Bali', status: 'Delivered', cod: '8,000 XAF', eta: 'Done' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="mambanda-card relative overflow-hidden bg-gradient-to-r from-[#11131e] to-[#1a1d2b]">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#c9ee0a]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="mambanda-badge inline-block mb-3">Control Tower</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f4f6ef]">
              Logistics Command Center
            </h1>
            <p className="text-[#8b90a3] text-sm mt-1 max-w-xl">
              Multi-tenant marketplace layer for Cameroon commerce. Managing quotes, dispatch agents, and escrow reconciliation.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/client" className="mambanda-btn text-sm">
              <span>New Shipment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid with Tooltips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="mambanda-card flex items-center justify-between group relative">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b90a3]">{stat.name}</span>
                <div className="text-2xl font-extrabold text-[#f4f6ef] mt-1">{stat.value}</div>
                <div className="text-xs font-semibold text-[#c9ee0a] mt-1">{stat.change}</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#1a1d2b] border border-[#252839] text-[#c9ee0a] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#1a1d2b] text-[#f4f6ef] text-[11px] rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#252839] shadow-lg">
                {stat.tooltip}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link href="/client" className="mambanda-card hover:border-[#c9ee0a] group">
          <div className="w-10 h-10 rounded-xl bg-[#1a1d2b] border border-[#252839] text-[#c9ee0a] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#f4f6ef]">Client Orders</h3>
          <p className="text-[#8b90a3] text-xs mt-1">Multi-carrier quotes & vendor fulfillment.</p>
        </Link>
        <Link href="/carrier" className="mambanda-card hover:border-[#c9ee0a] group">
          <div className="w-10 h-10 rounded-xl bg-[#1a1d2b] border border-[#252839] text-[#c9ee0a] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#f4f6ef]">Carrier Portal</h3>
          <p className="text-[#8b90a3] text-xs mt-1">Ola Trans inbox, rate cards & coverage.</p>
        </Link>
        <Link href="/finance" className="mambanda-card hover:border-[#c9ee0a] group">
          <div className="w-10 h-10 rounded-xl bg-[#1a1d2b] border border-[#252839] text-[#c9ee0a] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#f4f6ef]">Reconciliation</h3>
          <p className="text-[#8b90a3] text-xs mt-1">COD ledger & weekly escrow settlements.</p>
        </Link>
      </div>

      {/* Live Shipments Table */}
      <div className="mambanda-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#f4f6ef]">Recent Shipments</h3>
            <p className="text-xs text-[#8b90a3]">Live telemetry across partner 3PLs</p>
          </div>
          <Link href="/client" className="text-xs font-bold text-[#c9ee0a] hover:underline">
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#07080f] text-[#8b90a3] uppercase tracking-wider border-b border-[#252839]">
              <tr>
                <th className="py-3 px-3">Tracking ID</th>
                <th className="py-3 px-3">Store</th>
                <th className="py-3 px-3">Carrier</th>
                <th className="py-3 px-3">Destination</th>
                <th className="py-3 px-3">COD</th>
                <th className="py-3 px-3">ETA</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252839] text-[#f4f6ef]">
              {recentJobs.map((job) => (
                <tr key={job.id} className="hover:bg-[#1a1d2b]/50 transition-colors">
                  <td className="py-3 px-3 font-mono text-[#c9ee0a] font-semibold">{job.id}</td>
                  <td className="py-3 px-3 font-medium">{job.client}</td>
                  <td className="py-3 px-3 text-[#8b90a3]">{job.carrier}</td>
                  <td className="py-3 px-3 text-[#8b90a3]">{job.destination}</td>
                  <td className="py-3 px-3 font-mono">{job.cod}</td>
                  <td className="py-3 px-3 text-[#8b90a3]">{job.eta}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1a1d2b] border border-[#252839] text-[#c9ee0a]">
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
