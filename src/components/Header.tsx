import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Home, Menu, X, CreditCard, Shield } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-6 py-4 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-slate-400 hover:text-white transition-colors"
              activeProps={{ className: 'text-cyan-400' }}
            >
              Home
            </Link>
            <Link 
              to="/checkout" 
              className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-l from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-cyan-500/20"
            >
              <CreditCard className="w-4 h-4" />
              Checkout
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} className="text-white" />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-slate-950 border-l border-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Menu</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-800/50 transition-colors text-slate-300 hover:text-white"
            activeProps={{
              className: 'flex items-center gap-3 p-4 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          <Link
            to="/checkout"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-800/50 transition-colors text-slate-300 hover:text-white"
            activeProps={{
              className: 'flex items-center gap-3 p-4 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
            }}
          >
            <CreditCard size={20} />
            <span className="font-medium">Checkout</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <p className="text-sm text-slate-500 text-center">© 2025 Stream Pay Integration</p>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
