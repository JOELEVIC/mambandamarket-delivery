'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, Shield, Phone, Mail, HelpCircle } from 'lucide-react';

export default function SupportPage() {
  const [subject, setSubject] = useState('Settlement Dispute');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSent(true);
    setTimeout(() => {
      setMessage('');
      setSent(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="mambanda-card">
        <span className="mambanda-badge inline-block mb-2">Mambanda Market Support</span>
        <h1 className="text-2xl font-extrabold text-[#f4f6ef]">Direct Support & Contact</h1>
        <p className="text-[#8b90a3] text-xs mt-1">Send a direct message or support ticket to Mambanda Market operations, finance, or logistics desk.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Info Card */}
        <div className="mambanda-card space-y-4 md:col-span-1">
          <h3 className="text-base font-bold text-[#f4f6ef]">Support Channels</h3>
          <div className="space-y-3 text-xs text-[#8b90a3]">
            <div className="flex items-center space-x-3 p-3 bg-[#07080f] rounded-xl border border-[#252839]">
              <Phone className="w-4 h-4 text-[#c9ee0a]" />
              <div>
                <div className="font-bold text-[#f4f6ef]">Logistics Hotline</div>
                <div>+237 690 00 11 22</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-[#07080f] rounded-xl border border-[#252839]">
              <Mail className="w-4 h-4 text-[#c9ee0a]" />
              <div>
                <div className="font-bold text-[#f4f6ef]">Operations Email</div>
                <div>logistics@mambandamarket.com</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-[#07080f] rounded-xl border border-[#252839]">
              <Shield className="w-4 h-4 text-[#c9ee0a]" />
              <div>
                <div className="font-bold text-[#f4f6ef]">SLA Response Time</div>
                <div>&lt; 30 minutes (24/7)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Messaging Form */}
        <div className="mambanda-card md:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-[#f4f6ef]">Open a Direct Ticket</h3>

          {sent ? (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto" />
              <div className="font-bold text-sm">Message Sent Successfully!</div>
              <p className="text-xs text-[#8b90a3]">Mambanda Market support team has received your ticket and will respond shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#8b90a3] mb-1">Subject / Inquiry Type</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#07080f] border border-[#252839] rounded-xl px-3 py-2 text-xs text-[#f4f6ef] focus:outline-none focus:border-[#c9ee0a]"
                >
                  <option value="Settlement Dispute">Settlement & COD Reconciliation Dispute</option>
                  <option value="Carrier Onboarding">Carrier Onboarding & Rate Card Verification</option>
                  <option value="Rider Emergency">Rider Emergency / Delivery Exception</option>
                  <option value="General Inquiry">General Platform Support</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#8b90a3] mb-1">Message Details</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry, order ID, or issue in detail..."
                  className="w-full bg-[#07080f] border border-[#252839] rounded-xl p-3 text-xs text-[#f4f6ef] focus:outline-none focus:border-[#c9ee0a]"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button type="submit" className="mambanda-btn text-xs">
                  <Send className="w-4 h-4" />
                  <span>Send Direct Message</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
