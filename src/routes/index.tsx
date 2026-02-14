import { createFileRoute, Link } from '@tanstack/react-router'
import { 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Code,
  Sparkles,
  PlayCircle,
  FileCode,
  TestTube,
  Eye,
  Laptop,
  ExternalLink
} from 'lucide-react'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  const features = [
    {
      icon: <Code className="w-8 h-8 text-cyan-400" />,
      title: 'Real API Integration',
      description: 'Live example of Stream Pay integration using real API with best coding practices',
    },
    {
      icon: <TestTube className="w-8 h-8 text-emerald-400" />,
      title: 'Sandbox Testing Environment',
      description: 'Test all payment scenarios in a secure environment without real transactions',
    },
    {
      icon: <Eye className="w-8 h-8 text-purple-400" />,
      title: 'View Source Code',
      description: 'Learn how to integrate by watching the actual code implementation',
    },
    {
      icon: <Shield className="w-8 h-8 text-amber-400" />,
      title: 'Security Standards',
      description: 'Implementing best security standards for handling payment data',
    },
    {
      icon: <PlayCircle className="w-8 h-8 text-blue-400" />,
      title: 'Interactive Experience',
      description: 'Test the full payment process from start to finish',
    },
    {
      icon: <FileCode className="w-8 h-8 text-rose-400" />,
      title: 'Detailed Documentation',
      description: 'Step-by-step explanation of each integration phase',
    },
  ]

  const integrationSteps = [
    {
      step: '01',
      title: 'Explore the Interface',
      description: 'See what the integrated payment page looks like'
    },
    {
      step: '02',
      title: 'Try Sandbox Environment',
      description: 'Use test data to experience the full payment process'
    },
    {
      step: '03',
      title: 'Review Implementation',
      description: 'Learn from the source code and integration approach'
    },
    {
      step: '04',
      title: 'Apply to Your Project',
      description: 'Use what you learned to implement integration in your project'
    }
  ]

  const testScenarios = [
    {
      title: 'Successful Payment',
      description: 'Test the payment completion scenario'
    },
    {
      title: 'Failed Payment',
      description: 'See how errors and failures are handled'
    },
    {
      title: 'Multiple Payment Methods',
      description: 'Try all available payment methods'
    }
  ]

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950" dir="ltr">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 px-6 overflow-hidden">
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-l from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 text-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-medium">Demo Project - Sandbox Environment</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
              Practical Integration for
              <br />
              <span className="bg-linear-to-l from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Stream Pay
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-6 leading-relaxed">
              A complete live example showing how to integrate with <a href="https://streampay.sa" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Stream Pay</a>
            </p>
            
            <p className="text-lg text-cyan-400 max-w-2xl mx-auto mb-12 font-semibold">
              Use the Sandbox testing environment to try all payment scenarios without any risk
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/checkout"
                className="group px-8 py-5 bg-linear-to-l from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300 shadow-2xl shadow-cyan-500/30 flex items-center gap-3 hover:scale-105 transform"
              >
                <PlayCircle className="w-5 h-5" />
                Try Interactive Integration
                <ArrowRight className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
              </Link>
              
              <a
                href="https://streampay.sa"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-bold rounded-xl transition-all duration-300 border border-slate-700 hover:border-cyan-500/50 flex items-center gap-3"
              >
                <ExternalLink className="w-5 h-5" />
                Learn More About Stream Pay
              </a>
            </div>

            {/* Info Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/30 rounded-lg border border-slate-700/50 text-slate-400 text-sm">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>Real API Integration</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/30 rounded-lg border border-slate-700/50 text-slate-400 text-sm">
                <TestTube className="w-4 h-4 text-emerald-400" />
                <span>Secure Sandbox Environment</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/30 rounded-lg border border-slate-700/50 text-slate-400 text-sm">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>No Real Transactions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Try */}
      <section className="relative py-20 px-6 border-y border-slate-800/50 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-6">
              <Laptop className="w-4 h-4" />
              <span>What You Can Try</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Available Test Scenarios
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Try all different payment scenarios in a safe testing environment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testScenarios.map((scenario, index) => (
              <div 
                key={index} 
                className="group p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 text-purple-400 font-bold text-lg">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{scenario.title}</h3>
                <p className="text-slate-400 text-sm">{scenario.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative py-24 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Project Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why This Project?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A complete practical example demonstrating how to integrate with Stream Pay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:bg-slate-800/50 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How to Benefit from This Project?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Simple steps to experience and understand the integration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {integrationSteps.map((item, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className="p-8 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:border-cyan-500/30 transition-all duration-300 h-full">
                  <div className="text-6xl font-bold text-cyan-500/20 mb-4 group-hover:text-cyan-500/30 transition-colors">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {index < integrationSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -left-3 w-6 h-0.5 bg-linear-to-l from-cyan-500/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="relative py-20 px-6 border-y border-slate-800/50 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 md:p-12 rounded-3xl bg-slate-800/30 border border-amber-500/30 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 to-orange-500/5" />
            
            <div className="relative">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Important Notice
                  </h3>
                  <div className="space-y-3 text-slate-300">
                    <p className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>This is a demo project for educational and training purposes on Stream Pay integration</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>All transactions occur in the secure Sandbox environment with no real payments processed</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Use the provided test data to experience all scenarios</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Source code is available for review and learning best practices</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Try the Integration?
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Test the interactive integration model and see how Stream Pay works in a secure environment
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/checkout"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-linear-to-l from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-lg font-bold rounded-xl transition-all duration-300 shadow-2xl shadow-cyan-500/30 hover:scale-105 transform"
            >
              <PlayCircle className="w-6 h-6" />
              Start Now
              <ArrowRight className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
            </Link>

            <a
              href="https://streampay.sa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-bold rounded-xl transition-all duration-300 border border-slate-700 hover:border-cyan-500/50"
            >
              Visit Stream Pay
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>

          <p className="text-slate-500 text-sm mt-6 flex items-center justify-center gap-2">
            <TestTube className="w-4 h-4" />
            Sandbox Environment - No Real Payments - 100% Secure
          </p>
        </div>
      </section>
    </div>
  )
}
