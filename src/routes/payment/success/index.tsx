import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Copy, 
  Check,
  Home,
  ShoppingBag
} from 'lucide-react';

export const Route = createFileRoute('/payment/success/')({
  component: PaymentSuccessPage,
});

interface PaymentParams {
  id?: string;
  payment_link_id?: string;
  invoice_id?: string;
  consent_id?: string;
  payment_id?: string;
  organization_consumer_id?: string;
  status?: string;
  message?: string;
  login_method?: string;
}

function PaymentSuccessPage() {
  const [params, setParams] = useState<PaymentParams | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const paymentData: PaymentParams = {};
    
    for (const [key, value] of searchParams.entries()) {
      (paymentData as any)[key] = value;
    }
    
    setParams(paymentData);
  }, []);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const isPaid = params?.status === 'paid' || params?.message === 'APPROVED';

  return (
    <div dir="ltr" className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isPaid ? 'bg-emerald-500/20' : 'bg-amber-500/20'
          }`}>
            {isPaid ? (
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            ) : (
              <XCircle className="w-12 h-12 text-amber-400" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isPaid ? 'Payment Successful!' : 'Payment Status'}
          </h1>
          <p className="text-slate-400">
            {isPaid 
              ? 'Thank you for your payment. Your transaction has been completed successfully.'
              : 'Your payment is being processed.'
            }
          </p>
        </div>

        {params && (
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-bold text-white mb-4">Payment Details</h2>
            <div className="space-y-3">
              {params.status && (
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Status</span>
                  <span className={`font-medium ${isPaid ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {params.status.toUpperCase()}
                  </span>
                </div>
              )}
              {params.message && (
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Message</span>
                  <span className="text-white">{params.message}</span>
                </div>
              )}
              {params.payment_id && (
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Payment ID</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-sm">{params.payment_id}</span>
                    <button
                      onClick={() => copyToClipboard(params.payment_id!, 'payment_id')}
                      className="p-1 hover:bg-slate-700 rounded transition-colors"
                    >
                      {copied === 'payment_id' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
              )}
              {params.payment_link_id && (
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Payment Link ID</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-sm">{params.payment_link_id}</span>
                    <button
                      onClick={() => copyToClipboard(params.payment_link_id!, 'payment_link_id')}
                      className="p-1 hover:bg-slate-700 rounded transition-colors"
                    >
                      {copied === 'payment_link_id' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
              )}
              {params.invoice_id && (
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Invoice ID</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-sm">{params.invoice_id}</span>
                    <button
                      onClick={() => copyToClipboard(params.invoice_id!, 'invoice_id')}
                      className="p-1 hover:bg-slate-700 rounded transition-colors"
                    >
                      {copied === 'invoice_id' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
              )}
              {params.consent_id && (
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Consent ID</span>
                  <span className="text-white font-mono text-sm">{params.consent_id}</span>
                </div>
              )}
              {params.organization_consumer_id && (
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Consumer ID</span>
                  <span className="text-white font-mono text-sm">{params.organization_consumer_id}</span>
                </div>
              )}
              {params.login_method && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400">Login Method</span>
                  <span className="text-white">{params.login_method}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </a>
          <a
            href="/checkout"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-l from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            Make Another Payment
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
