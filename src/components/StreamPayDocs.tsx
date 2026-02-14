import { useState } from 'react';
import { STREAM_PAY_DOCS } from '@/config/streampay-docs';
import { BookOpen, X, Code, Globe, Server, Key, FileJson, ArrowRight, Shield, CreditCard, ExternalLink, Layers } from 'lucide-react';

export function StreamPayDocsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'flow' | 'api'>('flow');
  const [selectedEndpoint, setSelectedEndpoint] = useState<keyof typeof STREAM_PAY_DOCS>('createPaymentLink');

  const doc = STREAM_PAY_DOCS[selectedEndpoint];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
      >
        <BookOpen className="w-5 h-5" />
        <span className="font-medium">Documentation</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-[600px] max-h-[80vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300" dir="ltr">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <BookOpen className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Stream Pay Guide</h3>
            <p className="text-xs text-slate-400">Integration documentation</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex border-b border-slate-700">
        <button
          onClick={() => setActiveTab('flow')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'flow' ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Globe className="w-4 h-4" />
          Integration Flow
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'api' ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Code className="w-4 h-4" />
          API Reference
        </button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-[60vh]">
        {activeTab === 'flow' ? (
          <div className="p-4">
            <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Payment Gateway Integration Steps
            </h4>
            
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: 'Authentication',
                  desc: 'Send Base64-encoded API key in x-api-key header with every request',
                  icon: Key
                },
                {
                  step: 2,
                  title: 'Create Products',
                  desc: 'Create products in Stream Pay to get UUID identifiers',
                  icon: Server
                },
                {
                  step: 3,
                  title: 'Create Payment Link',
                  desc: 'Create a payment link using product ID and redirect URLs',
                  icon: CreditCard
                },
                {
                  step: 4,
                  title: 'Redirect Customer',
                  desc: 'Redirect customer to payment URL to complete purchase',
                  icon: ArrowRight
                },
                {
                  step: 5,
                  title: 'Handle Callback',
                  desc: 'Verify payment status when returning from payment gateway',
                  icon: Shield
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                    {idx < 4 && <div className="w-0.5 h-full bg-slate-700 my-1" />}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <item.icon className="w-4 h-4 text-slate-400" />
                      <h5 className="font-bold text-slate-200 text-sm">{item.title}</h5>
                    </div>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Authentication Note */}
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <Key className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <h5 className="font-bold text-amber-400 text-sm">Authentication Method</h5>
                  <p className="text-sm text-slate-300 mt-1">
                    Send header <code className="bg-slate-800 px-1 rounded">x-api-key</code> with every request.
                    Value is Base64 encoded API key and secret.
                  </p>
                  <code className="block mt-2 text-xs bg-slate-950 p-2 rounded text-slate-400">
                    echo -n 'api-key:api-secret' | base64
                  </code>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            {/* Endpoint Selector */}
            <div className="mb-4">
              <h4 className="text-sm font-bold text-slate-300 mb-2">Select Endpoint:</h4>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(STREAM_PAY_DOCS).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedEndpoint(key as keyof typeof STREAM_PAY_DOCS)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      selectedEndpoint === key 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            {/* API Documentation */}
            {doc && (
              <div className="space-y-4">
                {/* Endpoint Header */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm font-bold rounded-lg">
                      {doc.method}
                    </span>
                    <code className="text-slate-300 text-sm">{doc.endpoint}</code>
                  </div>
                  <p className="text-slate-400 text-sm">{doc.description}</p>
                </div>

                {/* Parameters */}
                <div>
                  <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-cyan-400" />
                    Parameters
                  </h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {doc.parameters.map((param, idx) => (
                      <div key={idx} className="bg-slate-800/30 rounded-lg p-2 text-xs border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-cyan-400">{param.name}</code>
                          <span className={`px-1.5 py-0.5 rounded ${param.required ? 'bg-red-500/20 text-red-400' : 'bg-slate-600 text-slate-400'}`}>
                            {param.required ? 'Required' : 'Optional'}
                          </span>
                          <span className="text-slate-500">{param.type}</span>
                        </div>
                        <p className="text-slate-400">{param.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Request Example */}
                <div>
                  <h4 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                    <Code className="w-4 h-4 text-cyan-400" />
                    Request Example
                  </h4>
                  <pre className="bg-slate-950 rounded-lg p-3 text-xs text-slate-300 overflow-x-auto border border-slate-800 max-h-[150px] overflow-y-auto">
                    <code>{JSON.stringify(doc.requestExample, null, 2)}</code>
                  </pre>
                </div>

                {/* Response Example */}
                <div>
                  <h4 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-400" />
                    Response Example
                  </h4>
                  <pre className="bg-slate-950 rounded-lg p-3 text-xs text-slate-300 overflow-x-auto border border-slate-800 max-h-[150px] overflow-y-auto">
                    <code>{JSON.stringify(doc.responseExample, null, 2)}</code>
                  </pre>
                </div>

                {/* External Link */}
                <a 
                  href="https://docs.streampay.sa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Full Documentation
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
