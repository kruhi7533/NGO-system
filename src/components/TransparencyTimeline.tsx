import React, { useState } from 'react';
import { TimelineStage } from '../store/useStore';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  FileText, 
  Image as ImageIcon, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  Download,
  AlertCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransparencyTimelineProps {
  stages: TimelineStage[];
  currentStage: string;
  amount: number;
}

export default function TransparencyTimeline({ stages, currentStage, amount }: TransparencyTimelineProps) {
  const [selectedEvidence, setSelectedEvidence] = useState<{
    type: string;
    name: string;
    url: string;
    notes?: string;
    isAiVerified?: boolean;
  } | null>(null);

  // Mapping stages to custom icons
  const getStageIcon = (stageName: string, status: TimelineStage['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-6 w-6 text-emerald-500 fill-emerald-50" />;
      case 'current':
        return (
          <div className="relative">
            <span className="absolute inline-flex h-6 w-6 rounded-full bg-indigo-400 opacity-75 animate-ping" />
            <Clock className="relative h-6 w-6 text-indigo-600 bg-white rounded-full" />
          </div>
        );
      default:
        return <Circle className="h-6 w-6 text-slate-300 bg-white" />;
    }
  };

  return (
    <div className="w-full">
      {/* Mini Stepper (Horizontal Progress Bar on Desktop) */}
      <div className="hidden md:flex items-center justify-between mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        {stages.map((stage, idx) => (
          <React.Fragment key={stage.id}>
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center">
                <div className={`p-1 rounded-full ${
                  stage.status === 'completed' 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : stage.status === 'current' 
                    ? 'text-indigo-600 bg-indigo-50 animate-pulse'
                    : 'text-slate-400 bg-slate-100'
                }`}>
                  {stage.status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5 fill-current" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>
              </div>
              <span className={`text-[10px] mt-2 font-semibold tracking-tight ${
                stage.status === 'completed' 
                  ? 'text-emerald-700 font-bold' 
                  : stage.status === 'current' 
                  ? 'text-indigo-700 font-bold' 
                  : 'text-slate-400'
              }`}>
                {stage.name}
              </span>
            </div>
            {idx < stages.length - 1 && (
              <div className={`h-[2px] w-full flex-1 ${
                stages[idx + 1].status === 'completed' || stage.status === 'completed'
                  ? 'bg-emerald-200'
                  : 'bg-slate-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Main Vertical Timeline */}
      <div className="relative border-l-2 border-slate-200 ml-4 pl-8 space-y-8 py-2">
        {stages.map((stage) => {
          const isCompleted = stage.status === 'completed';
          const isCurrent = stage.status === 'current';
          
          return (
            <div key={stage.id} className="relative">
              {/* Node Icon Indicator absolute on left line */}
              <div className="absolute -left-[45px] top-0.5 bg-white rounded-full p-0.5 z-10">
                {getStageIcon(stage.name, stage.status)}
              </div>

              {/* Stage Card */}
              <div className={`p-5 rounded-2xl border transition-all duration-200 ${
                isCurrent 
                  ? 'bg-gradient-to-r from-indigo-50/40 to-indigo-100/10 border-indigo-200 shadow-glow-secondary' 
                  : isCompleted 
                  ? 'bg-white border-slate-100 hover:border-slate-200/80' 
                  : 'bg-slate-50/50 border-slate-100 opacity-60'
              }`}>
                {/* Stage Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-display font-semibold text-sm sm:text-base ${
                      isCurrent ? 'text-indigo-900' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {stage.name}
                    </h3>
                    
                    {isCurrent && (
                      <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        Active Step
                      </span>
                    )}
                  </div>
                  
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="h-3 w-3" />
                    {stage.timestamp}
                  </span>
                </div>

                {/* Description Text */}
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                  {stage.description}
                </p>

                {/* Evidence Section */}
                {stage.evidence && (
                  <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500">
                        {stage.evidence.type === 'invoice' || stage.evidence.type === 'certificate' ? (
                          <FileText className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-indigo-500" />
                        )}
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                          {stage.evidence.name}
                          <span className="text-[9px] text-slate-400 capitalize">({stage.evidence.type})</span>
                        </div>
                        <p className="text-[10px] text-slate-400">Published in tracking registry</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {/* AI Verified Badge */}
                      {stage.evidence.isAiVerified && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold bg-violet-100/80 text-violet-700 border border-violet-200/50 px-2 py-1 rounded-lg">
                          <Sparkles className="h-3 w-3 fill-current" />
                          AI Verified
                        </span>
                      )}

                      <button
                        onClick={() => setSelectedEvidence(stage.evidence!)}
                        className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200/80 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors ml-auto sm:ml-0"
                      >
                        Inspect Proof
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Proof Viewer Overlay Modal */}
      <AnimatePresence>
        {selectedEvidence && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden border border-slate-100 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="font-display font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    Ledger Evidence Auditor
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Asset Reference ID: IMP-{Math.floor(100000 + Math.random() * 900000)}</p>
                </div>
                <button
                  onClick={() => setSelectedEvidence(null)}
                  className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {selectedEvidence.type === 'photo' ? (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 max-h-64 flex items-center justify-center">
                    <img
                      src={selectedEvidence.url}
                      alt="Evidence proof"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="p-4 bg-emerald-100/50 text-emerald-600 rounded-full">
                      <FileText className="h-10 w-10" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{selectedEvidence.name}</h4>
                      <p className="text-[10px] text-slate-400">PDF Document - Cryptographically Locked</p>
                    </div>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl transition-all">
                      <Download className="h-3.5 w-3.5" />
                      Download Copy
                    </button>
                  </div>
                )}

                {/* AI Auditing Summary */}
                {selectedEvidence.isAiVerified && (
                  <div className="p-4 bg-violet-50/70 border border-violet-100/80 rounded-2xl text-left">
                    <div className="flex items-center gap-2 text-violet-800 font-semibold text-xs mb-1">
                      <Sparkles className="h-3.5 w-3.5 fill-current text-violet-500" />
                      Automated Ledger Verification
                    </div>
                    <p className="text-[11px] leading-relaxed text-violet-600 font-medium">
                      {selectedEvidence.notes || 'The invoice document amounts and line-items matching has been verified against the registered vendor receipts with 100% direct checksum verification.'}
                    </p>
                  </div>
                )}

                {/* Transparency Disclaimer */}
                <div className="flex gap-2 text-slate-400 text-[10px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <AlertCircle className="h-4 w-4 text-slate-500 shrink-0" />
                  <p className="leading-relaxed">
                    This evidence was uploaded to the Imparency Ledger Registry. It is signed by the NGO representatives and stored in an immutable verification log.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedEvidence(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl transition-all"
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
