import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { createPaymentLink, checkApiStatus, createProduct } from '@/services/payment.server';
import { PRODUCTS as CONFIG_PRODUCTS } from '@/config/products';
import { StreamPayDocsPanel } from '@/components/StreamPayDocs';
import { 
  CreditCard, 
  Package, 
  User, 
  Mail, 
  Phone, 
  ArrowRight, 
  CheckCircle, 
  Loader2,
  Shield,
  Lock,
  Calendar,
  Tag,
  Info,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export const Route = createFileRoute('/checkout/')({
  component: CheckoutPage,
});

// Products from config - these are your Stream Pay product UUIDs
const PRODUCTS = Object.values(CONFIG_PRODUCTS);

function CheckoutPage() {
  const [step, setStep] = useState<'product' | 'form' | 'processing' | 'success'>('product');
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[1]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    couponCode: '',
  });
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [createdProduct, setCreatedProduct] = useState<any>(null);

  // Check API status on mount
  useEffect(() => {
    checkApiStatus().then(setApiStatus).catch(console.error);
  }, []);

  const handleApplyCoupon = () => {
    if (formData.couponCode.toUpperCase() === 'DISCOUNT20') {
      setDiscount(20);
      setError(null);
    } else if (formData.couponCode) {
      setDiscount(0);
      setError('Invalid coupon code');
      setTimeout(() => setError(null), 3000);
    }
  };

  const calculateTotal = () => {
    const subtotal = selectedProduct.price;
    const vat = subtotal * 0.15;
    const discountAmount = (subtotal + vat) * (discount / 100);
    return {
      subtotal,
      vat,
      discount: discountAmount,
      total: subtotal + vat - discountAmount,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setStep('processing');

    try {
      const totals = calculateTotal();
      
      // Step 1: Create or get product (in production, products would already exist)
      let productId = selectedProduct.id;
      
      // If not in mock mode and product doesn't exist in Stream Pay, create it
      if (!apiStatus?.mockMode && !createdProduct) {
        try {
          const product = await createProduct({
            data: {
              name: selectedProduct.name,
              description: selectedProduct.description,
              unitPrice: totals.total,
              currency: 'SAR',
            }
          } as any);
          setCreatedProduct(product);
          productId = product.id;
        } catch (err) {
          console.log('Product may already exist, using mock ID');
        }
      }
      
      // Step 2: Create payment link
      const result = await createPaymentLink({
        data: {
          name: selectedProduct.name,
          description: `Payment for ${selectedProduct.name}`,
          currency: 'SAR',
          contact_information_type: 'PHONE',
          max_number_of_payments: 100,
          successRedirectUrl: `${window.location.origin}/payment/success`,
          failureRedirectUrl: `${window.location.origin}/payment/failure`,
          items: [
            {
              product_id: productId,
              quantity: 1,
            }
          ],
          custom_metadata: {
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            originalAmount: selectedProduct.price,
            vatAmount: totals.vat,
            discount: discount,
            couponCode: formData.couponCode,
          },
        }
      } as any);

      console.log('Payment link created:', result);
      
      if (result.url) {
        setPaymentUrl(result.url);
        setStep('success');
        
        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = result.url;
        }, 2000);
      } else {
        throw new Error('No payment URL received from API');
      }
    } catch (err: any) {
      console.error('Payment creation failed:', err);
      setError(err.message || 'An error occurred while creating payment link');
      setStep('form');
      setIsLoading(false);
    }
  };

  const totals = calculateTotal();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div dir="ltr" className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* API Status Banner */}
      {apiStatus?.mockMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-amber-400 text-sm">
              Demo Mode: Add STREAM_PAY_API_KEY and STREAM_PAY_SECRET_KEY to .env for real payments
            </p>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="bg-slate-900/50 border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {[
              { id: 'product', label: 'Select Product' },
              { id: 'form', label: 'Details' },
              { id: 'processing', label: 'Payment' },
              { id: 'success', label: 'Confirmation' },
            ].map((s, index) => {
              const stepIndex = ['product', 'form', 'processing', 'success'].indexOf(step);
              const isActive = stepIndex >= index;
              const isCurrent = ['product', 'form', 'processing', 'success'][index] === step;
              
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isCurrent 
                      ? 'bg-cyan-500 text-white' 
                      : isActive 
                        ? 'bg-cyan-500/20 text-cyan-400' 
                        : 'bg-slate-800 text-slate-500'
                  }`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      isCurrent ? 'bg-white text-cyan-500' : isActive ? 'bg-cyan-500 text-white' : 'bg-slate-700'
                    }`}>
                      {isActive ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </span>
                    {s.label}
                  </div>
                  {index < 3 && (
                    <ArrowRight className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-600'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Product Selection Step */}
            {step === 'product' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h1>
                  <p className="text-slate-400">Select the plan that fits your needs</p>
                </div>

                <div className="grid gap-4">
                  {PRODUCTS.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                        selectedProduct.id === product.id
                          ? 'bg-cyan-500/10 border-cyan-500 shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {(product as any).popular && (
                        <span className="absolute top-4 right-4 px-3 py-1 bg-linear-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
                          Most Popular
                        </span>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
                          <p className="text-slate-400 text-sm">{product.description}</p>
                        </div>
                        <div className="text-left">
                          <div className="text-3xl font-bold text-white">{product.price} SAR</div>
                          {product.id === 'prod_2' && (
                            <div className="text-sm text-emerald-400">Save 17%</div>
                          )}
                          {product.id === 'prod_3' && (
                            <div className="text-sm text-emerald-400">Save 24%</div>
                          )}
                        </div>
                      </div>

                      {selectedProduct.id === product.id && (
                        <div className="mt-4 flex items-center gap-2 text-cyan-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Selected</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep('form')}
                  className="w-full py-4 bg-linear-to-l from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Form Step */}
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setStep('product')}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Complete Your Purchase</h1>
                    <p className="text-slate-400">Enter your details to complete payment securely</p>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Customer Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 pl-12 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                          placeholder="name@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 pl-12 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                          placeholder="05XXXXXXXX"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Tag className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-white">Coupon Code</h3>
                  </div>
                  
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={formData.couponCode}
                      onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                      className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all uppercase"
                      placeholder="DISCOUNT20"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {discount > 0 && (
                    <p className="mt-2 text-emerald-400 text-sm">Discount of {discount}% applied</p>
                  )}
                  {!discount && formData.couponCode && (
                    <p className="mt-2 text-slate-500 text-sm">Try code: DISCOUNT20</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-linear-to-l from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Continue to Secure Payment
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Processing State */}
            {step === 'processing' && (
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-16 text-center">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
                  <Loader2 className="absolute inset-0 m-auto w-10 h-10 text-cyan-400 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Processing Your Request</h2>
                <p className="text-slate-400">Please wait while we set up your payment...</p>
              </div>
            )}

            {/* Success State */}
            {step === 'success' && (
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-16 text-center">
                <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8">
                  <CheckCircle className="w-12 h-12 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Payment Link Created Successfully!</h2>
                <p className="text-slate-400 mb-6">You will be redirected to the payment gateway shortly...</p>
                
                {apiStatus?.mockMode && (
                  <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <p className="text-amber-400 text-sm mb-2">
                      Demo Mode - No Real Payment
                    </p>
                    {paymentUrl && (
                      <a 
                        href={paymentUrl}
                        className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm"
                      >
                        Try Payment Link <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
                
                <div className="w-16 h-1 bg-slate-700 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-cyan-500 animate-[shrink_2s_linear]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Order Summary</h2>
              </div>

              {/* Selected Product */}
              {step !== 'product' && (
                <div className="mb-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">{selectedProduct.name}</span>
                    <button 
                      onClick={() => setStep('product')}
                      className="text-sm text-cyan-400 hover:text-cyan-300"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-sm text-slate-500">{selectedProduct.description}</p>
                </div>
              )}

              {/* Pricing Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>VAT (15%)</span>
                  <span>{formatCurrency(totals.vat)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({discount}%)</span>
                    <span>-{formatCurrency(totals.discount)}</span>
                  </div>
                )}
                <div className="border-t border-slate-700 pt-3">
                  <div className="flex justify-between text-white font-bold text-xl">
                    <span>Total</span>
                    <span>{formatCurrency(totals.total)}</span>
                  </div>
                </div>
              </div>

              {/* Security Badges */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                  <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-sm text-slate-300">Secure payment with 256-bit SSL encryption</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl">
                  <Lock className="w-5 h-5 text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-400">Your data is protected and encrypted</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl">
                  <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-400">Cancel subscription anytime</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-sm text-slate-500 mb-3 text-center">We accept all payment methods</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-8 bg-slate-700 rounded flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="w-12 h-8 bg-slate-700 rounded flex items-center justify-center text-xs text-slate-400 font-bold">
                    VISA
                  </div>
                  <div className="w-12 h-8 bg-slate-700 rounded flex items-center justify-center text-xs text-slate-400 font-bold">
                    MADA
                  </div>
                </div>
              </div>

              {step === 'form' && (
                <div className="mt-6 p-4 bg-cyan-500/5 rounded-xl border border-cyan-500/10">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-400">
                      By clicking "Continue to Secure Payment", you agree to our{' '}
                      <a href="#" className="text-cyan-400 hover:underline">Terms of Service</a> and{' '}
                      <a href="#" className="text-cyan-400 hover:underline">Privacy Policy</a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Stream Pay Documentation Panel */}
      <StreamPayDocsPanel />
    </div>
  );
}
