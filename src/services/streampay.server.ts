import { createServerFn } from '@tanstack/react-start';

// Environment variables (server-side only)
const STREAM_PAY_API_URL = (process.env.STREAM_PAY_API_URL || 'https://stream-app-service.streampay.sa/api/v2').replace(/\/$/, '');
const STREAM_PAY_API_KEY = process.env.STREAM_PAY_API_KEY || '';
const STREAM_PAY_SECRET_KEY = process.env.STREAM_PAY_SECRET_KEY || '';

// Mock mode for testing
const MOCK_MODE = !STREAM_PAY_API_KEY || STREAM_PAY_API_KEY === 'your_api_key_here';

interface StreamPayConfig {
  apiUrl: string;
  apiKey: string;
  secretKey: string;
}

function getConfig(): StreamPayConfig {
  return {
    apiUrl: STREAM_PAY_API_URL,
    apiKey: STREAM_PAY_API_KEY,
    secretKey: STREAM_PAY_SECRET_KEY,
  };
}

async function streamPayRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const config = getConfig();
  
  console.log(`🌐 Stream Pay API: ${config.apiUrl}${endpoint}`);
  
  try {
    const response = await fetch(`${config.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    const responseText = await response.text();
    
    console.log(`📥 Response status: ${response.status}`);
    
    if (!response.ok) {
      let errorMessage = `Stream Pay API error: ${response.status}`;
      try {
        const errorJson = JSON.parse(responseText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
          errorMessage = `API endpoint error (HTTP ${response.status}). Check if STREAM_PAY_API_URL is correct.`;
        } else {
          errorMessage = responseText.substring(0, 200) || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }

    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('Invalid JSON response:', responseText.substring(0, 200));
      throw new Error('Invalid JSON response from API');
    }
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

function mockDelay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let mockBaseUrl = 'http://localhost:3000';

// Create Payment Link - Server Function
export const createPaymentLinkFn = createServerFn({ method: 'POST' })
  .handler(async (ctx: any): Promise<{
    id: string;
    url: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
  }> => {
    const data = ctx.data;
    console.log('🔧 Creating payment link:', data);
    
    if (MOCK_MODE) {
      console.log('🧪 MOCK MODE: Creating mock payment link');
      await mockDelay(1500);
      
      const url = new URL(data.callbackUrl);
      mockBaseUrl = `${url.protocol}//${url.host}`;
      
      const mockPaymentId = 'pay_' + Math.random().toString(36).substring(2, 15);
      return {
        id: mockPaymentId,
        url: `${mockBaseUrl}/payment/success?mock=true&id=${mockPaymentId}&amount=${data.amount}`,
        amount: data.amount,
        currency: data.currency,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
    }
    
    return streamPayRequest('/payment-links', {
      method: 'POST',
      body: JSON.stringify({
        amount: Math.round(data.amount * 100),
        currency: data.currency,
        description: data.description,
        callback_url: data.callbackUrl,
        metadata: data.metadata,
      }),
    });
  });

// Get Payment - Server Function
export const getPaymentFn = createServerFn({ method: 'GET' })
  .handler(async (ctx: any): Promise<{
    id: string;
    status: string;
    amount: number;
    currency: string;
    description: string;
    createdAt: string;
    paidAt?: string;
  }> => {
    const paymentId = ctx.data;
    
    if (MOCK_MODE) {
      await mockDelay(500);
      return {
        id: paymentId,
        status: 'paid',
        amount: 10000,
        currency: 'SAR',
        description: 'Mock payment',
        createdAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
      };
    }
    
    return streamPayRequest(`/payments/${paymentId}`);
  });

