import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  FileText, 
  ArrowLeft,
  Sparkles,
  Info,
  CreditCard,
  User,
  Mail,
  Heart,
  CheckCircle,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function CampaignDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { campaigns, donate, currentRole, setRole } = useStore();

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

  // Calculate customized impact string based on user's amount
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
    // Animal Welfare or others
    const strayRescue = Math.floor(amt / 1000);
    return `₹${amt.toLocaleString()} covers vaccination, rabies shelter care, and veterinary surgery for ${strayRescue} rescue animals.`;
  }, [donationAmount, campaign.category]);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !donorEmail) return;

    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      donate(campaign.id, donationAmount, donorName);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Fire confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 2000);
  };

  const handleTrackDonation = () => {
    setShowCheckout(false);
    setIsSuccess(false);
    // Switch role to donor so dashboard works
    setRole('donor');
    navigate('/donor');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      
      {/* Back button */}
      <Link to="/explore" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 mb-6">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Explore
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Campaign Details (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="h-80 sm:h-96 rounded-3xl overflow-hidden border border-slate-200/50 shadow-md relative">
            <img src={campaign.banner} alt={campaign.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 bg-emerald-500/90 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-xl">
              {campaign.category}
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/50 shadow-premium space-y-5">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Campaign raised by <Link to={`/ngo/${campaign.ngoId}`} className="text-indigo-600 hover:underline">{campaign.ngoName}</Link>
              </span>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 leading-snug">
                {campaign.title}
              </h1>
            </div>

            {/* Badges bar */}
            <div className="flex flex-wrap gap-2">
              {campaign.trustIndicators.map((ind) => (
                <span key={ind} className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/40 px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  {ind}
                </span>
              ))}
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200/40 px-2.5 py-1 rounded-lg">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600 fill-indigo-100" />
                AI Ledger Verified
              </span>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Campaign Overview</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {campaign.description}
              </p>
            </div>

            {/* Expected Bracket impact */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Impact Benchmarks</h4>
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex gap-2.5 items-start">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                  <p>{campaign.expectedImpact.bracket1}</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                  <p>{campaign.expectedImpact.bracket2}</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                  <p>{campaign.expectedImpact.bracket3}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Donation Widget Sidebar (Right Column) */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/50 shadow-premium space-y-6">
            
            {/* Status Statistics */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-extrabold text-slate-900 font-display">₹{campaign.raisedAmount.toLocaleString()}</span>
                <span className="text-xs text-slate-400 font-medium">raised of ₹{campaign.targetAmount.toLocaleString()}</span>
              </div>

              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>

              <div className="flex justify-between text-[11px] font-semibold text-slate-500 pt-1">
                <span>{pct}% Funded</span>
                <span>{campaign.beneficiariesCount} Target Lives</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Donation Interactive Calculator */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Custom Donation Calculator</h3>
              
              {/* Pill Selectors */}
              <div className="grid grid-cols-4 gap-2">
                {[500, 1000, 2500, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDonationAmount(amt)}
                    className={`py-2 text-xs font-bold rounded-xl border text-center transition-all ${
                      donationAmount === amt
                        ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-extrabold text-slate-400 font-mono">₹</span>
                <input
                  type="number"
                  min="100"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 text-sm rounded-xl border border-slate-200 font-extrabold text-slate-800"
                />
              </div>

              {/* Dynamic Impact Statement Card */}
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/40 text-left flex gap-3">
                <Info className="h-4.5 w-4.5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-indigo-700 uppercase tracking-wide">Live Impact Prediction</span>
                  <p className="text-xs text-indigo-800 font-medium leading-relaxed">{computedImpact}</p>
                </div>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-md shadow-emerald-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <Heart className="h-4.5 w-4.5 fill-current" />
                Back This Cause
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Donation Checkout Modal Overlay */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden border border-slate-100 shadow-2xl"
            >
              {/* Success View */}
              {isSuccess ? (
                <div className="p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-extrabold text-xl text-slate-900">Donation Successful!</h3>
                    <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                      Thank you! Your donation of <span className="font-bold text-slate-800">₹{donationAmount.toLocaleString()}</span> has been securely logged on the ledger.
                    </p>
                  </div>

                  {/* Impact tracking teaser */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-3.5">
                    <div className="flex gap-2.5 items-start">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0">1</div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug">Track Progress</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Your donation creates an active transparency "package" inside your portfolio.</p>
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0">2</div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug">Evidence Verification</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Receive mobile/email updates once invoice proofs and photos are audited.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleTrackDonation}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                  >
                    Track Donation in Portfolio
                  </button>
                </div>
              ) : (
                /* Interactive Checkout Form */
                <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                  {/* Modal Header */}
                  <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                      <h3 className="font-display font-bold text-slate-900">Secure Donation Checkout</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Campaign: {campaign.title}</p>
                    </div>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setShowCheckout(false)}
                      className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Form fields */}
                  <div className="p-6 space-y-4">
                    {/* Amount preview */}
                    <div className="flex justify-between items-center bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/40">
                      <span className="text-xs font-bold text-slate-600">Total Contribution</span>
                      <span className="text-lg font-extrabold text-emerald-700">₹{donationAmount.toLocaleString()}</span>
                    </div>

                    <div className="space-y-3">
                      {/* Name */}
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          disabled={isSubmitting}
                          placeholder="Your Full Name"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
                        />
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          disabled={isSubmitting}
                          placeholder="Email Address (for invoices)"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
                        />
                      </div>

                      {/* PAN (Optional, but useful for 80G tax benefits) */}
                      <div className="relative">
                        <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          disabled={isSubmitting}
                          placeholder="PAN Card (Optional, for 80G Tax Exemption)"
                          value={donorPan}
                          onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                          maxLength={10}
                          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
                        />
                      </div>
                    </div>

                    {/* Security credentials tags */}
                    <div className="flex gap-2 text-[10px] text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                      <CreditCard className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <p>
                        This is a simulated sandbox checkout. No actual money will be charged. Submitting will register mock tracking updates in your impact history.
                      </p>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setShowCheckout(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 disabled:bg-slate-600"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Securing Ledger...
                        </>
                      ) : (
                        <>
                          Confirm simulated donation
                        </>
                      )}
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
