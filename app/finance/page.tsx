'use client';

import React, { useState } from 'react';
import { DollarSign, ShieldCheck, FileText, CheckCircle2, AlertCircle, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function FinanceReconciliation() {
  const [activeTab, setActiveTab] = useState<'ledger' | 'cod' | 'settlements'>('ledger');

  const ledgerEntries = [
    { id: 'LED-8891', date: 'Today, 15:30', carrier: 'Ola Trans Ltd', kind: 'cod_remitted', amount: '+45,000 XAF', memo: 'COD Handover collected at Bonabéri hub', status: 'Reconciled' },
    { id: 'LED-8890', date: 'Today, 14:10', carrier: 'Ola Trans Ltd', kind: 'delivery_fee', amount: '-2,500 XAF', memo: 'Platform delivery fee deduction for SHP-9021', status: 'Settled' },
    { id: 'LED-8889', date: 'Yesterday', carrier: 'House Carrier', kind: 'cod_collected', amount: '+12,500 XAF', memo: 'Product value collected from buyer', status: 'Pending Remittance' },
    { id: 'LED-8888', date: 'Yesterday', carrier: 'Express Logistics', kind: 'platform_fee', amount: '-450 XAF', memo: '15% platform commission on shipment', status: 'Settled' },
  ];

  const settlements = [
    { id: 'ST-2026-0007', period: 'Nov 10 - Nov 16, 2026', carrier: 'Ola Trans Ltd', gross: '1,450,000 XAF', platformFee: '145,000 XAF', net: '1,305,000 XAF', status: 'Agreed & Paid' },
    { id: 'ST-2026-0006', period: 'Nov 03 - Nov 09, 2026', carrier: 'Ola Trans Ltd', gross: '1,210,000 XAF', platformFee: '121,000 XAF', net: '1,089,000 XAF', status: 'Paid' },
    { id: 'ST-2026-0005', period: 'Nov 03 - Nov 09, 2026', carrier: 'House Carrier', gross: '2,400,000 XAF', platformFee: '240,000 XAF', net: '2,160,000 XAF', status: 'Paid' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 text-sm font-semibold mb-1">
            <span>Financial Reconciliation</span>
            <span>•</span>
            <span>Core API Ledger & Settlements</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">COD Ledger & Escrow Reconciliation</h1>
          <p className="text-slate-400 text-sm mt-1">
            Append-only financial ledger entries conforming to `mambandamarket-core-api`. Reconcile cash-on-delivery (COD) items and weekly carrier settlements.
          </p>
        </div>
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-sm transition-colors flex items-center space-x-2 shadow-lg shadow-purple-500/20">
          <Download className="w-4 h-4" />
          <span>Export Reconciliation Statement</span>
        </button>
      </div>

      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'ledger' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Append-Only Carrier Ledger
        </button>
        <button
          onClick={() => setActiveTab('settlements')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'settlements' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Weekly Settlements & Escrow
        </button>
      </div>

      {activeTab === 'ledger' && (
        <div className="mambanda-card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Carrier Ledger Entries (Signed XAF)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ledger ID</th>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Carrier</th>
                  <th className="py-3 px-4">Entry Kind</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Memo / Reference</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {ledgerEntries.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-purple-400 font-medium">{l.id}</td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs">{l.date}</td>
                    <td className="py-3.5 px-4 font-medium text-white">{l.carrier}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-300">
                        {l.kind}
                      </span>
                    </td>
                    <td className={`py-3.5 px-4 font-mono font-bold ${l.amount.startsWith('+') ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {l.amount}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{l.memo}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settlements' && (
        <div className="mambanda-card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Weekly Settlement Statements</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Statement #</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Carrier</th>
                  <th className="py-3 px-4">Gross Fees</th>
                  <th className="py-3 px-4">Platform Fee (10%)</th>
                  <th className="py-3 px-4">Net Payout</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {settlements.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-purple-400 font-medium">{s.id}</td>
                    <td className="py-3.5 px-4 text-slate-300 text-xs">{s.period}</td>
                    <td className="py-3.5 px-4 font-medium text-white">{s.carrier}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-200">{s.gross}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{s.platformFee}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{s.net}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-xs font-semibold text-purple-400 hover:text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-md">
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
