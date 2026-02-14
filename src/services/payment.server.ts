import { createServerFn } from '@tanstack/react-start';

const STREAM_PAY_API_URL = (process.env.STREAM_PAY_API_URL || 'https://stream-app-service.streampay.sa/api/v2').replace(/\/$/, '');
const STREAM_PAY_API_KEY = process.env.STREAM_PAY_API_KEY || '';
const STREAM_PAY_SECRET_KEY = process.env.STREAM_PAY_SECRET_KEY || '';

// Create Base64 encoded API key
function getAuthToken(): string {
  const credentials = `${STREAM_PAY_API_KEY}:${STREAM_PAY_SECRET_KEY}`;
  // In Node.js environment, use Buffer
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(credentials).toString('base64');
  }
  // Fallback for other environments
  return btoa(credentials);
}

const MOCK_MODE = !STREAM_PAY_API_KEY || STREAM_PAY_API_KEY === 'your_api_key_here';

async function mockDelay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test API connectivity
async function testApiConnection(): Promise<{ success: boolean; error?: string; status?: number }> {
  try {
    console.log('🧪 Testing API connection to:', STREAM_PAY_API_URL);
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${STREAM_PAY_API_URL}/payment_links`, {
      method: 'GET',
      headers: {
        'x-api-key': getAuthToken(),
        'Accept': 'application/json',
      },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));
    
    console.log('✅ API Connection test - Status:', response.status);
    return { success: true, status: response.status };
  } catch (error: any) {
    console.error('❌ API Connection test failed:', error.message);
    return { 
      success: false, 
      error: error.message || 'Network error - Cannot reach API endpoint'
    };
  }
}

// Create Payment Link
export const createPaymentLink = createServerFn({ method: 'POST' })
  .handler(async (ctx): Promise<{
    id: string;
    url: string;
    amount: string;
    currency: string;
    status: string;
    success?: boolean;
    message?: string;
  }> => {
    const data = ctx.data as any;
    console.log('🔄 Creating payment link:', JSON.stringify(data, null, 2));
    
    // Mock mode for testing without real API
    if (MOCK_MODE) {
      console.log('🧪 MOCK MODE: Simulating payment link creation');
      await mockDelay(1500);
      
      const mockId = 'paylink_' + Math.random().toString(36).substring(2, 11);
      
      return {
        success: true,
        id: mockId,
        url: `${data.successRedirectUrl || data.callbackUrl}?mock=true&id=${mockId}&status=paid`,
        amount: data.amount?.toString() || "0",
        currency: data.currency || 'SAR',
        status: 'ACTIVE',
        message: '✅ MOCK MODE: Add STREAM_PAY_API_KEY and STREAM_PAY_SECRET_KEY to .env for real payments'
      };
    }
    
    // Real API call
    try {
      // First test the connection
      const connectionTest = await testApiConnection();
      if (!connectionTest.success) {
        throw new Error(`Cannot connect to Stream Pay API: ${connectionTest.error}`);
      }
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      
      // Build request body according to Stream Pay API
      const requestBody: any = {
        name: data.name || data.description || 'Payment',
        description: data.description || 'Payment description',
        currency: data.currency || 'SAR',
        contact_information_type: 'PHONE',
        max_number_of_payments: data.maxNumberOfPayments || 100,
        success_redirect_url: data.successRedirectUrl || data.callbackUrl,
        failure_redirect_url: data.failureRedirectUrl || data.callbackUrl,
      };
      
      // Add items if provided, otherwise create a generic item
      if (data.items && data.items.length > 0) {
        requestBody.items = data.items.map((item: any) => ({
          product_id: item.productId || item.product_id,
          quantity: item.quantity || 1
        }));
      }
      
      // Add custom metadata
      if (data.metadata || data.customMetadata) {
        requestBody.custom_metadata = data.customMetadata || data.metadata;
      }
      
      // Add consumer ID if provided
      if (data.organizationConsumerId || data.consumerId) {
        requestBody.organization_consumer_id = data.organizationConsumerId || data.consumerId;
        requestBody.max_number_of_payments = 1; // Typically 1 for specific customer
      }
      
      console.log('📤 Sending request to:', `${STREAM_PAY_API_URL}/payment_links`);
      console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));
      console.log('📤 Auth token:', getAuthToken().substring(0, 20) + '...');
      
      const response = await fetch(`${STREAM_PAY_API_URL}/payment_links`, {
        method: 'POST',
        headers: {
          'x-api-key': getAuthToken(),
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

      const responseText = await response.text();
      console.log('📥 API Response Status:', response.status);
      console.log('📥 API Response Body:', responseText.substring(0, 500));

      if (!response.ok) {
        let errorMsg = `API Error ${response.status}`;
        try {
          const err = JSON.parse(responseText);
          errorMsg = err.message || err.error || JSON.stringify(err);
        } catch {
          if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
            errorMsg = `API endpoint returned HTML instead of JSON (HTTP ${response.status}). The endpoint URL may be incorrect.`;
          } else {
            errorMsg = responseText.substring(0, 200) || `HTTP ${response.status}`;
          }
        }
        throw new Error(errorMsg);
      }

      try {
        const result = JSON.parse(responseText);
        console.log('✅ Payment link created successfully:', result.id);
        return result;
      } catch (parseError) {
        console.error('❌ Failed to parse JSON response:', responseText);
        throw new Error('Invalid JSON response from API');
      }
    } catch (error: any) {
      console.error('❌ Payment link creation failed:', error);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - API took too long to respond');
      }
      if (error.message?.includes('fetch failed') || error.message?.includes('ENOTFOUND')) {
        throw new Error(`Cannot reach Stream Pay API at ${STREAM_PAY_API_URL}. Please check: 1) API URL is correct, 2) Internet connection, 3) API service is up`);
      }
      
      throw new Error(error.message || 'Failed to create payment link');
    }
  });

// Create Product
export const createProduct = createServerFn({ method: 'POST' })
  .handler(async (ctx): Promise<{
    id: string;
    name: string;
    unit_price: number | string;
    currency: string;
    status: string;
  }> => {
    const data = ctx.data as any;
    
    if (MOCK_MODE) {
      await mockDelay(800);
      return {
        id: 'prod_' + Math.random().toString(36).substring(2, 11),
        name: data.name,
        unit_price: data.unitPrice || data.unit_price,
        currency: data.currency || 'SAR',
        status: 'ACTIVE',
      };
    }
    
    try {
      const response = await fetch(`${STREAM_PAY_API_URL}/products`, {
        method: 'POST',
        headers: {
          'x-api-key': getAuthToken(),
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          unit_price: (data.unitPrice || data.unit_price)?.toString(),
          currency: data.currency || 'SAR',
          recurring: data.recurring || false,
          recurring_interval: data.recurringInterval,
          recurring_frequency: data.recurringFrequency,
        }),
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to create product: ${text}`);
      }
      
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create product');
    }
  });