// Refund Payment - Server Function
export const refundPaymentFn = createServerFn({ method: 'POST' })
  .handler(async (ctx: any): Promise<{
    id: string;
    status: string;
    amount: number;
    currency: string;
    description: string;
    createdAt: string;
    refundedAt: string;
  }> => {
    const data = ctx.data;
    
    if (MOCK_MODE) {
      await mockDelay(1000);
      return {
        id: data.paymentId,
        status: 'refunded',
        amount: data.amount || 10000,
        currency: 'SAR',
        description: 'Mock refund',
        createdAt: new Date().toISOString(),
        refundedAt: new Date().toISOString(),
      };
    }
    
    return streamPayRequest(`/payments/${data.paymentId}/refund`, {
      method: 'POST',
      body: JSON.stringify({
        amount: data.amount ? Math.round(data.amount * 100) : undefined,
        reason: data.reason,
      }),
    });
  });

// Create Invoice - Server Function
export const createInvoiceFn = createServerFn({ method: 'POST' })
  .handler(async (ctx: any): Promise<{
    id: string;
    amount: number;
    currency: string;
    description: string;
    status: string;
    url: string;
    consumerEmail: string;
    consumerName: string;
    createdAt: string;
  }> => {
    const data = ctx.data;
    
    if (MOCK_MODE) {
      console.log('🧪 MOCK MODE: Creating mock invoice');
      await mockDelay(1500);
      
      const url = new URL(data.callbackUrl);
      mockBaseUrl = `${url.protocol}//${url.host}`;
      
      const mockInvoiceId = 'inv_' + Math.random().toString(36).substring(2, 15);
      return {
        id: mockInvoiceId,
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        status: 'pending',
        url: `${mockBaseUrl}/payment/invoice?mock=true&id=${mockInvoiceId}`,
        consumerEmail: data.consumerEmail,
        consumerName: data.consumerName,
        createdAt: new Date().toISOString(),
      };
    }
    
    return streamPayRequest('/invoices', {
      method: 'POST',
      body: JSON.stringify({
        amount: Math.round(data.amount * 100),
        currency: data.currency,
        description: data.description,
        items: data.items?.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          unit_price: Math.round(item.unitPrice * 100),
        })),
        consumer: {
          email: data.consumerEmail,
          name: data.consumerName,
        },
        callback_url: data.callbackUrl,
      }),
    });
  });

// Get Invoice - Server Function
export const getInvoiceFn = createServerFn({ method: 'GET' })
  .handler(async (ctx: any): Promise<{
    id: string;
    amount: number;
    currency: string;
    description: string;
    status: string;
    url: string;
    consumerEmail: string;
    consumerName: string;
    createdAt: string;
  }> => {
    const invoiceId = ctx.data;
    
    if (MOCK_MODE) {
      await mockDelay(500);
      return {
        id: invoiceId,
        amount: 10000,
        currency: 'SAR',
        description: 'Mock invoice',
        status: 'pending',
        url: `${mockBaseUrl}/payment/invoice?mock=true&id=${invoiceId}`,
        consumerEmail: 'test@example.com',
        consumerName: 'Test User',
        createdAt: new Date().toISOString(),
      };
    }
    
    return streamPayRequest(`/invoices/${invoiceId}`);
  });

// Create Consumer - Server Function
export const createConsumerFn = createServerFn({ method: 'POST' })
  .handler(async (ctx: any): Promise<{
    id: string;
    name: string;
    email: string;
    phone?: string;
    createdAt: string;
  }> => {
    const data = ctx.data;
    
    if (MOCK_MODE) {
      await mockDelay(800);
      return {
        id: 'cons_' + Math.random().toString(36).substring(2, 15),
        name: data.name,
        email: data.email,
        phone: data.phone,
        createdAt: new Date().toISOString(),
      };
    }
    
    return streamPayRequest('/consumers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  });

// Get Consumer - Server Function
export const getConsumerFn = createServerFn({ method: 'GET' })
  .handler(async (ctx: any): Promise<{
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }> => {
    const consumerId = ctx.data;
    
    if (MOCK_MODE) {
      await mockDelay(500);
      return {
        id: consumerId,
        name: 'Test Consumer',
        email: 'test@example.com',
        createdAt: new Date().toISOString(),
      };
    }
    
    return streamPayRequest(`/consumers/${consumerId}`);
  });

// Check if we're in mock mode
export const isMockModeFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    return { mockMode: MOCK_MODE };
  });
