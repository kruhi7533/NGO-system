import React, { useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle, 
  MapPin, 
  Sparkles,
  AlertTriangle,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const { ngos, campaigns, verifyDocument, approveCampaign } = useStore();

  // Find NGOs with pending documents
  const pendingNgos = useMemo(() => 
    ngos.filter(ngo => 
      Object.values(ngo.documents).some(status => status === 'Pending')
    ), 
    [ngos]
  );

  const pendingCampaigns = useMemo(() => 
    campaigns.filter(c => !c.active),
    [campaigns]
  );

  const [activeQueue, setActiveQueue] = useState<'docs' | 'campaigns' | 'logs'>('docs');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleVerifyDoc = (ngoId: string, docType: 'pan' | 'g80' | 'a12' | 'fcra') => {
    verifyDocument(ngoId, docType, 'Approved');
    setSuccessToast(`Document Approved! Trust ratings recalculated.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleApproveCampaign = (campaignId: string) => {
    approveCampaign(campaignId);
    setSuccessToast(`Campaign Authorized for listing!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const auditLogs = [
    { text: 'Auditor Sarah Jenkins approved 12A certificate for Sanjeevani Trust.', time: '10 mins ago', type: 'info' },
    { text: 'Automated AI matched invoice PO-2026-049 to disbursement records.', time: '1 hour ago', type: 'ai' },
    { text: 'System triggered FCRA renewal warning flag for Green Canopy.', time: '3 hours ago', type: 'warn' },
    { text: 'Paws & Tails Shelter uploaded new 80G certificate for Udaipur District.', time: '1 day ago', type: 'info' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/50 shadow-premium">
        <div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Workspace</span>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mt-1">
            Auditing & Compliance Center
          </h1>
          <p className="text-xs text-slate-450 mt-0.5 font-medium">Account Access: Lead Auditor (Super Admin)</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-xl shadow-sm">
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 fill-emerald-50" />
          Secure Admin Sandbox Mode
        </div>
      </div>

      {/* Toast alert popup */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-3 text-xs font-bold"
          >
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            {successToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs list selector */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveQueue('docs')}
          className={`py-3 text-sm font-semibold capitalize border-b-2 transition-all leading-none ${
            activeQueue === 'docs'
              ? 'border-emerald-500 text-emerald-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Compliance Queue ({pendingNgos.length})
        </button>
        <button
          onClick={() => setActiveQueue('campaigns')}
          className={`py-3 text-sm font-semibold capitalize border-b-2 transition-all leading-none ${
            activeQueue === 'campaigns'
              ? 'border-emerald-500 text-emerald-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Campaign Authorizations ({pendingCampaigns.length})
        </button>
        <button
          onClick={() => setActiveQueue('logs')}
          className={`py-3 text-sm font-semibold capitalize border-b-2 transition-all leading-none ${
            activeQueue === 'logs'
              ? 'border-emerald-500 text-emerald-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          System Audit Logs
        </button>
      </div>

      {/* Queue Viewport panels */}
      <div>
        
        {/* NGO docs queue */}
        {activeQueue === 'docs' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {pendingNgos.length === 0 ? (
              <div className="p-16 text-center bg-white rounded-3xl border border-slate-100 shadow-premium">
                <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                <h3 className="font-bold text-slate-700">Audit Queue Clear!</h3>
                <p className="text-xs text-slate-400 mt-1">All registered NGO documentation is currently verified and approved.</p>
              </div>
            ) : (
              pendingNgos.map((ngo) => (
                <div key={ngo.id} className="bg-white rounded-3xl border border-slate-200/50 p-6 shadow-premium space-y-6">
                  
                  {/* NGO header info */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                        <img src={ngo.logo} alt={ngo.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-display font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                          {ngo.name}
                          <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full capitalize font-bold">{ngo.category}</span>
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {ngo.location}
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Current Trust Rating</span>
                      <span className="text-lg font-extrabold text-amber-500 font-display mt-0.5 block">{ngo.trustScore}%</span>
                    </div>
                  </div>

                  {/* Document details cards */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Documents Pending Verification</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(ngo.documents)
                        .filter(([_, status]) => status === 'Pending')
                        .map(([docKey, status]) => (
                          <div key={docKey} className="p-4 rounded-2xl border border-amber-100 bg-amber-50/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-lg border border-slate-200 text-amber-500 shrink-0">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div className="text-left">
                                <h4 className="text-xs font-bold text-slate-800 capitalize leading-snug">{docKey.toUpperCase()} Certificate Registration</h4>
                                <p className="text-[9px] text-slate-400 mt-0.5">Mock doc submission attachment.</p>
                              </div>
                            </div>

                            <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
                              <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-all">
                                View File
                              </button>
                              <button
                                onClick={() => handleVerifyDoc(ngo.id, docKey as any)}
                                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 shadow-sm"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                Approve
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        )}

        {/* Campaign approval queue */}
        {activeQueue === 'campaigns' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {pendingCampaigns.length === 0 ? (
              <div className="p-16 text-center bg-white rounded-3xl border border-slate-100 shadow-premium">
                <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                <h3 className="font-bold text-slate-700">Campaign approvals clear!</h3>
                <p className="text-xs text-slate-400 mt-1">All submitted campaigns are currently authorized and active.</p>
              </div>
            ) : (
              pendingCampaigns.map((camp) => (
                <div key={camp.id} className="bg-white rounded-3xl border border-slate-200/50 p-6 shadow-premium space-y-6">
                  
                  <div className="flex justify-between items-start border-b border-slate-100 pb-4 gap-4">
                    <div className="text-left">
                      <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-bold">{camp.category}</span>
                      <h3 className="font-display font-extrabold text-slate-900 text-base mt-2">{camp.title}</h3>
                      <p className="text-[10px] text-indigo-600 font-semibold mt-1">Proposed by NGO: {camp.ngoName}</p>
                    </div>

                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-100">
                        Inspect Story
                      </button>
                      <button
                        onClick={() => handleApproveCampaign(camp.id)}
                        className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm"
                      >
                        Approve listing
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Amount</span>
                      <span className="text-sm font-extrabold text-slate-800">₹{camp.targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Expected Beneficiaries</span>
                      <span className="text-sm font-extrabold text-slate-800">{camp.beneficiariesCount} Target Lives</span>
                    </div>
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Auditing indicators</span>
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                        <ShieldCheck className="h-4 w-4" />
                        Compliant
                      </span>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        )}

        {/* Audit log panel */}
        {activeQueue === 'logs' && (
          <div className="bg-white rounded-3xl border border-slate-200/50 p-6 shadow-premium space-y-4 animate-in fade-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <History className="h-4.5 w-4.5 text-slate-400" />
                Ledger Transaction History Log
              </h3>
              <span className="text-[10px] text-slate-400">Live feed</span>
            </div>

            <div className="divide-y divide-slate-50 text-xs">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2.5">
                    {log.type === 'ai' ? (
                      <span className="p-1 bg-violet-100 text-violet-700 rounded-lg text-[9px] font-bold flex items-center gap-0.5">
                        <Sparkles className="h-3 w-3 fill-current" />
                        AI Audit
                      </span>
                    ) : log.type === 'warn' ? (
                      <span className="p-1 bg-amber-100 text-amber-700 rounded-lg text-[9px] font-bold flex items-center gap-0.5">
                        <AlertTriangle className="h-3 w-3" />
                        Warning
                      </span>
                    ) : (
                      <span className="p-1 bg-slate-100 text-slate-700 rounded-lg text-[9px] font-bold">
                        Manual
                      </span>
                    )}
                    <span className="text-slate-600 font-medium leading-relaxed">{log.text}</span>
                  </div>

                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