// Create Consumer
export const createConsumer = createServerFn({ method: 'POST' })
  .handler(async (ctx): Promise<{
    id: string;
    name: string;
    email: string;
    phone?: string;
  }> => {
    const data = ctx.data as any;
    
    if (MOCK_MODE) {
      await mockDelay(800);
      return {
        id: 'cons_' + Math.random().toString(36).substring(2, 11),
        name: data.name,
        email: data.email,
        phone: data.phone,
      };
    }
    
    try {
      const response = await fetch(`${STREAM_PAY_API_URL}/consumers`, {
        method: 'POST',
        headers: {
          'x-api-key': getAuthToken(),
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to create consumer: ${text}`);
      }
      
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create consumer');
    }
  });

// Get Invoice
export const getInvoice = createServerFn({ method: 'POST' })
  .handler(async (ctx): Promise<{
    id: string;
    status: string;
    amount: string;
    currency: string;
  }> => {
    const invoiceId = ctx.data as unknown as string;
    
    if (MOCK_MODE) {
      await mockDelay(500);
      return {
        id: invoiceId,
        status: 'PAID',
        amount: "100.00",
        currency: 'SAR',
      };
    }
    
    try {
      const response = await fetch(`${STREAM_PAY_API_URL}/invoices/${invoiceId}`, {
        headers: {
          'x-api-key': getAuthToken(),
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to get invoice: ${text}`);
      }
      
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get invoice');
    }
  });

// Test API Connection
export const testConnection = createServerFn({ method: 'GET' })
  .handler(async (): Promise<{
    success: boolean;
    error?: string;
    status?: number;
    apiUrl: string;
    hasApiKey: boolean;
    hasSecretKey: boolean;
    mockMode: boolean;
  }> => {
    const result = await testApiConnection();
    return {
      ...result,
      apiUrl: STREAM_PAY_API_URL,
      hasApiKey: !!STREAM_PAY_API_KEY,
      hasSecretKey: !!STREAM_PAY_SECRET_KEY,
      mockMode: MOCK_MODE,
    };
  });

// Check API Status
export const checkApiStatus = createServerFn({ method: 'GET' })
  .handler(async (): Promise<{
    mockMode: boolean;
    apiUrl: string;
    hasApiKey: boolean;
    hasSecretKey: boolean;
    message: string;
  }> => {
    return {
      mockMode: MOCK_MODE,
      apiUrl: STREAM_PAY_API_URL,
      hasApiKey: !!STREAM_PAY_API_KEY,
      hasSecretKey: !!STREAM_PAY_SECRET_KEY,
      message: MOCK_MODE 
        ? 'Running in MOCK mode. Add STREAM_PAY_API_KEY and STREAM_PAY_SECRET_KEY to .env for real payments.'
        : 'Attempting to connect to Stream Pay API'
    };
  });
