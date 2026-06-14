import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Building, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GetStarted() {
  const navigate = useNavigate();

  const options = [
    {
      type: 'donor',
      title: 'Donor',
      description: 'Discover trusted NGOs, track donations, and measure impact.',
      cta: 'Create Donor Account',
      icon: Heart,
      color: 'from-emerald-500 to-teal-600 shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:border-emerald-500/30',
      badge: 'For Supporters',
      path: '/login' // Redirects to Sign In page
    },
    {
      type: 'ngo',
      title: 'NGO',
      description: 'Build trust, attract supporters, launch campaigns, and showcase impact.',
      cta: 'Register NGO',
      icon: Building,
      color: 'from-indigo-500 to-violet-600 shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:border-indigo-500/30',
      badge: 'For Non-Profits',
      path: '/register-ngo' // Dedicated onboarding route
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 min-h-[80vh] flex flex-col justify-center font-sans text-left">
      <div className="space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1 bg-slate-900 text-slate-100 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-slate-800">
            <Sparkles className="h-3 w-3 text-amber-400 fill-current animate-pulse" />
            Get Started
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
            Join the Transparency Movement
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">
            Choose how you'd like to use Imparency.
          </p>
        </div>

        {/* Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {options.map((opt) => {
            const Icon = opt.icon;
            return (
              <motion.div
                key={opt.type}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className={`bg-white rounded-3xl p-8 border border-slate-200/60 shadow-premium flex flex-col justify-between h-[320px] relative overflow-hidden group hover:border-slate-350 duration-300`}
              >
                {/* Background ambient glow on card hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-full blur-[40px] group-hover:scale-110 duration-500" />
                
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                      {opt.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${opt.color} text-white flex items-center justify-center shadow-lg`}>
                      <Icon className="h-5 w-5 fill-current/10" />
                    </div>
                    <h3 className="font-display font-extrabold text-slate-900 text-lg sm:text-xl">
                      {opt.title}
                    </h3>
                    <p className="text-xs text-slate-550 leading-relaxed font-medium">
                      {opt.description}
                    </p>
                  </div>
                </div>

                <Link
                  to={opt.path}
                  className={`w-full py-3 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 group/btn`}
                >
                  {opt.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                </Link>

              </motion.div>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-xs text-slate-450 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-slate-900 hover:underline font-bold">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
