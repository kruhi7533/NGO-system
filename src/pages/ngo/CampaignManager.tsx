import React, { useState, useMemo } from 'react';
import { useStore, Campaign } from '../../store/useStore';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  PlusCircle, 
  CheckCircle2, 
  Info,
  Calendar,
  AlertCircle,
  FileText,
  Settings,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CampaignManager() {
  const { campaigns, addCampaign } = useStore();

  const myCampaigns = useMemo(() => 
    campaigns.filter(c => c.ngoId === 'ngo-2'),
    [campaigns]
  );

  const [showWizard, setShowWizard] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Education');
  const [targetAmount, setTargetAmount] = useState<number>(300000);
  const [beneficiaries, setBeneficiaries] = useState<number>(100);
  const [banner, setBanner] = useState('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800');
  const [description, setDescription] = useState('');
  const [bracket1, setBracket1] = useState('');
  const [bracket2, setBracket2] = useState('');
  const [bracket3, setBracket3] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !bracket1 || !bracket2 || !bracket3) return;

    addCampaign({
      title,
      description,
      targetAmount,
      category,
      banner,
      beneficiariesCount: beneficiaries,
      active: true,
      trustIndicators: ['Verified NGO', '100% Traceable', 'Zero Platform Fees'],
      expectedImpact: {
        bracket1,
        bracket2,
        bracket3
      }
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setBracket1('');
    setBracket2('');
    setBracket3('');
    
    setShowWizard(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      
      {/* Back button */}
      <Link to="/ngo" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 mb-6">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="text-left">
          <h1 className="text-2xl font-display font-extrabold text-slate-900">
            Campaign Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure, launch, and monitor your organization fundraising targets.
          </p>
        </div>

        <button
          onClick={() => setShowWizard(true)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          Create New Campaign
        </button>
      </div>

      {/* Success alert banner */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-emerald-50 border border-emerald-200/50 p-4 rounded-2xl flex items-center gap-3 mb-6"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="text-xs text-emerald-800 font-semibold">
              Campaign initialized successfully! It has been indexed and is now accepting live contributions.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Campaign List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myCampaigns.map((camp) => {
          const pct = Math.round((camp.raisedAmount / camp.targetAmount) * 100);
          return (
            <div key={camp.id} className="bg-white p-6 rounded-3xl border border-slate-200/50 shadow-premium flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="text-left">
                    <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase">{camp.category}</span>
                    <h3 className="font-display font-extrabold text-slate-900 text-base mt-2 group-hover:text-emerald-600 transition-colors">
                      {camp.title}
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {camp.id}</span>
                </div>

                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                  {camp.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">₹{camp.raisedAmount.toLocaleString()} <span className="text-slate-400 font-medium">raised of</span> ₹{camp.targetAmount.toLocaleString()}</span>
                    <span className="text-slate-600">{pct}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-6 text-[10px] text-slate-400 font-semibold">
                <div className="flex gap-4">
                  <span>{camp.beneficiariesCount} Target Lives</span>
                  <span>Active</span>
                </div>

                <div className="flex gap-2">
                  <Link 
                    to={`/campaign/${camp.id}`}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700"
                  >
                    View Page
                  </Link>
                  <Link 
                    to="/ngo/proof-upload"
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-indigo-700"
                  >
                    Post Proof
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaign Creation Wizard Dialog Overlay */}
      <AnimatePresence>
        {showWizard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden border border-slate-100 shadow-2xl max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                <div>
                  <h3 className="font-display font-bold text-slate-900">Create Fundraising Campaign</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Publish a traceable social good target.</p>
                </div>
                <button
                  onClick={() => setShowWizard(false)}
                  className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1 text-left">
                
                {/* Basic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Campaign Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Smart boards for Public School"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
                    >
                      <option value="Education">Education</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Environment">Environment</option>
                      <option value="Women Empowerment">Women Empowerment</option>
                      <option value="Child Welfare">Child Welfare</option>
                      <option value="Animal Welfare">Animal Welfare</option>
                      <option value="Disaster Relief">Disaster Relief</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Target Amount (INR)</label>
                    <input
                      type="number"
                      required
                      min={1000}
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Target Beneficiaries</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={beneficiaries}
                      onChange={(e) => setBeneficiaries(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Campaign Narrative / Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Write a clear statement of how the funds will be used and the problem this solves."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
                  />
                </div>

                {/* Impact Brackets Section */}
                <div className="space-y-3 p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100/40">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800">
                    <Info className="h-4 w-4" />
                    Set Expected Impact Calculator Brackets
                  </div>
                  <p className="text-[10px] text-indigo-600/80">Configure exact deliverables so donors know what they are buying.</p>
                  
                  <div className="space-y-3.5">
                    <div className="space-y-1 text-left">
                      <label className="text-[9px] text-indigo-700 font-bold uppercase">Low Bracket (e.g. ₹500 - ₹1,500)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ₹1,000 sponsors 2 textbook packs and lab manuals."
                        value={bracket1}
                        onChange={(e) => setBracket1(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-indigo-200 bg-white"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-[9px] text-indigo-700 font-bold uppercase">Medium Bracket (e.g. ₹2,000 - ₹5,000)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ₹5,000 covers high-speed router connections for 6 months."
                        value={bracket2}
                        onChange={(e) => setBracket2(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-indigo-200 bg-white"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-[9px] text-indigo-700 font-bold uppercase">High Bracket (e.g. ₹10,000 - ₹20,000)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ₹15,000 fully funds 1 core smart monitor with keyboard setup."
                        value={bracket3}
                        onChange={(e) => setBracket3(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-indigo-200 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowWizard(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all"
                  >
                    Launch Campaign
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
