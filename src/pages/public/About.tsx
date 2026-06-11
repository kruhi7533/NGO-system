import React from 'react';
import { ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 min-h-screen space-y-12">
      
      {/* Introduction */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-3 py-1 rounded-full uppercase tracking-wider">
          Our Philosophy
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
          Transparency First.
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          We believe that charity should not be a black box. Imparency was founded to bridge the trust gap between generous contributors and the organizations driving social change.
        </p>
      </div>

      <hr className="border-slate-200" />

      {/* Grid: The Problem & The Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        
        {/* The Problem */}
        <div className="p-6 bg-amber-50/50 border border-amber-100 rounded-3xl space-y-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            !
          </div>
          <h3 className="font-display font-bold text-slate-900 text-base">The Trust Deficit</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Most donors lose trust because they never discover where their money went, how it was spent, or what specific outcomes it produced. Meanwhile, outstanding local NGOs struggle to get visibility and scale their campaigns because they lack proper marketing and proof-sharing infrastructure.
          </p>
        </div>

        {/* The Solution */}
        <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-3xl space-y-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-display font-bold text-slate-900 text-base">The Traceable Pipeline</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Imparency acts as a verification system. Every single contribution creates a tracked package. NGOs upload itemized bills and geolocation photographs which are audited by AI agents and platform review committees. Donors watch their funds move from receipt to physical impact in real-time.
          </p>
        </div>

      </div>

      {/* Core Values */}
      <div className="space-y-6 pt-6">
        <h2 className="text-center font-display font-extrabold text-xl sm:text-2xl text-slate-900">
          Our Guiding Principles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { 
              title: 'Verifiable Proof', 
              desc: 'Every milestone requires tangible proof—receipts, photos, and compliance audits—accessible to everyone.', 
              icon: Award, 
              color: 'text-emerald-600 bg-emerald-50' 
            },
            { 
              title: 'Empowerment Focus', 
              desc: 'We focus on human-centric stories. Impact is measured in lives improved, children educated, and trees grown.', 
              icon: Heart, 
              color: 'text-indigo-600 bg-indigo-50' 
            },
            { 
              title: 'AI Audited Ledgers', 
              desc: 'Automated document processing parses invoices to match ledger statements and detect abnormalities.', 
              icon: Sparkles, 
              color: 'text-violet-600 bg-violet-50' 
            },
          ].map((val) => {
            const Icon = val.icon;
            return (
              <div key={val.title} className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-premium space-y-3">
                <div className={`p-2 w-fit rounded-xl ${val.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">{val.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
