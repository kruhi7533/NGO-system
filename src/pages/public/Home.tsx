import React, { useState } from 'react';
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
  ArrowUpRight,
  Globe,
  FileText,
  Clock,
  Eye,
  CheckCircle,
  Activity,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { ngos, campaigns } = useStore();

  const featuredNgos = ngos.slice(0, 3);
  const trendingCampaigns = campaigns.filter(c => c.active).slice(0, 3);

  // States for interactive donation journey preview
  const [activeStep, setActiveStep] = useState(2); // default step: Proof Uploaded

  const journeySteps = [
    { title: 'Donation Received', desc: 'Secure payment is registered on our audit ledger instantly.', time: '0s' },
    { title: 'Funds Allocated', desc: 'Donation is pooled with others and assigned to purchasing ledgers.', time: '12h' },
    { title: 'Resources Purchased', desc: 'NGO procures resources. Vendor bills and GST invoices are uploaded.', time: '3d' },
    { title: 'AI Audited', desc: 'Assistant checks invoice checksums and matches geo-telemetry.', time: '4d' },
    { title: 'Impact Delivered', desc: 'Resources arrive at the site. Impact metrics and photos are logged.', time: '7d' },
  ];

  const stats = [
    { label: 'Total Funds Tracked', value: '₹4.82 Cr', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50 border-emerald-100/60' },
    { label: 'Verified Beneficiaries', value: '3,14,000+', icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-100/60' },
    { label: 'Transparency Score', value: '99.8%', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-100/60' },
    { label: 'Growth Index', value: '+24% MoM', icon: Activity, color: 'text-amber-600 bg-amber-50 border-amber-100/60' },
  ];

  // Selected invoice in Sandbox
  const [showSandboxInvoice, setShowSandboxInvoice] = useState(false);

  return (
    <div className="bg-gradient-mesh min-h-screen pb-16 font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {/* Trust Sparkle Pill */}
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/50 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 shadow-sm mx-auto">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Verified NGO Trust & Growth Infrastructure
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-3xl mx-auto">
            Discover Trusted NGOs. <br />
            <span className="text-gradient-primary">Track Every Donation.</span> See Real Impact.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Follow verified NGOs, support meaningful causes, and track how every rupee transforms lives through our interactive tracking registry.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
            <Link
              to="/explore"
              className="w-full sm:w-auto px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 hover:gap-3 group"
            >
              Explore NGOs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/get-started"
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </Link>
          </div>

          <div className="pt-3">
            <Link
              to="/register-ngo"
              className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1 group"
            >
              Are you an NGO? Apply for Verification
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 2. Impact Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/50 shadow-premium hover:shadow-premium-hover transition-all"
              >
                <div className={`p-1.5 w-fit rounded-lg border ${stat.color} mb-2`}>
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-xl font-bold font-display text-slate-900">{stat.value}</h3>
                <p className="text-[10px] text-slate-500 font-semibold">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. Interactive Donation Journey Timelines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-250/60 shadow-premium space-y-6 text-center">
          <div className="space-y-1 max-w-xl mx-auto">
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-150 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
              Interactive Stepper
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
              The Donation Lifecycle
            </h2>
            <p className="text-xs text-slate-500">
              Hover or click the steps below to see how Imparency traces funds from your checkout to real-world social impact.
            </p>
          </div>

          {/* Stepper Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-4">
            {journeySteps.map((step, idx) => (
              <button
                key={step.title}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
                  activeStep === idx
                    ? 'border-indigo-500 bg-indigo-50/20 shadow-glow-secondary'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className={`text-[10px] font-mono font-bold ${activeStep === idx ? 'text-indigo-600' : 'text-slate-400'}`}>
                    STEP 0{idx + 1}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400">{step.time}</span>
                </div>
                <div className="mt-4">
                  <h4 className={`text-xs font-bold ${activeStep === idx ? 'text-indigo-900' : 'text-slate-800'}`}>
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-normal mt-1 font-medium">
                    {step.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Mini Tracker Sandbox (Core USP Showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-slate-900 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Promo text */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Sparkles className="h-4.5 w-4.5 fill-current" />
                Zero leakage auditing
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
                Trace donations like Amazon parcels.
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click **Inspect Invoice** on our live simulation sandbox widget to audit receipts, matching serials, and AI verify stamps.
              </p>
              <div className="pt-2">
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                >
                  Explore verified campaigns
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Simulated Tracking Widget Box */}
            <div className="lg:col-span-7 bg-white/[0.03] border border-white/[0.07] p-5 rounded-2xl space-y-4 text-left">
              <div className="flex justify-between items-start border-b border-white/[0.06] pb-3 text-xs">
                <div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase block">Simulation Ledger Sandbox</span>
                  <span className="font-semibold text-slate-350 block mt-0.5">Vidyoday Digital Classrooms</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-500 font-bold uppercase block">Tracking ID</span>
                  <span className="font-mono text-emerald-400 font-semibold block mt-0.5">IMP-99801</span>
                </div>
              </div>

              {/* Stepper progress representation */}
              <div className="relative border-l border-white/[0.1] ml-3 pl-6 space-y-4 text-xs">
                
                {/* Node 1 */}
                <div className="relative">
                  <span className="absolute -left-[30px] top-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                    <CheckCircle className="h-2 w-2 text-white fill-current" />
                  </span>
                  <div className="text-left">
                    <h4 className="font-bold text-slate-200">Donation Pool Received</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">₹5,000 processed & tagged on 2026-06-05.</p>
                  </div>
                </div>

                {/* Node 2 */}
                <div className="relative">
                  <span className="absolute -left-[30px] top-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                    <CheckCircle className="h-2 w-2 text-white fill-current" />
                  </span>
                  <div className="text-left">
                    <h4 className="font-bold text-slate-200">Purchase Order Released</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Allocated to hardware distributors on 2026-06-06.</p>
                  </div>
                </div>

                {/* Node 3 */}
                <div className="relative">
                  <span className="absolute -left-[30px] top-0.5 h-3.5 w-3.5 rounded-full bg-indigo-500 border-2 border-slate-950 flex items-center justify-center animate-pulse" />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="text-left">
                      <h4 className="font-bold text-indigo-400">Invoice uploaded & audited</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">PO-2026-049_Vidyoday.pdf added.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowSandboxInvoice(true)}
                      className="px-2.5 py-1 bg-white/[0.08] hover:bg-white/[0.15] text-[10px] font-bold text-slate-300 rounded border border-white/[0.1] flex items-center gap-1 transition-all"
                    >
                      <Eye className="h-3 w-3" />
                      Inspect Invoice
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. Featured NGOs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-2">
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 tracking-tight">
              Featured Trustworthy NGOs
            </h2>
            <p className="text-xs text-slate-500">
              Verified organizations with consistent proof uploading track records.
            </p>
          </div>
          <Link
            to="/explore"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 group"
          >
            Explore leaderboards
            <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredNgos.map((ngo) => (
            <div 
              key={ngo.id}
              className="bg-white rounded-3xl border border-slate-200/50 overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col group justify-between"
            >
              <div>
                <div className="h-32 overflow-hidden relative">
                  <img src={ngo.banner} alt={ngo.name} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded border border-slate-200/40 flex items-center gap-1 shadow-sm">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Trust Index</span>
                    <span className="text-xs font-extrabold text-emerald-600">{ngo.trustScore}%</span>
                  </div>
                </div>

                <div className="p-5 space-y-2.5 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-full capitalize">
                      {ngo.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{ngo.location.split(',')[0]}</span>
                  </div>
                  <h3 className="font-display font-bold text-slate-900 text-base group-hover:text-emerald-600 transition-colors">
                    {ngo.name}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                    {ngo.tagline}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 mt-2 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                <div className="flex gap-3">
                  <span>{ngo.followersCount} Followers</span>
                  <span>{ngo.projectsCompleted} Projects</span>
                </div>
                <Link
                  to={`/ngo/${ngo.id}`}
                  className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-0.5 group"
                >
                  View Profile
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Active Campaigns */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 text-left">
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 tracking-tight">
            Urgent Campaigns
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Back these active initiatives and trace the deliverables cycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingCampaigns.map((camp) => {
            const pct = Math.round((camp.raisedAmount / camp.targetAmount) * 100);
            return (
              <div 
                key={camp.id}
                className="bg-white rounded-3xl border border-slate-200/50 overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col group justify-between"
              >
                <div>
                  <div className="h-36 overflow-hidden relative">
                    <img src={camp.banner} alt={camp.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold">
                      {camp.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-3.5 text-left">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block mb-0.5 uppercase">NGO: {camp.ngoName}</span>
                      <h3 className="font-display font-bold text-slate-950 text-sm sm:text-base leading-snug group-hover:text-emerald-600 transition-colors">
                        {camp.title}
                      </h3>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800">₹{camp.raisedAmount.toLocaleString()} <span className="text-slate-400 font-medium">raised</span></span>
                        <span className="text-slate-600">{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2">
                  <Link 
                    to={`/campaign/${camp.id}`}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1"
                  >
                    Back Campaign
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sandbox Invoice Modal */}
      <AnimatePresence>
        {showSandboxInvoice && (
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
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
                    Ledger Document Audit
                  </h3>
                  <p className="text-[9px] text-slate-500">Asset Verification Checksum PASSED</p>
                </div>
                <button
                  onClick={() => setShowSandboxInvoice(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 text-left text-xs">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-8 w-8 text-emerald-500 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-white">PO-2026-049_Vidyoday.pdf</h4>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">Size: 342 KB</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-900 px-2 py-0.5 rounded">GST Approved</span>
                </div>

                <div className="space-y-2.5">
                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider">AI Scanned Metadata</span>
                  
                  <div className="bg-slate-950 p-4 rounded-2xl space-y-2 border border-slate-850 font-mono text-[10px] text-slate-400">
                    <div className="flex justify-between">
                      <span>Vendor GSTIN:</span>
                      <span className="text-white">27AADCV9928K1ZX</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Invoice Amount:</span>
                      <span className="text-white">₹3,42,800.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Items Matched:</span>
                      <span className="text-white">20x Routers, 5x Servers</span>
                    </div>
                    <div className="flex justify-between">
                      <span>School Tag ID:</span>
                      <span className="text-white">SCH-AMBEGAON-45</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-violet-950/20 border border-violet-900/30 rounded-xl text-violet-400 text-[10px] flex gap-2 leading-relaxed">
                  <Sparkles className="h-4.5 w-4.5 shrink-0 fill-current text-violet-500" />
                  <p>AI verified: Scanned serial numbers match registry inventory list. Coordinate geotags correspond to school lab layouts.</p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-850 bg-slate-950/40 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowSandboxInvoice(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-slate-300 text-xs font-bold rounded-xl border border-slate-800"
                >
                  Close Audit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
