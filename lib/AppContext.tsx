'use client';

import React, { createContext, useContext, useState } from 'react';

export interface Order {
  id: string;
  clientName: string;
  clientPhone: string;
  destination: string;
  carrier: string;
  status: string;
  fee: string;
  cod: string;
  date: string;
  messages: { sender: string; text: string; time: string }[];
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  hub: string;
  codFloat: string;
  status: string;
}

export interface TariffItem {
  place: string;
  zone: string;
  fee: number;
  restricted: boolean;
  status: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  before: string;
  after: string;
  ip: string;
  reason: string;
}

interface AppContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: string) => void;
  addMessage: (orderId: string, sender: string, text: string) => void;

  riders: Rider[];
  addRider: (rider: Rider) => void;
  toggleRiderStatus: (id: string) => void;

  tariffs: TariffItem[];
  updateTariffFee: (index: number, fee: number) => void;

  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;

  company: {
    name: string;
    rccm: string;
    niu: string;
    email: string;
    phone: string;
  };
  updateCompany: (c: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'SHP-9021',
      clientName: 'Marie Talla',
      clientPhone: '+237 690 11 22 33',
      destination: 'Akwa, Douala',
      carrier: 'Ola Trans Ltd',
      status: 'In Transit',
      fee: '2,500 XAF',
      cod: '25,000 XAF',
      date: 'Today, 14:20',
      messages: [
        { sender: 'client', text: 'Please call me when you reach Express Union junction.', time: '14:15' },
        { sender: 'vendor', text: 'Noted, rider dispatched.', time: '14:18' }
      ]
    },
    {
      id: 'SHP-9022',
      clientName: 'Paul Biya Jr.',
      clientPhone: '+237 677 55 44 33',
      destination: 'Bonapriso, Douala',
      carrier: 'House Carrier',
      status: 'Picked Up',
      fee: '1,800 XAF',
      cod: '12,500 XAF',
      date: 'Today, 12:10',
      messages: []
    }
  ]);

  const [riders, setRiders] = useState<Rider[]>([
    { id: 'RID-101', name: 'Jean-Pierre Kamga', phone: '+237 699 11 22 33', vehicle: 'Yamaha Moto', hub: 'Bonabéri Hub', codFloat: '45,000 XAF', status: 'On Duty' },
    { id: 'RID-102', name: 'Emmanuel Talla', phone: '+237 677 44 55 66', vehicle: 'Scooter', hub: 'Akwa Depot', codFloat: '12,000 XAF', status: 'On Delivery' },
    { id: 'RID-103', name: 'Patrick Mbarga', phone: '+237 690 99 88 77', vehicle: 'Van', hub: 'Bonabéri Hub', codFloat: '180,000 XAF', status: 'On Duty' },
  ]);

  const [tariffs, setTariffs] = useState<TariffItem[]>([
    { place: 'Bonabéri (Head Office)', zone: 'Zone 3 (West)', fee: 1000, restricted: false, status: 'Active' },
    { place: 'Akwa', zone: 'Zone 1 (Central)', fee: 1500, restricted: false, status: 'Active' },
    { place: 'Bonanjo', zone: 'Zone 1 (Central)', fee: 2000, restricted: true, status: 'Active' },
    { place: 'Bonapriso', zone: 'Zone 1 (Central)', fee: 2000, restricted: true, status: 'Active' },
    { place: 'Deido', zone: 'Zone 2 (North)', fee: 1000, restricted: false, status: 'Active' },
    { place: 'Lendi', zone: 'Zone 2 (North)', fee: 3000, restricted: false, status: 'Active' },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: 'AUD-9042', timestamp: '2026-11-20 14:15:22', actor: 'Jean-Pierre (Carrier Owner)', action: 'RATE_CARD_UPDATED', target: 'Lendi delivery fee', before: '2,500 XAF', after: '3,000 XAF', ip: '192.168.1.45', reason: 'Fuel cost adjustment' },
    { id: 'AUD-9041', timestamp: '2026-11-18 09:30:10', actor: 'Admin (Mambanda Ops)', action: 'RESTRICTED_ZONE_FLAGGED', target: 'Bonanjo & Bonapriso', before: 'Standard', after: 'Restricted (Permit Required)', ip: '10.0.4.12', reason: 'Regulatory compliance' },
  ]);

  const [company, setCompany] = useState({
    name: 'Ola Trans Ltd (Partner 3PL)',
    rccm: 'RC/DLA/2024/B/1892',
    niu: 'M08241289341P',
    email: 'olatranslimited@gmail.com',
    phone: '+237 678 23 74 56',
  });

  const addOrder = (order: Order) => setOrders([order, ...orders]);
  const updateOrderStatus = (id: string, status: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };
  const addMessage = (orderId: string, sender: string, text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOrders(orders.map(o => o.id === orderId ? { ...o, messages: [...o.messages, { sender, text, time }] } : o));
  };

  const addRider = (rider: Rider) => setRiders([rider, ...riders]);
  const toggleRiderStatus = (id: string) => {
    setRiders(riders.map(r => r.id === id ? { ...r, status: r.status === 'Suspended' ? 'On Duty' : 'Suspended' } : r));
  };

  const updateTariffFee = (index: number, fee: number) => {
    const updated = [...tariffs];
    const oldFee = updated[index].fee;
    updated[index].fee = fee;
    setTariffs(updated);
    addAuditLog({
      actor: 'Jean-Pierre (Carrier Owner)',
      action: 'TARIFF_FEE_UPDATED',
      target: updated[index].place,
      before: `${oldFee} XAF`,
      after: `${fee} XAF`,
      ip: '192.168.1.45',
      reason: 'Manual tariff rate update'
    });
  };

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const updateCompany = (c: any) => {
    setCompany(c);
    addAuditLog({
      actor: 'Logistics Admin',
      action: 'COMPANY_PROFILE_UPDATED',
      target: c.name,
      before: company.name,
      after: c.name,
      ip: '192.168.1.45',
      reason: 'Settings profile update'
    });
  };

  return (
    <AppContext.Provider value={{
      orders, addOrder, updateOrderStatus, addMessage,
      riders, addRider, toggleRiderStatus,
      tariffs, updateTariffFee,
      auditLogs, addAuditLog,
      company, updateCompany
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
