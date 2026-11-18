'use client';

import React, { useState } from 'react';
import { Package, Plus, Search, MapPin, Truck, MessageSquare, Send, X, CheckCircle2 } from 'lucide-react';
import { useApp, Order } from '@/lib/AppContext';

export default function ClientDashboard() {
  const { orders, addOrder, addMessage } = useApp();
  const [activeTab, setActiveTab] = useState<'orders' | 'quote' | 'stores'>('orders');
  const [selectedCarrier, setSelectedCarrier] = useState<string>('Ola Trans Ltd');

  // Quote form state
  const [dropoffPlace, setDropoffPlace] = useState('Akwa – Commercial Avenue');
  const [codValue, setCodValue] = useState('25,000 XAF');

  // Chat modal state
  const [chatOpen, setChatOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [newMsg, setNewMsg] = useState('');

  const handleBookOrder = () => {
    const newId = `SHP-${Math.floor(9030 + Math.random() * 100)}`;
    const newOrder: Order = {
      id: newId,
      clientName: 'New Buyer',
      clientPhone: '+237 699 00 11 22',
      destination: dropoffPlace,
      carrier: selectedCarrier,
      status: 'Pending Pickup',
      fee: selectedCarrier === 'Ola Trans Ltd' ? '2,500 XAF' : '2,800 XAF',
      cod: codValue,
      date: 'Just now',
      messages: [
        { sender: 'vendor', text: `Order booked via multi-carrier quote. Assigned to ${selectedCarrier}.`, time: 'Now' }
      ]
    };
    addOrder(newOrder);
    setActiveTab('orders');
  };

  const openChat = (order: Order) => {
    setActiveOrder(order);
    setChatOpen(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeOrder) return;
    addMessage(activeOrder.id, 'vendor', newMsg);
    setNewMsg('');
    // Update local active order messages view
    const updated = orders.find(o => o.id === activeOrder.id);
    if (updated) setActiveOrder(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mambanda-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="mambanda-badge inline-block mb-2">Vendor Portal</span>
          <h1 className="text-2xl font-extrabold text-[#f4f6ef]">Client Shipping & Direct Messaging</h1>
          <p className="text-[#8b90a3] text-xs mt-1">Manage live delivery orders, multi-carrier quotes, and contact clients directly via API messaging.</p>
        </div>
        <button
          onClick={() => setActiveTab('quote')}
          className="mambanda-btn text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Quote</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[#252839] pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders' ? 'bg-[#c9ee0a] text-[#0a0b10]' : 'text-[#8b90a3] hover:text-[#f4f6ef]'
          }`}
        >
          Live Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('quote')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'quote' ? 'bg-[#c9ee0a] text-[#0a0b10]' : 'text-[#8b90a3] hover:text-[#f4f6ef]'
          }`}
        >
          Quote Engine & Booking
        </button>
        <button
          onClick={() => setActiveTab('stores')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'stores' ? 'bg-[#c9ee0a] text-[#0a0b10]' : 'text-[#8b90a3] hover:text-[#f4f6ef]'
          }`}
        >
          Store Settings
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="mambanda-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8b90a3]" />
              <input
                type="text"
                placeholder="Search shipments..."
                className="w-full bg-[#07080f] border border-[#252839] rounded-xl pl-9 pr-4 py-2 text-xs text-[#f4f6ef] focus:outline-none focus:border-[#c9ee0a]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#07080f] text-[#8b90a3] uppercase tracking-wider border-b border-[#252839]">
                <tr>
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Destination</th>
                  <th className="py-3 px-3">Carrier</th>
                  <th className="py-3 px-3">Fee / COD</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252839] text-[#f4f6ef]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#1a1d2b]/50 transition-colors">
                    <td className="py-3 px-3 font-mono text-[#c9ee0a] font-bold">{o.id}</td>
                    <td className="py-3 px-3 font-medium">
                      {o.clientName}
                      <span className="block text-[10px] text-[#8b90a3]">{o.clientPhone}</span>
                    </td>
                    <td className="py-3 px-3 text-[#8b90a3]">{o.destination}</td>
                    <td className="py-3 px-3">{o.carrier}</td>
                    <td className="py-3 px-3 font-mono">
                      <div>{o.fee}</div>
                      <div className="text-[10px] text-[#8b90a3]">{o.cod}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1a1d2b] border border-[#252839] text-[#c9ee0a]">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={() => openChat(o)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#c9ee0a]/10 hover:bg-[#c9ee0a]/20 text-[#c9ee0a] rounded-lg text-[11px] font-bold transition-colors border border-[#c9ee0a]/20"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat Client ({o.messages.length})</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'quote' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="mambanda-card lg:col-span-1 space-y-3">
            <h3 className="text-base font-bold text-[#f4f6ef]">Request Quote & Book</h3>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#8b90a3] mb-1">Pickup Hub</label>
              <select className="w-full bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef]">
                <option>Bonabéri Head Office (HQ)</option>
                <option>Akwa Central Hub</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#8b90a3] mb-1">Dropoff Place</label>
              <select
                value={dropoffPlace}
                onChange={(e) => setDropoffPlace(e.target.value)}
                className="w-full bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef]"
              >
                <option value="Akwa – Commercial Avenue">Akwa – Commercial Avenue</option>
                <option value="Bonapriso – Rue Joss">Bonapriso – Rue Joss</option>
                <option value="Deido – Rond-point">Deido – Rond-point</option>
                <option value="Lendi – Carrefour">Lendi – Carrefour</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#8b90a3] mb-1">COD Value</label>
              <input
                type="text"
                value={codValue}
                onChange={(e) => setCodValue(e.target.value)}
                className="w-full bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef]"
              />
            </div>
          </div>

          <div className="mambanda-card lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-[#f4f6ef]">Live Carrier Tariffs</h3>
            <div className="space-y-3">
              <div
                onClick={() => setSelectedCarrier('Ola Trans Ltd')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedCarrier === 'Ola Trans Ltd' ? 'bg-[#c9ee0a]/10 border-[#c9ee0a]' : 'bg-[#07080f] border-[#252839]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-[#f4f6ef]">Ola Trans Ltd <span className="mambanda-badge ml-2 text-[9px]">Recommended</span></div>
                    <div className="text-[11px] text-[#8b90a3] mt-0.5">ETA: 120m • 4.6★ • Douala Tariff</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-extrabold text-[#c9ee0a]">2,500 XAF</div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setSelectedCarrier('House Carrier')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedCarrier === 'House Carrier' ? 'bg-[#c9ee0a]/10 border-[#c9ee0a]' : 'bg-[#07080f] border-[#252839]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-[#f4f6ef]">House Carrier (Mambanda Desk)</div>
                    <div className="text-[11px] text-[#8b90a3] mt-0.5">ETA: 90m • 4.8★ • Direct Desk</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-extrabold text-[#f4f6ef]">2,800 XAF</div>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={handleBookOrder} className="w-full mambanda-btn text-xs py-3 justify-center">
              Confirm & Book with {selectedCarrier}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'stores' && (
        <div className="mambanda-card space-y-3">
          <h3 className="text-base font-bold text-[#f4f6ef]">Store Pickup Settings</h3>
          <input type="text" defaultValue="Mambanda Central Store #4" className="w-full bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef]" />
        </div>
      )}

      {/* Direct Client Messaging Modal */}
      {chatOpen && activeOrder && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="mambanda-card w-full max-w-lg space-y-4 border border-[#c9ee0a]/30 flex flex-col h-[500px]">
            <div className="flex justify-between items-center border-b border-[#252839] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#f4f6ef]">Direct Chat with {activeOrder.clientName}</h3>
                <p className="text-[11px] text-[#c9ee0a] font-mono">{activeOrder.id} • {activeOrder.clientPhone}</p>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-[#8b90a3] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {activeOrder.messages.map((m: any, idx: number) => (
                <div key={idx} className={`flex ${m.sender === 'vendor' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                    m.sender === 'vendor'
                      ? 'bg-[#c9ee0a] text-[#0a0b10] font-medium rounded-br-none'
                      : 'bg-[#1a1d2b] border border-[#252839] text-[#f4f6ef] rounded-bl-none'
                  }`}>
                    <p>{m.text}</p>
                    <span className={`block text-[9px] mt-1 text-right ${m.sender === 'vendor' ? 'text-[#0a0b10]/70' : 'text-[#8b90a3]'}`}>{m.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="pt-2 border-t border-[#252839] flex space-x-2">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type a message to the client..."
                className="flex-1 bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef] focus:outline-none focus:border-[#c9ee0a]"
              />
              <button type="submit" className="mambanda-btn text-xs py-2 px-4">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
