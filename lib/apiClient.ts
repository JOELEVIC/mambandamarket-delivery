/**
 * Mambanda Market Core API Client
 * Conforms to mambandamarket-core-api.json specification
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.mambandamarket.com';

interface ApiOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('mk_auth_token') : null);
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
  }

  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...this.getHeaders(token),
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error?.message || `API Error: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Auth & Profile
  async signIn(email: string, password: string) {
    const res = await fetch(`https://vnmmqujmeoamuksgdoqd.supabase.co/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error_description || data.msg || 'Authentication failed');
    if (data.access_token) {
      localStorage.setItem('mk_auth_token', data.access_token);
    }
    return data;
  }

  async getMe() {
    return this.request<{ profile: any; subscription: any }>('/me');
  }

  async authSync(profileData: { display_name?: string; role?: string; phone?: string; city?: string }) {
    return this.request('/auth/sync', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  // Shipping & Quotes
  async getShippingQuote(params: { from: string; to: string; size: string }) {
    const query = new URLSearchParams(params).toString();
    return this.request<any>(`/shipping/quote?${query}`);
  }

  async getShippingRequests() {
    return this.request<any>('/shipping-requests');
  }

  async createShippingRequest(payload: any) {
    return this.request<any>('/shipping-requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Carrier Portal
  async getCarrierMe() {
    return this.request<any>('/carrier/me');
  }

  async getCarrierInbox() {
    return this.request<any>('/carrier/inbox');
  }

  async getCarrierLedger() {
    return this.request<any>('/carrier/ledger');
  }

  async getCarrierSettlements() {
    return this.request<any>('/carrier/settlements');
  }

  // Orders & Escrow
  async getOrders(role: 'buyer' | 'company' = 'company') {
    return this.request<any>(`/orders?role=${role}`);
  }

  async createOrder(payload: any) {
    return this.request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async confirmOrder(orderId: string) {
    return this.request<any>(`/orders/${orderId}/confirm`, {
      method: 'POST',
    });
  }

  // Wallet
  async getWallet() {
    return this.request<any>('/wallet');
  }

  async requestPayout(payload: { amount_cents: number; method: string; destination: string; destination_name?: string }) {
    return this.request<any>('/payouts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const apiClient = new ApiClient();
