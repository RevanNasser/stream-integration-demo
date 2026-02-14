import { createFileRoute } from '@tanstack/react-router';
import { STREAM_PAY_DOCS } from '@/config/streampay-docs';
import { BookOpen, Code, Globe, Server, Key, FileJson, ArrowRight, Shield, CreditCard, ExternalLink, Layers } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/docs/stream-pay')({
  component: StreamPayDocsPage,
});

function StreamPayDocsPage() {
  const [activeSection, setActiveSection] = useState<'overview' | 'api' | 'flow'>('overview');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('createPaymentLink');

  const doc = STREAM_PAY_DOCS[selectedEndpoint as keyof typeof STREAM_PAY_DOCS];

  return (
    <div className="min-h-screen bg-slate-950" dir="ltr">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/20 rounded-xl">
              <BookOpen className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Stream Pay Documentation</h1>
              <p className="text-slate-400 mt-1">Complete guide for integrating Stream Pay payment gateway</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-slate-900/50 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: Globe },
              { id: 'api', label: 'API Reference', icon: Code },
              { id: 'flow', label: 'Integration Flow', icon: CreditCard },
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                  activeSection === section.id
                    ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Introduction */}
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">
              <h2 className="text-2xl font-bold text-white mb-4">What is Stream Pay?</h2>
              
              <p className="text-slate-300 leading-relaxed text-lg">
                Stream Pay is a secure payment gateway that enables you to accept online payments in Saudi Arabia. 
                It provides a seamless checkout experience with support for multiple payment methods including 
                credit cards, Apple Pay, and STC Pay.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    Gateway Features
                  </h3>
                  <ul className="space-y-2 text-slate-400">
                    <li>• Support for all credit cards</li>
                    <li>• Apple Pay and STC Pay support</li>
                    <li>• Installment payments (Tabby, Tamara)</li>
                    <li>• Integrated invoicing system</li>
                    <li>• Subscriptions and recurring payments</li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-cyan-400" />
                    Integration Requirements
                  </h3>
                  <ul className="space-y-2 text-slate-400">
                    <li>• Stream Pay account</li>
                    <li>• API Key and Secret Key</li>
                    <li>• Products registered in the system</li>
                    <li>• Success and failure redirect URLs</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Start */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Key className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Authentication</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                  All API requests must include authentication credentials
                </p>
                <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                  <code className="text-xs text-slate-300 block mb-2">
                    # Encode credentials<br/>
                    echo -n 'api-key:api-secret' | base64
                  </code>
                  <p className="text-xs text-slate-500 mt-2">
                    Send the result in the <code className="text-cyan-400">x-api-key</code> header
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <CreditCard className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Payment Steps</h3>
                </div>
                <ol className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">1</span>
                    Create products in Stream Pay
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">2</span>
                    Create a payment link
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">3</span>
                    Redirect customer to checkout
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">4</span>
                    Handle payment result
                  </li>
                </ol>
              </div>
            </div>

            {/* Important Links */}
            <div className="bg-linear-to-r from-cyan-600/20 to-blue-600/20 rounded-2xl p-8 border border-cyan-500/30">
              <h3 className="text-xl font-bold text-white mb-4">Important Links</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <a 
                  href="https://app.streampay.sa/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors"
                >
                  <ExternalLink className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="font-medium text-white">Dashboard</p>
                    <p className="text-xs text-slate-400">Manage account and API keys</p>
                  </div>
                </a>
                <a 
                  href="https://docs.streampay.sa/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors"
                >
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="font-medium text-white">Official Documentation</p>
                    <p className="text-xs text-slate-400">Complete API reference</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'api' && doc && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sticky top-24">
                <h3 className="font-bold text-white mb-4 px-2">Endpoints</h3>
                <div className="space-y-1">
                  {Object.entries(STREAM_PAY_DOCS).map(([key, d]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedEndpoint(key)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedEndpoint === key
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          d.method === 'POST' ? 'bg-blue-500/20 text-blue-400' : 
                          d.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' : 
                          'bg-slate-600 text-slate-400'
                        }`}>
                          {d.method}
                        </span>
                        <span className="truncate text-xs">{key}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content - English API Docs */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm font-bold rounded-lg">
                    {doc.method}
                  </span>
                  <code className="text-lg text-slate-300">{doc.endpoint}</code>
                </div>
                <p className="text-slate-300">{doc.description}</p>
              </div>

              {/* Parameters */}
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-cyan-400" />
                  Parameters
                </h3>
                <div className="space-y-4">
                  {doc.parameters.map((param, idx) => (
                    <div key={idx} className="border-b border-slate-800 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-cyan-400 font-medium">{param.name}</code>
                            {param.required ? (
                              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                                Required
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-slate-700 text-slate-400 text-xs rounded">
                                Optional
                              </span>
                            )}
                          </div>
                          <p className="text-slate-300 text-sm">{param.description}</p>
                        </div>
                        <span className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded">
                          {param.type}
                        </span>
                      </div>
                      <code className="block mt-2 text-sm text-slate-500 bg-slate-950 p-2 rounded border border-slate-800">
                        Example: {param.example}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              {/* Request Example */}
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-cyan-400" />
                  Request Example
                </h3>
                <pre className="bg-slate-950 rounded-xl p-4 text-sm text-slate-300 overflow-x-auto border border-slate-800">
                  <code>{JSON.stringify(doc.requestExample, null, 2)}</code>
                </pre>
              </div>

              {/* Response Example */}
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5 text-emerald-400" />
                  Response Example
                </h3>
                <pre className="bg-slate-950 rounded-xl p-4 text-sm text-slate-300 overflow-x-auto border border-slate-800">
                  <code>{JSON.stringify(doc.responseExample, null, 2)}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'flow' && (
          <div className="space-y-8">
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">
              <h2 className="text-2xl font-bold text-white mb-8">Payment Integration Flow</h2>

              <div className="space-y-8">
                {[
                  {
                    step: 1,
                    title: 'Authentication',
                    desc: 'Send Base64-encoded API key in x-api-key header for every request',
                    icon: Key
                  },
                  {
                    step: 2,
                    title: 'Create Products',
                    desc: 'Create products in Stream Pay via API or dashboard to get UUIDs',
                    icon: Server
                  },
                  {
                    step: 3,
                    title: 'Create Payment Link',
                    desc: 'Use the product UUID to create a payment link with redirect URLs',
                    icon: CreditCard
                  },
                  {
                    step: 4,
                    title: 'Redirect Customer',
                    desc: 'Redirect customer to the payment URL returned in the response',
                    icon: ArrowRight
                  },
                  {
                    step: 5,
                    title: 'Handle Callback',
                    desc: 'On return, verify payment status server-side using invoice_id',
                    icon: Shield
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg">
                        {item.step}
                      </div>
                      {idx < 4 && (
                        <div className="w-0.5 h-24 bg-slate-700 my-2" />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <item.icon className="w-5 h-5 text-slate-400" />
                        <h4 className="text-lg font-bold text-white">{item.title}</h4>
                      </div>
                      <p className="text-slate-300">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Authentication Section */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/20 rounded-xl">
                  <Key className="w-8 h-8 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-amber-400 mb-2">Authentication Method</h3>
                  <p className="text-slate-300 mb-4">
                    All API requests must include the <code className="bg-slate-800 px-2 py-0.5 rounded text-cyan-400">x-api-key</code> header.
                    The value should be a Base64-encoded string of your API key and secret separated by a colon.
                  </p>
                  
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 mb-4">
                    <p className="text-sm text-slate-500 mb-2">Generate auth token:</p>
                    <code className="text-sm text-slate-300 block">
                      echo -n 'your-api-key:your-api-secret' | base64
                    </code>
                  </div>

                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                    <p className="text-sm text-slate-500 mb-2">Use in request headers:</p>
                    <pre className="text-sm text-slate-300">
{`{
  "x-api-key": "your-base64-encoded-token",
  "Content-Type": "application/json"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-400 mb-2">Important Security Note</h3>
                  <p className="text-slate-300">
                    When handling payment results, <strong>do not rely solely on URL parameters</strong>. 
                    Always verify the payment status server-side using the API to confirm the transaction 
                    before taking any action (such as activating a subscription or delivering a product).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
