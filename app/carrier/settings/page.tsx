'use client';

import React, { useState } from 'react';
import { Settings, Download, Save, RefreshCw, CheckCircle2, Plus } from 'lucide-react';
import { useApp } from '@/lib/AppContext';

export default function CarrierSettingsPage() {
  const { tariffs, updateTariffFee, auditLogs } = useApp();
  const [activeTab, setActiveTab] = useState<'tariffs' | 'pickup' | 'audit'>('tariffs');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [pickupRule, setPickupRule] = useState({
    mode: 'long_term_discount',
    discountPct: 20,
    agencySurcharge: 500,
    waitingTimeMinutes: 10,
  });

  const handleSave = () => {
    setSaving(true);
    setSuccessMsg('');
    setTimeout(() => {
      setSaving(false);
      setSuccessMsg('Settings and tariff table successfully published and recorded in audit log.');
    }, 600);
  };

  const handleExportCSV = () => {
    const csvHeader = 'from_scope,from_ref,to_place_name,is_restricted,size_band,tier,delivery_fee\n';
    const csvRows = tariffs.map(t => `hub,bonaberi-head-office,"${t.place}",${t.restricted},default,standard,${t.fee}`).join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'olatrans-douala-tariff-v1.3.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="mambanda-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="mambanda-badge inline-block mb-2">Carrier Settings & Tariffs</span>
          <h1 className="text-2xl font-extrabold text-[#f4f6ef]">Zone, Pricing & Audit Control</h1>
          <p className="text-[#8b90a3] text-xs mt-1">Configure Ola Trans tariff rules, pickup pricing models, CSV exports, and complete audit trail.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={handleExportCSV} className="mambanda-btn text-xs bg-[#1a1d2b] text-[#c9ee0a] border border-[#252839]">
            <Download className="w-4 h-4" />
            <span>Export Tariff CSV</span>
          </button>
          <button onClick={handleSave} disabled={saving} className="mambanda-btn text-xs">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : 'Publish Changes'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[#252839] pb-2">
        <button
          onClick={() => setActiveTab('tariffs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'tariffs' ? 'bg-[#c9ee0a] text-[#0a0b10]' : 'text-[#8b90a3] hover:text-[#f4f6ef]'
          }`}
        >
          Zones & Delivery Tariffs ({tariffs.length})
        </button>
        <button
          onClick={() => setActiveTab('pickup')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pickup' ? 'bg-[#c9ee0a] text-[#0a0b10]' : 'text-[#8b90a3] hover:text-[#f4f6ef]'
          }`}
        >
          Pickup Rules & Surcharges
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'audit' ? 'bg-[#c9ee0a] text-[#0a0b10]' : 'text-[#8b90a3] hover:text-[#f4f6ef]'
          }`}
        >
          Audit Log & Change History ({auditLogs.length})
        </button>
      </div>

      {activeTab === 'tariffs' && (
        <div className="mambanda-card space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-[#f4f6ef]">Douala Delivery Tariffs (Bonabéri Hub Origin)</h3>
              <p className="text-xs text-[#8b90a3]">Prices in XAF (Zero-decimal). Changes automatically log to the immutable audit trail.</p>
            </div>
            <button className="mambanda-btn text-xs py-1.5 px-3">
              <Plus className="w-3.5 h-3.5" /> Add Location
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#07080f] text-[#8b90a3] uppercase tracking-wider border-b border-[#252839]">
                <tr>
                  <th className="py-3 px-3">Delivery Place / Quarter</th>
                  <th className="py-3 px-3">Zone</th>
                  <th className="py-3 px-3">Restricted Zone</th>
                  <th className="py-3 px-3">Delivery Fee (XAF)</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252839] text-[#f4f6ef]">
                {tariffs.map((t, idx) => (
                  <tr key={idx} className="hover:bg-[#1a1d2b]/50 transition-colors">
                    <td className="py-3 px-3 font-bold">{t.place}</td>
                    <td className="py-3 px-3 text-[#8b90a3]">{t.zone}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.restricted ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-[#1a1d2b] text-[#8b90a3]'}`}>
                        {t.restricted ? 'Restricted' : 'Standard'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <input
                        type="number"
                        value={t.fee}
                        onChange={(e) => updateTariffFee(idx, Number(e.target.value))}
                        className="w-28 bg-[#07080f] border border-[#252839] rounded-lg px-2.5 py-1 text-xs text-[#c9ee0a] font-bold focus:outline-none focus:border-[#c9ee0a]"
                      />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[11px] font-bold text-emerald-400">Synced</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pickup' && (
        <div className="mambanda-card space-y-5">
          <div>
            <h3 className="text-base font-bold text-[#f4f6ef]">Pickup Tariff Calculation Rules</h3>
            <p className="text-xs text-[#8b90a3]">Configure how pickup fees are computed when items are collected outside Bonabéri hub.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 bg-[#07080f] border border-[#252839] rounded-xl space-y-3">
              <label className="block text-xs font-bold uppercase text-[#8b90a3]">Pickup Calculation Mode</label>
              <select
                value={pickupRule.mode}
                onChange={(e) => setPickupRule({ ...pickupRule, mode: e.target.value })}
                className="w-full bg-[#11131e] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef]"
              >
                <option value="double_delivery">Double Delivery Fee (2x)</option>
                <option value="long_term_discount">Long-Term Client Rule (Delivery Fee minus 20% + Delivery Fee)</option>
              </select>
            </div>

            <div className="p-4 bg-[#07080f] border border-[#252839] rounded-xl space-y-3">
              <label className="block text-xs font-bold uppercase text-[#8b90a3]">Surcharges & Operational Rules</label>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#8b90a3]">Travel Agency Forwarding Surcharge</span>
                  <input
                    type="number"
                    value={pickupRule.agencySurcharge}
                    onChange={(e) => setPickupRule({ ...pickupRule, agencySurcharge: Number(e.target.value) })}
                    className="w-24 bg-[#11131e] border border-[#252839] rounded-lg px-2 py-1 text-[#c9ee0a] font-bold text-right"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8b90a3]">Rider Waiting Time Limit (Minutes)</span>
                  <input
                    type="number"
                    value={pickupRule.waitingTimeMinutes}
                    onChange={(e) => setPickupRule({ ...pickupRule, waitingTimeMinutes: Number(e.target.value) })}
                    className="w-24 bg-[#11131e] border border-[#252839] rounded-lg px-2 py-1 text-[#f4f6ef] text-right"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="mambanda-card space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-[#f4f6ef]">Complete Change Log & Audit Trail</h3>
              <p className="text-xs text-[#8b90a3]">Immutable audit records tracking every pricing change, zone update, and policy configuration.</p>
            </div>
            <span className="mambanda-badge">Secure Append-Only</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#07080f] text-[#8b90a3] uppercase tracking-wider border-b border-[#252839]">
                <tr>
                  <th className="py-3 px-3">Audit ID</th>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Actor</th>
                  <th className="py-3 px-3">Action</th>
                  <th className="py-3 px-3">Target / Field</th>
                  <th className="py-3 px-3">Before → After</th>
                  <th className="py-3 px-3">IP Address</th>
                  <th className="py-3 px-3">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252839] text-[#f4f6ef]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#1a1d2b]/50 transition-colors">
                    <td className="py-3.5 px-3 font-mono text-[#c9ee0a] font-bold">{log.id}</td>
                    <td className="py-3.5 px-3 text-[#8b90a3] text-[11px]">{log.timestamp}</td>
                    <td className="py-3.5 px-3 font-medium">{log.actor}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#07080f] text-[#c9ee0a] border border-[#252839]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[#8b90a3]">{log.target}</td>
                    <td className="py-3.5 px-3 font-mono">
                      <span className="text-amber-400">{log.before}</span> → <span className="text-emerald-400">{log.after}</span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-[#8b90a3]">{log.ip}</td>
                    <td className="py-3.5 px-3 text-[#8b90a3] italic">{log.reason}</td>
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
