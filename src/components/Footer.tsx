import { GitBranch, Code, TestTube, Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-slate-800/50 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <GitBranch className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Stream Pay Integration</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-md">
              A practical example demonstrating how to integrate with Stream Pay using a secure Sandbox environment
            </p>
            <div className="flex items-center gap-3">
            </div>                
                      </div>

          <div>
            <h4 className="text-white font-bold mb-4">Information</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>Demo Project</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <TestTube className="w-4 h-4 text-emerald-400" />
                <span>Sandbox Environment</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>For Educational Purposes</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © 2025 - Sandbox Demo
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/30 rounded-full border border-slate-700/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-400 text-xs">Secure Testing Environment</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
