import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useStore, UserRole } from '../../store/useStore';
import { ShieldCheck, Heart, Building, ShieldAlert, Key, Mail, ArrowRight, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setRole, setActiveNgoId } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      let role: UserRole = 'donor';
      const cleanEmail = email.trim().toLowerCase();
      
      // Check if email matches any registered NGO in the store
      const registeredNgos = useStore.getState().ngos;
      const matchedNgo = registeredNgos.find(n => n.email?.toLowerCase() === cleanEmail);

      if (cleanEmail === 'admin@imparency.org' || cleanEmail.includes('admin')) {
        role = 'admin';
      } else if (matchedNgo || cleanEmail === 'ngo@imparency.org' || cleanEmail.includes('ngo') || cleanEmail.includes('partner') || cleanEmail.includes('foundation') || cleanEmail.includes('trust')) {
        role = 'ngo';
        if (matchedNgo) {
          setActiveNgoId(matchedNgo.id);
        } else {
          setActiveNgoId('ngo-2'); // Default to Vidyoday Foundation
        }
      } else {
        role = 'donor';
      }

      setRole(role);
      setIsLoading(false);
      
      if (role === 'donor') {
        navigate('/donor');
      } else if (role === 'ngo') {
        navigate('/ngo');
      } else if (role === 'admin') {
        navigate('/admin');
      }
    }, 1000);
  };

  const handleQuickLogin = (role: UserRole) => {
    setIsLoading(true);
    setShowDemoModal(false);
    setTimeout(() => {
      setRole(role);
      if (role === 'ngo') {
        setActiveNgoId('ngo-2');
      }
      setIsLoading(false);
      if (role === 'donor') navigate('/donor');
      else if (role === 'ngo') navigate('/ngo');
      else if (role === 'admin') navigate('/admin');
    }, 800);
  };

  const demoAccounts = [
    {
      role: 'donor' as UserRole,
      title: 'Demo Donor Account',
      email: 'donor@imparency.org',
      desc: 'Trace personal donations, review taxes, track ledger updates.',
      icon: Heart,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    {
      role: 'ngo' as UserRole,
      title: 'Demo NGO Account',
      email: 'ngo@imparency.org',
      desc: 'Launch fundraising, upload receipts, log updates, view growth.',
      icon: Building,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100'
    },
    {
      role: 'admin' as UserRole,
      title: 'Demo Admin Account',
      email: 'admin@imparency.org',
      desc: 'Recalculate trust ratings, approve compliance docs, check logs.',
      icon: ShieldAlert,
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    }
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-16 min-h-[85vh] flex flex-col justify-center font-sans">
      
      <div className="bg-white p-8 rounded-3xl border border-slate-200/50 shadow-premium space-y-6 text-left">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="font-display font-extrabold text-xl text-slate-900 mt-3">Sign In to Imparency</h2>
          <p className="text-xs text-slate-400">Welcome back! Access your transparency workspace.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@organization.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:border-slate-900 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                <button
                  type="button"
                  onClick={() => alert("Simulation: In a production environment, this triggers an OTP/email reset link.")}
                  className="text-[10px] font-bold text-indigo-650 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:border-slate-900 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-slate-950 hover:bg-slate-800 disabled:bg-slate-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 flex flex-col items-center gap-3">
          <p className="text-xs text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link to="/get-started" className="text-emerald-650 hover:underline font-bold">
              Get Started
            </Link>
          </p>

          <button
            type="button"
            onClick={() => setShowDemoModal(true)}
            className="text-[10px] font-bold text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-wider flex items-center gap-1 mt-1 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50"
          >
            <Sparkles className="h-3 w-3 text-amber-500 fill-current animate-pulse" />
            Reviewer Demo Access
          </button>
        </div>

      </div>

      {/* Demo Credentials Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 text-slate-100 rounded-3xl w-full max-w-md overflow-hidden border border-slate-800 shadow-2xl"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                <div className="text-left">
                  <h3 className="font-display font-extrabold text-sm text-white flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-400 fill-current" />
                    Demo Sandboxes
                  </h3>
                  <p className="text-[9px] text-slate-500">Quick sign-in credentials for evaluation</p>
                </div>
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-3.5 text-left">
                {demoAccounts.map((acc) => {
                  const Icon = acc.icon;
                  return (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handleQuickLogin(acc.role)}
                      className="w-full p-4 bg-slate-950/80 hover:bg-slate-950 border border-slate-850 hover:border-slate-700/80 rounded-2xl flex gap-3 text-left transition-all group"
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${acc.color} flex items-center justify-center h-fit mt-0.5`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {acc.title}
                          </h4>
                          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest group-hover:text-slate-450">
                            {acc.role}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-450 leading-relaxed">
                          {acc.desc}
                        </p>
                        <span className="block text-[9px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded w-fit border border-slate-850">
                          {acc.email}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-850 bg-slate-950/40 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowDemoModal(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white text-xs font-bold rounded-xl border border-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
