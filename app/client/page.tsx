'use client';

import React, { useState } from 'react';
import { Package, Plus, Search, MapPin, Truck, MessageSquare, Send, X, CheckCircle2 } from 'lucide-react';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'quote' | 'stores'>('orders');
  const [selectedCarrier, setSelectedCarrier] = useState<string>('ola_trans');

  // Chat modal state
  const [chatOpen, setChatOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [messages, setMessages] = useState([
    { sender: 'client', text: 'Hello, please call me when you reach the junction near Express Union.', time: '14:15' },
    { sender: 'vendor', text: 'Noted! Dispatching rider now with your package.', time: '14:18' }
  ]);
  const [newMsg, setNewMsg] = useState('');

  const orders = [
    { id: 'SHP-9021', clientName: 'Marie Talla', clientPhone: '+237 690 11 22 33', destination: 'Akwa, Douala', carrier: 'Ola Trans Ltd', status: 'In Transit', fee: '2,500 XAF', cod: '25,000 XAF', date: 'Today, 14:20' },
    { id: 'SHP-9022', clientName: 'Paul Biya Jr.', clientPhone: '+237 677 55 44 33', destination: 'Bonapriso, Douala', carrier: 'House Carrier', status: 'Picked Up', fee: '1,800 XAF', cod: '12,500 XAF', date: 'Today, 12:10' },
    { id: 'SHP-9018', clientName: 'Dr. Ngassa', clientPhone: '+237 655 88 77 66', destination: 'Deido, Douala', carrier: 'Express Logistics', status: 'Delivered', fee: '2,200 XAF', cod: '0 XAF', date: 'Yesterday' },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setMessages([...messages, { sender: 'vendor', text: newMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setNewMsg('');
  };

  const openChat = (order: any) => {
    setActiveOrder(order);
    setChatOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mambanda-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="mambanda-badge inline-block mb-2">Vendor Portal</span>
          <h1 className="text-2xl font-extrabold text-[#f4f6ef]">Client Shipping & Direct Messaging</h1>
          <p className="text-[#8b90a3] text-xs mt-1">Manage delivery requests, multi-carrier quotes, and contact clients directly via API messaging.</p>
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
          Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('quote')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'quote' ? 'bg-[#c9ee0a] text-[#0a0b10]' : 'text-[#8b90a3] hover:text-[#f4f6ef]'
          }`}
        >
          Quote Engine
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
                        <span>Chat Client</span>
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
            <h3 className="text-base font-bold text-[#f4f6ef]">Request Quote</h3>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#8b90a3] mb-1">Pickup Hub</label>
              <select className="w-full bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef]">
                <option>Bonabéri Head Office</option>
                <option>Akwa Central</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#8b90a3] mb-1">Dropoff Place</label>
              <select className="w-full bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef]">
                <option>Akwa – Commercial Avenue</option>
                <option>Bonapriso – Rue Joss</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#8b90a3] mb-1">COD Value</label>
              <input type="text" defaultValue="25,000 XAF" className="w-full bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef]" />
            </div>
            <button className="w-full mambanda-btn text-xs mt-2 justify-center">Calculate Tariffs</button>
          </div>

          <div className="mambanda-card lg:col-span-2 space-y-3">
            <h3 className="text-base font-bold text-[#f4f6ef]">Carrier Options</h3>
            <div className="space-y-2">
              <div className="p-3 bg-[#07080f] border border-[#c9ee0a] rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#f4f6ef]">Ola Trans Ltd <span className="mambanda-badge ml-2 text-[9px]">Best Value</span></div>
                  <div className="text-[11px] text-[#8b90a3]">ETA: 120m • 4.6★</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold text-[#c9ee0a]">2,500 XAF</div>
                </div>
              </div>
            </div>
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
              {messages.map((m, idx) => (
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
