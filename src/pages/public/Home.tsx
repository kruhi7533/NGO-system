import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  DollarSign, 
  Users, 
  Heart, 
  TrendingUp, 
  Layers,
  ArrowUpRight,
  BookmarkCheck,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { ngos, campaigns, feedPosts } = useStore();

  // Pick top verified NGOs and active campaigns
  const featuredNgos = ngos.slice(0, 3);
  const trendingCampaigns = campaigns.filter(c => c.active).slice(0, 3);
  const successStory = feedPosts.find(p => p.type === 'story') || feedPosts[0];

  const stats = [
    { label: 'Total Funds Tracked', value: '₹4.82 Crores', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Verified Beneficiaries', value: '3,14,000+', icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { label: 'Transparency Index', value: '99.8%', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Registered NGOs', value: '142 Active', icon: Globe, color: 'text-amber-600 bg-amber-50 border-amber-100' },
  ];

  return (
    <div className="bg-gradient-mesh min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Trust Sparkle Pill */}
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/50 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Zero-Leakage Donation Registry
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Discover Trusted NGOs. <br />
            <span className="text-gradient-primary">Track Every Donation.</span> <br />
            See Real Impact.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Follow verified NGOs, support meaningful campaigns, and track exactly how your contributions transform lives through our interactive tracking system.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              to="/explore"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 hover:gap-3 group"
            >
              Explore NGOs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login?role=ngo"
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              Register NGO
              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 2. Impact Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/50 shadow-premium hover:shadow-premium-hover transition-all duration-300"
              >
                <div className={`p-2 w-fit rounded-xl border ${stat.color} mb-3.5`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-bold font-display text-slate-900">{stat.value}</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. Transparency Workflow (Package Tracking Animation Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-slate-800 shadow-2xl">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />

          <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2 space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 fill-current" />
                Radical Audit Trail
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">
                Track your donation like a parcel.
              </h2>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                We believe you shouldn't have to guess. From the moment you swipe your card to the minute the resource reaches the beneficiary, follow the journey with invoices, tags, and verified receipts.
              </p>
            </div>

            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { step: '01', title: 'Fund Allocation', desc: 'Your donation is pooled and mapped to purchase orders instantly.' },
                { step: '02', title: 'Asset Upload', desc: 'NGO uploads itemized bills, tax invoices, and shipping tags.' },
                { step: '03', title: 'CMO & AI Verification', desc: 'Platform audits documents and cross-checks delivery geo-coordinates.' },
              ].map((item, idx) => (
                <div key={item.step} className="bg-white/[0.03] border border-white/[0.06] p-6 rounded-2xl flex flex-col justify-between h-48 hover:bg-white/[0.05] transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">STEP {item.step}</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured NGOs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
              Featured Verified NGOs
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Top-rated organizations demonstrating consistent transparency and impact deliverables.
            </p>
          </div>
          <Link
            to="/explore"
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            Explore all NGOs
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredNgos.map((ngo) => (
            <div 
              key={ngo.id}
              className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col group"
            >
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={ngo.banner} 
                  alt={ngo.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-200/50 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-800">Trust Score</span>
                  <span className="text-xs font-bold text-emerald-600">{ngo.trustScore}%</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-full capitalize">
                      {ngo.category}
                    </span>
                    <span className="text-xs text-slate-400">{ngo.location}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {ngo.name}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                    {ngo.tagline}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-left">
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase leading-none">Reached</span>
                    <span className="text-xs font-bold text-slate-800 mt-1 block">
                      {ngo.beneficiariesReached.toLocaleString()} People
                    </span>
                  </div>

                  <Link 
                    to={`/ngo/${ngo.id}`} 
                    className="px-4 py-2 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/60 hover:border-emerald-200/50 transition-all"
                  >
                    View Audit Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Trending Causes (Campaigns) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Urgent Transparency Campaigns
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Back these active initiatives and witness your funds transform into tangible resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingCampaigns.map((camp) => {
            const pct = Math.round((camp.raisedAmount / camp.targetAmount) * 100);
            return (
              <div 
                key={camp.id}
                className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col group justify-between"
              >
                <div>
                  <div className="h-44 overflow-hidden relative">
                    <img 
                      src={camp.banner} 
                      alt={camp.title} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg text-[9px] uppercase tracking-wider font-bold">
                      {camp.category}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block mb-1 uppercase tracking-tight">Campaign by {camp.ngoName}</span>
                      <h3 className="font-display font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-600 transition-colors">
                        {camp.title}
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed mt-2 line-clamp-3">
                        {camp.description}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800">₹{camp.raisedAmount.toLocaleString()} <span className="text-slate-400 font-medium">raised</span></span>
                        <span className="text-slate-600">{pct}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-primary rounded-full transition-all duration-500" 
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                        <span>Target: ₹{camp.targetAmount.toLocaleString()}</span>
                        <span>{camp.beneficiariesCount} Beneficiaries</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <Link 
                    to={`/campaign/${camp.id}`}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    Inspect & Back Campaign
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Success Spotlight (Story Feed highlight) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-emerald-50/50 rounded-3xl border border-emerald-100 p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg uppercase tracking-wider inline-block">
                Success Spotlight
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                {successStory.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {successStory.content}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 overflow-hidden shrink-0">
                  <img src={successStory.ngoLogo} alt="NGO" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{successStory.ngoName}</h4>
                  <p className="text-[10px] text-slate-400">Verified Organization Profile</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl overflow-hidden shadow-lg border border-white/80 h-72">
              <img 
                src={successStory.image || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600"} 
                alt="Success Spotlight" 
                className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
