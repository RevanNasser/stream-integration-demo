// Stream Pay API Documentation
export interface ApiDoc {
  endpoint: string;
  method: string;
  description: string;
  parameters: {
    name: string;
    type: string;
    required: boolean;
    description: string;
    example: string;
  }[];
  requestExample: object;
  responseExample: object;
}

export const STREAM_PAY_DOCS: Record<string, ApiDoc> = {
  createPaymentLink: {
    endpoint: '/api/v2/payment_links',
    method: 'POST',
    description: 'Creates a checkout link that redirects customers to Stream Pay secure payment page',
    parameters: [
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Display name for the payment link',
        example: 'Monthly Subscription'
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description: 'Optional description of what is being purchased',
        example: 'Payment for monthly subscription plan'
      },
      {
        name: 'items',
        type: 'array',
        required: true,
        description: 'Array of products to include in the payment (minimum 1 item)',
        example: '[{ product_id: "uuid", quantity: 1 }]'
      },
      {
        name: 'items[].product_id',
        type: 'uuid',
        required: true,
        description: 'UUID of the product (must exist in Stream Pay)',
        example: '3025034d-48f9-41cf-a32e-c93a5fe36d93'
      },
      {
        name: 'items[].quantity',
        type: 'integer',
        required: false,
        description: 'Quantity of the product (default: 1)',
        example: '1'
      },
      {
        name: 'currency',
        type: 'string',
        required: true,
        description: 'Currency code (SAR for Saudi Riyal)',
        example: 'SAR'
      },
      {
        name: 'contact_information_type',
        type: 'string',
        required: false,
        description: 'How to collect customer contact: PHONE or EMAIL',
        example: 'PHONE'
      },
      {
        name: 'max_number_of_payments',
        type: 'integer',
        required: false,
        description: 'Maximum number of times this link can be used (default: unlimited)',
        example: '100'
      },
      {
        name: 'success_redirect_url',
        type: 'url',
        required: false,
        description: 'URL to redirect after successful payment',
        example: 'https://example.com/payment/success'
      },
      {
        name: 'failure_redirect_url',
        type: 'url',
        required: false,
        description: 'URL to redirect after failed payment',
        example: 'https://example.com/payment/failure'
      },
      {
        name: 'organization_consumer_id',
        type: 'uuid',
        required: false,
        description: 'For specific customers only - skips customer info collection',
        example: 'consumer-uuid-here'
      },
      {
        name: 'custom_metadata',
        type: 'object',
        required: false,
        description: 'Custom data attached to the payment for your reference',
        example: '{ customerName: "...", orderId: "..." }'
      }
    ],
    requestExample: {
      name: "Monthly Subscription",
      description: "Payment for monthly subscription plan",
      items: [
        {
          product_id: "3025034d-48f9-41cf-a32e-c93a5fe36d93",
          quantity: 1
        }
      ],
      currency: "SAR",
      contact_information_type: "PHONE",
      max_number_of_payments: 100,
      success_redirect_url: "https://example.com/success",
      failure_redirect_url: "https://example.com/failure",
      custom_metadata: {
        customerName: "John Doe",
        customerEmail: "john@example.com"
      }
    },
    responseExample: {
      url: "https://checkout.streampay.sa/pay/pay_abc123",
      id: "pay_abc123",
      status: "ACTIVE",
      amount: "9900.00",
      currency: "SAR"
    }
  },

  createProduct: {
    endpoint: '/api/v2/products',
    method: 'POST',
    description: 'Creates a product that can be used in payment links',
    parameters: [
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Product name',
        example: 'Monthly Subscription'
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description: 'Product description',
        example: 'Full access for one month'
      },
      {
        name: 'unit_price',
        type: 'string',
        required: true,
        description: 'Price in halalas (100 halalas = 1 SAR)',
        example: '9900'
      },
      {
        name: 'currency',
        type: 'string',
        required: true,
        description: 'Currency code',
        example: 'SAR'
      }
    ],
    requestExample: {
      name: "Monthly Subscription",
      description: "Full access for one month",
      unit_price: "9900",
      currency: "SAR"
    },
    responseExample: {
      id: "3025034d-48f9-41cf-a32e-c93a5fe36d93",
      name: "Monthly Subscription",
      unit_price: "9900",
      currency: "SAR",
      status: "ACTIVE"
    }
  },

  createConsumer: {
    endpoint: '/api/v2/consumers',
    method: 'POST',
    description: 'Creates a customer record for use in payment links',
    parameters: [
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Customer full name',
        example: 'John Doe'
      },
      {
        name: 'email',
        type: 'string',
        required: false,
        description: 'Customer email address',
        example: 'john@example.com'
      },
      {
        name: 'phone',
        type: 'string',
        required: false,
        description: 'Customer phone number',
        example: '0501234567'
      }
    ],
    requestExample: {
      name: "John Doe",
      email: "john@example.com",
      phone: "0501234567"
    },
    responseExample: {
      id: "consumer-uuid-here",
      name: "John Doe",
      email: "john@example.com",
      phone: "0501234567"
    }
  },

  authentication: {
    endpoint: 'All endpoints',
    method: 'Header',
    description: 'All API requests require authentication using x-api-key header',
    parameters: [
      {
        name: 'x-api-key',
        type: 'string',
        required: true,
        description: 'Base64 encoded string of "api-key:api-secret"',
        example: 'Base64(api_key:api_secret)'
      }
    ],
    requestExample: {
      headers: {
        'x-api-key': '...',
        'Content-Type': 'application/json'
      }
    },
    responseExample: {}
  }
};

export const PAYMENT_FLOW_STEPS = [
  {
    step: 1,
    title: 'Authentication',
    description: 'Base64 encode your API key and secret, send in x-api-key header'
  },
  {
    step: 2,
    title: 'Create Products',
    description: 'Create products in Stream Pay to get their UUIDs'
  },
  {
    step: 3,
    title: 'Create Payment Link',
    description: 'Create a payment link with product UUIDs and redirect URLs'
  },
  {
    step: 4,
    title: 'Redirect Customer',
    description: 'Redirect customer to the payment link URL from the response'
  },
  {
    step: 5,
    title: 'Handle Callback',
    description: 'Process success/failure redirects and verify payment server-side'
  }
];
