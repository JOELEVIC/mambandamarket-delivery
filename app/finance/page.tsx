'use client';

import React, { useState } from 'react';
import { DollarSign, Download } from 'lucide-react';

export default function FinanceReconciliation() {
  const [activeTab, setActiveTab] = useState<'ledger' | 'settlements'>('ledger');

  const ledgerEntries = [
    { id: 'LED-8891', date: 'Today, 15:30', carrier: 'Ola Trans Ltd', kind: 'cod_remitted', amount: '+45,000 XAF', memo: 'COD Handover collected at Bonabéri hub', status: 'Reconciled' },
    { id: 'LED-8890', date: 'Today, 14:10', carrier: 'Ola Trans Ltd', kind: 'delivery_fee', amount: '-2,500 XAF', memo: 'Platform delivery fee deduction for SHP-9021', status: 'Settled' },
    { id: 'LED-8889', date: 'Yesterday', carrier: 'House Carrier', kind: 'cod_collected', amount: '+12,500 XAF', memo: 'Product value collected from buyer', status: 'Pending' },
  ];

  const settlements = [
    { id: 'ST-2026-0007', period: 'Nov 10 - Nov 16', carrier: 'Ola Trans Ltd', gross: '1,450,000 XAF', net: '1,305,000 XAF', status: 'Paid' },
    { id: 'ST-2026-0006', period: 'Nov 03 - Nov 09', carrier: 'Ola Trans Ltd', gross: '1,210,000 XAF', net: '1,089,000 XAF', status: 'Paid' },
  ];

  return (
    <div className="space-y-6">
      <div className="mambanda-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="mambanda-badge inline-block mb-2">Reconciliation</span>
          <h1 className="text-2xl font-extrabold text-[#f4f6ef]">COD Ledger & Escrow Statements</h1>
          <p className="text-[#8b90a3] text-xs mt-1">Append-only financial ledger conforming to core API specs.</p>
        </div>
        <button className="mambanda-btn text-xs">
          <Download className="w-4 h-4" />
          <span>Export Statement</span>
        </button>
      </div>

      <div className="flex space-x-2 border-b border-[#252839] pb-2">
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ledger' ? 'bg-[#c9ee0a] text-[#0a0b10]' : 'text-[#8b90a3] hover:text-[#f4f6ef]'
          }`}
        >
          Carrier Ledger
        </button>
        <button
          onClick={() => setActiveTab('settlements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'settlements' ? 'bg-[#c9ee0a] text-[#0a0b10]' : 'text-[#8b90a3] hover:text-[#f4f6ef]'
          }`}
        >
          Weekly Settlements
        </button>
      </div>

      {activeTab === 'ledger' && (
        <div className="mambanda-card space-y-4">
          <h3 className="text-base font-bold text-[#f4f6ef]">Append-Only Ledger Entries</h3>
          <table className="w-full text-left text-xs">
            <thead className="bg-[#07080f] text-[#8b90a3] uppercase tracking-wider border-b border-[#252839]">
              <tr>
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Carrier</th>
                <th className="py-3 px-3">Kind</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Memo</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252839] text-[#f4f6ef]">
              {ledgerEntries.map((l) => (
                <tr key={l.id} className="hover:bg-[#1a1d2b]/50">
                  <td className="py-3 px-3 font-mono text-[#c9ee0a] font-bold">{l.id}</td>
                  <td className="py-3 px-3 text-[#8b90a3]">{l.date}</td>
                  <td className="py-3 px-3">{l.carrier}</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded text-[10px] bg-[#07080f] font-mono">{l.kind}</span></td>
                  <td className={`py-3 px-3 font-mono font-bold ${l.amount.startsWith('+') ? 'text-emerald-400' : 'text-amber-400'}`}>{l.amount}</td>
                  <td className="py-3 px-3 text-[#8b90a3]">{l.memo}</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1a1d2b] border border-[#252839] text-[#c9ee0a]">{l.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'settlements' && (
        <div className="mambanda-card space-y-4">
          <h3 className="text-base font-bold text-[#f4f6ef]">Settlement Statements</h3>
          <table className="w-full text-left text-xs">
            <thead className="bg-[#07080f] text-[#8b90a3] uppercase tracking-wider border-b border-[#252839]">
              <tr>
                <th className="py-3 px-3">Statement #</th>
                <th className="py-3 px-3">Period</th>
                <th className="py-3 px-3">Carrier</th>
                <th className="py-3 px-3">Gross</th>
                <th className="py-3 px-3">Net Payout</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252839] text-[#f4f6ef]">
              {settlements.map((s) => (
                <tr key={s.id} className="hover:bg-[#1a1d2b]/50">
                  <td className="py-3 px-3 font-mono text-[#c9ee0a] font-bold">{s.id}</td>
                  <td className="py-3 px-3 text-[#8b90a3]">{s.period}</td>
                  <td className="py-3 px-3">{s.carrier}</td>
                  <td className="py-3 px-3 font-mono">{s.gross}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">{s.net}</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1a1d2b] border border-[#252839] text-[#c9ee0a]">{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
