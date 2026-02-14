# Payment Gateway - Stream Pay Integration

A complete payment gateway integration with Stream Pay, providing a smooth and secure payment experience.

## Features

### Landing Page
- Modern professional design in English
- Full RTL support capability
- Gateway features showcase
- Supported payment methods
- Statistics and facts
- Fully responsive design

### Optimized Checkout Page (/checkout)
- **Multi-step flow**:
  1. Product selection (3 plans available)
  2. Customer information input
  3. Payment processing
  4. Success confirmation

- **Subscription Plans**:
  - Monthly subscription (99 SAR)
  - 3-Month subscription (249 SAR) - Most Popular
  - Annual subscription (899 SAR) - Best Value

- **Additional Features**:
  - Discount coupon system
  - VAT calculation (15%)
  - Progress bar for payment steps
  - Detailed order summary
  - Security badges

## Requirements

Add environment variables in `.env` file:

```env
STREAM_PAY_API_URL=https://stream-app-service.streampay.sa/api/v2/
STREAM_PAY_API_KEY=your_api_key
STREAM_PAY_SECRET_KEY=your_secret_key
APP_URL=http://localhost:3000
```

## Running the Project

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser

## Technical Architecture

### Backend (tRPC)
- `src/trpc/router.ts` - tRPC router
- `src/trpc/client.ts` - React client
- `src/trpc/provider.tsx` - App provider
- `src/services/streampay.ts` - Stream Pay API
- `src/routes/api/trpc.ts` - API endpoint

### Frontend
- `src/routes/index.tsx` - Landing page
- `src/routes/checkout/index.tsx` - Checkout page
- `src/components/Header.tsx` - Navigation
- `src/routes/__root.tsx` - Root layout

### Available Actions (tRPC Procedures)

#### Payment
- `payment.createPaymentLink` - Create payment link
- `payment.getPayment` - Get payment details
- `payment.refundPayment` - Refund payment
- `payment.listPayments` - List payments

#### Invoice
- `invoice.createInvoice` - Create invoice
- `invoice.getInvoice` - Get invoice details

#### Consumer
- `consumer.createConsumer` - Create consumer
- `consumer.getConsumer` - Get consumer details

## Coupon Experience

Try the discount code: **DISCOUNT20** (20% off)

## License

MIT
