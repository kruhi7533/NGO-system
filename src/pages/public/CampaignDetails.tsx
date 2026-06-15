import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { 
  ShieldCheck, 
  ArrowLeft,
  Sparkles,
  Info,
  CreditCard,
  User,
  Mail,
  Heart,
  CheckCircle,
  FileText,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function CampaignDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { campaigns, donate, setRole } = useStore();

  const campaign = useMemo(() => campaigns.find(c => c.id === id), [campaigns, id]);

  const [donationAmount, setDonationAmount] = useState<number>(2500);
  const [showCheckout, setShowCheckout] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPan, setDonorPan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!campaign) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Campaign Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The campaign you are looking for does not exist.</p>
        <Link to="/" className="text-emerald-600 font-bold text-xs mt-4 inline-block">Back Home</Link>
      </div>
    );
  }

  const pct = Math.round((campaign.raisedAmount / campaign.targetAmount) * 100);

  const computedImpact = useMemo(() => {
    const amt = donationAmount;
    if (campaign.category === 'Education') {
      const children = Math.floor(amt / 500);
      return `₹${amt.toLocaleString()} can provide digital learning vouchers and primary class textbooks for ${children} girls.`;
    }
    if (campaign.category === 'Healthcare') {
      const children = Math.floor(amt / 500);
      return `₹${amt.toLocaleString()} can sponsor complete pediatrician diagnosis and essential medical camp diagnostics for ${children} children.`;
    }
    if (campaign.category === 'Environment') {
      const saplings = Math.floor(amt / 166);
      return `₹${amt.toLocaleString()} will buy, plant, and enrich the soil beds for ${saplings} Miyawaki indigenous trees in urban forest plots.`;
    }
    const strayRescue = Math.floor(amt / 1000);
    return `₹${amt.toLocaleString()} covers vaccination, rabies shelter care, and veterinary surgery for ${strayRescue} rescue animals.`;
  }, [donationAmount, campaign.category]);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !donorEmail) return;

    setIsSubmitting(true);
    setTimeout(() => {
      donate(campaign.id, donationAmount, donorName);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1500);
  };

  const handleTrackDonation = () => {
    setShowCheckout(false);
    setIsSuccess(false);
    setRole('DONOR');
    navigate('/donor');
  };

  const miniStepperSteps = [
    { label: 'Received', desc: 'Secure Ledger entry' },
    { label: 'Allocated', desc: 'Assigned to procurement' },
    { label: 'Purchased', desc: 'Invoices uploaded' },
    { label: 'Verified', desc: 'AI checked' },
    { label: 'Delivered', desc: 'Outcomes logged' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen font-sans">
      
      {/* Back button */}
      <Link to="/explore" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 mb-4 text-left">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Explore
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Details (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-5">
          
          <div className="h-64 sm:h-72 rounded-3xl overflow-hidden border border-slate-200/50 shadow relative">
            <img src={campaign.banner} alt={campaign.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 bg-emerald-500/90 text-white text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg">
              {campaign.category}
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/50 shadow-premium space-y-4">
            <div className="text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Campaign raised by <Link to={`/ngo/${campaign.ngoId}`} className="text-indigo-600 hover:underline">{campaign.ngoName}</Link>
              </span>
              <h1 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 leading-snug mt-1">
                {campaign.title}
              </h1>
            </div>

            {/* Badges bar */}
            <div className="flex flex-wrap gap-1.5 justify-start">
              {campaign.trustIndicators.map((ind) => (
                <span key={ind} className="inline-flex items-center gap-1 text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/30 px-2 py-0.5 rounded">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  {ind}
                </span>
              ))}
              <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200/30 px-2 py-0.5 rounded">
                <Sparkles className="h-3 w-3 text-indigo-600 fill-indigo-100" />
                AI Ledger Verified
              </span>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-2 text-left">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Campaign Overview</h3>
              <p className="text-xs sm:text-sm text-slate-650 leading-relaxed whitespace-pre-line">
                {campaign.description}
              </p>
            </div>

            {/* Injected mini timeline stepper preview */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider text-left">Proposed Donation Journey</span>
              <div className="grid grid-cols-5 gap-1 text-center relative pt-2">
                {miniStepperSteps.map((step, idx) => (
                  <div key={idx} className="space-y-1 relative">
                    <div className="w-5 h-5 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center mx-auto text-[10px] font-bold text-indigo-650">
                      {idx + 1}
                    </div>
                    <h5 className="text-[9px] font-bold text-slate-800 truncate">{step.label}</h5>
                    <p className="text-[8px] text-slate-400 leading-none hidden sm:block">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Bracket impact */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100 space-y-2.5 text-left">
              <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">Impact Benchmarks</h4>
              <div className="space-y-2 text-xs text-slate-600 leading-normal">
                <div className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                  <p>{campaign.expectedImpact.bracket1}</p>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                  <p>{campaign.expectedImpact.bracket2}</p>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                  <p>{campaign.expectedImpact.bracket3}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Donation Widget Sidebar */}
        <div className="space-y-5">
          
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/50 shadow-premium space-y-5">
            
            {/* Status Statistics */}
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-extrabold text-slate-900 font-display">₹{campaign.raisedAmount.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 font-medium">raised of ₹{campaign.targetAmount.toLocaleString()}</span>
              </div>

              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>

              <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                <span>{pct}% Funded</span>
                <span>{campaign.beneficiariesCount} Target Lives</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Donation Interactive Calculator */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-left">Donation Calculator</h3>
              
              {/* Pill Selectors */}
              <div className="grid grid-cols-4 gap-1.5">
                {[500, 1000, 2500, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDonationAmount(amt)}
                    className={`py-1.5 text-xs font-bold rounded-lg border text-center transition-all ${
                      donationAmount === amt
                        ? 'bg-slate-950 border-slate-950 text-white shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400 font-mono">₹</span>
                <input
                  type="number"
                  min="100"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 font-extrabold text-slate-800"
                />
              </div>

              {/* Dynamic Impact Statement Card */}
              <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/40 text-left flex gap-2.5">
                <Info className="h-4 w-4 text-indigo-650 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[8px] font-bold text-indigo-700 uppercase tracking-wide">Live Impact Prediction</span>
                  <p className="text-[11px] text-indigo-850 font-medium leading-normal">{computedImpact}</p>
                </div>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1"
              >
                <Heart className="h-4 w-4 fill-current" />
                Back This Cause
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Donation Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden border border-slate-100 shadow-2xl"
            >
              {isSuccess ? (
                <div className="p-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-650 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-extrabold text-lg text-slate-900">Donation Successful!</h3>
                    <p className="text-slate-500 text-[11px] max-w-xs mx-auto leading-relaxed">
                      Thank you! Your donation of <span className="font-bold text-slate-800">₹{donationAmount.toLocaleString()}</span> has been securely logged on the ledger.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-2 text-xs">
                    <div className="flex gap-2 items-start">
                      <div className="h-6 w-6 rounded bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</div>
                      <div>
                        <h4 className="font-bold text-slate-800">Track Progress</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Your donation creates an active tracking "package" inside your portfolio.</p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-start">
                      <div className="h-6 w-6 rounded bg-indigo-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</div>
                      <div>
                        <h4 className="font-bold text-slate-800">Evidence Verification</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Receive notifications once invoice proofs are AI-verified.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleTrackDonation}
                    className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                  >
                    Track Donation in Portfolio
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCheckoutSubmit} className="space-y-5 text-left">
                  {/* Header */}
                  <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-900">Secure Checkout</h3>
                      <p className="text-[9px] text-slate-400 mt-0.5">Campaign: {campaign.title}</p>
                    </div>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setShowCheckout(false)}
                      className="p-1 rounded-lg hover:bg-slate-205 text-slate-400 transition-colors"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="px-5 space-y-3.5 text-xs">
                    <div className="flex justify-between items-center bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/40">
                      <span className="font-bold text-slate-600">Total Contribution</span>
                      <span className="font-extrabold text-emerald-700 text-sm">₹{donationAmount.toLocaleString()}</span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          disabled={isSubmitting}
                          placeholder="Your Full Name"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-205 bg-slate-50/50"
                        />
                      </div>

                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          disabled={isSubmitting}
                          placeholder="Email Address"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-205 bg-slate-50/50"
                        />
                      </div>

                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          disabled={isSubmitting}
                          placeholder="PAN Card (Optional, for 80G Tax Exemption)"
                          value={donorPan}
                          onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                          maxLength={10}
                          className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-205 bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 text-[10px] text-slate-450 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-normal">
                      <CreditCard className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5" />
                      <p>
                        This is a simulated sandbox checkout. No actual money will be charged.
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setShowCheckout(false)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-lg flex items-center gap-1 disabled:bg-slate-600"
                    >
                      {isSubmitting ? 'Securing Ledger...' : 'Confirm simulated donation'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
