import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  Award, 
  CheckCircle2, 
  Info,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProofUploadCenter() {
  const navigate = useNavigate();
  const { campaigns, uploadProof } = useStore();

  const myCampaigns = useMemo(() => 
    campaigns.filter(c => c.ngoId === 'ngo-2'),
    [campaigns]
  );

  const [selectedCampaignId, setSelectedCampaignId] = useState(myCampaigns[0]?.id || '');
  const [stageName, setStageName] = useState('Resources Purchased');
  const [description, setDescription] = useState('');
  const [evidenceName, setEvidenceName] = useState('');
  const [evidenceType, setEvidenceType] = useState<'invoice' | 'photo' | 'report'>('invoice');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignId || !description || !evidenceName) return;

    setIsLoading(true);

    // Simulate ledger upload processing
    setTimeout(() => {
      uploadProof(
        selectedCampaignId,
        stageName,
        description,
        evidenceName,
        evidenceType
      );
      setIsLoading(false);
      setIsSuccess(true);
      
      // Clear forms
      setDescription('');
      setEvidenceName('');
    }, 2000);
  };

  const handleReturn = () => {
    setIsSuccess(false);
    navigate('/ngo');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 min-h-screen">
      
      {/* Back button */}
      <Link to="/ngo" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 mb-6">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Dashboard
      </Link>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/50 shadow-premium space-y-6">
        
        {/* Header */}
        <div className="text-left">
          <h1 className="text-2xl font-display font-extrabold text-slate-900">
            Proof Upload Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit invoice proofs, field photos, and progress records to update the donation tracking timeline.
          </p>
        </div>

        <hr className="border-slate-100" />

        {isSuccess ? (
          <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-extrabold text-lg text-slate-900">Ledger Updated!</h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                Your proof has been uploaded. Automated ledger systems have matched receipts and dispatched notifications to active donors.
              </p>
            </div>

            <div className="p-4 bg-indigo-50/50 border border-indigo-100/40 rounded-2xl text-left flex gap-3">
              <Sparkles className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-left">
                <span className="text-[10px] text-indigo-700 font-bold uppercase block">AI Verification Active</span>
                <p className="text-xs text-indigo-800 leading-relaxed mt-0.5 font-medium">
                  The uploaded file has been pushed to the Updates Feed. Donors will see the "AI Verified" badge next to your evidence files.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsSuccess(false)}
                className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                Upload Another
              </button>
              <button
                onClick={handleReturn}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all"
              >
                Return to Workspace
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpload} className="space-y-5 text-left">
            
            {/* Campaign Selection */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Select Target Campaign</label>
              <select
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
              >
                {myCampaigns.map((camp) => (
                  <option key={camp.id} value={camp.id}>{camp.title}</option>
                ))}
              </select>
            </div>

            {/* Stepper Node Selection */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Timeline Stage to Update</label>
              <select
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
              >
                <option value="Resources Purchased">Resources Purchased (Step 3)</option>
                <option value="Proof Uploaded">Proof Uploaded (Step 4)</option>
                <option value="Verified">Audited & Verified (Step 5)</option>
                <option value="Impact Delivered">Impact Delivered (Step 6)</option>
              </select>
            </div>

            {/* Details Description */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Evidence Notes / Resource description</label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Purchased 15 STEM learning kits and books from local distributors. Invoices attached below."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
              />
            </div>

            {/* Attachment inputs */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="block text-[10px] text-slate-400 font-bold uppercase">Proof File Attachment Details</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 font-bold uppercase">Evidence Type</label>
                  <select
                    value={evidenceType}
                    onChange={(e) => setEvidenceType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="invoice">GST Invoice / Bill (PDF)</option>
                    <option value="photo">Field Photograph (JPEG)</option>
                    <option value="report">Activity Audit Report (PDF)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 font-bold uppercase">File Name Mockup</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. INV_9940_VIDYODAY.pdf"
                    value={evidenceName}
                    onChange={(e) => setEvidenceName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 text-[10px] text-slate-400 bg-white p-3 rounded-xl border border-slate-100">
                <Info className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <p>
                  Uploading documents initiates an automatic check to verify amounts match registered disbursements.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-600 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Uploading to Ledger Registry...
                </>
              ) : (
                <>Upload Evidence & Update Ledger</>
              )}
            </button>

          </form>
        )}

      </div>

    </div>
  );
}
