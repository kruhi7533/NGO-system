import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore, UserRole } from '../../store/useStore';
import { ShieldCheck, Heart, User, Building, ShieldAlert, Key } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setRole } = useStore();

  const defaultRole = (searchParams.get('role') as UserRole) || 'donor';

  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      setRole(selectedRole);
      setIsLoading(false);
      
      if (selectedRole === 'donor') {
        navigate('/donor');
      } else if (selectedRole === 'ngo') {
        navigate('/ngo');
      } else if (selectedRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }, 1200);
  };

  const roleConfigs = [
    {
      role: 'donor' as UserRole,
      title: 'Donor Account',
      desc: 'Track impact, check receipts, tax exemption portfolios.',
      icon: Heart,
      color: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/10'
    },
    {
      role: 'ngo' as UserRole,
      title: 'NGO Partner',
      desc: 'Manage campaigns, publish updates, upload audit bills.',
      icon: Building,
      color: 'border-indigo-200 hover:border-indigo-400 bg-indigo-50/10'
    },
    {
      role: 'admin' as UserRole,
      title: 'Platform Auditor',
      desc: 'Audit uploaded certificates, approve targets, moderate dispute tickets.',
      icon: ShieldAlert,
      color: 'border-amber-200 hover:border-amber-400 bg-amber-50/10'
    }
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-16 min-h-[80vh] flex flex-col justify-center">
      
      <div className="bg-white p-8 rounded-3xl border border-slate-200/50 shadow-premium space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="font-display font-extrabold text-xl text-slate-900">Sign In to Imparency</h2>
          <p className="text-xs text-slate-400">Select your workspace role to begin testing.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Role selector boxes */}
          <div className="space-y-2">
            <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">Select Workspace Role</span>
            <div className="grid grid-cols-1 gap-2.5">
              {roleConfigs.map((cfg) => {
                const Icon = cfg.icon;
                const isSelected = selectedRole === cfg.role;
                return (
                  <button
                    key={cfg.role}
                    type="button"
                    onClick={() => setSelectedRole(cfg.role)}
                    className={`p-3.5 rounded-2xl border text-left flex gap-3 transition-all ${
                      isSelected 
                        ? 'border-slate-900 bg-slate-50 shadow-sm ring-1 ring-slate-900' 
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${
                      isSelected 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-50 text-slate-400 border border-slate-200/20'
                    }`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{cfg.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{cfg.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-slate-100 my-4" />

          {/* Credentials Inputs */}
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
              />
            </div>

            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-600 text-white text-xs font-bold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Redirecting to Workspace...
              </>
            ) : (
              <>Sign In</>
            )}
          </button>

        </form>

      </div>

    </div>
  );
}
