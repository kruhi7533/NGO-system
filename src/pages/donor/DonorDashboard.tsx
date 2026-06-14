import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import TransparencyTimeline from '../../components/TransparencyTimeline';
import { 
  Heart, 
  Users, 
  Award, 
  TrendingUp,
  Download,
  Clock,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function DonorDashboard() {
  const { trackedDonations, ngos, followedNgos } = useStore();
  
  // Selected package tracking index
  const [selectedTrackId, setSelectedTrackId] = useState<string>(
    trackedDonations[0]?.id || ''
  );

  const activeTrack = useMemo(() => 
    trackedDonations.find(t => t.id === selectedTrackId),
    [trackedDonations, selectedTrackId]
  );

  // Compute portfolio stats
  const totalAmount = useMemo(() => 
    trackedDonations.reduce((sum, d) => sum + d.amount, 0),
    [trackedDonations]
  );

  const livesImpacted = useMemo(() => {
    return Math.max(1, Math.round(totalAmount / 400));
  }, [totalAmount]);

  const supportNgosCount = useMemo(() => {
    const ids = new Set(trackedDonations.map(d => d.ngoId));
    return ids.size;
  }, [trackedDonations]);

  // Recharts Chart Data (allocation categories)
  const chartData = useMemo(() => {
    const allocations: Record<string, number> = {};
    trackedDonations.forEach(d => {
      const n = ngos.find(ngo => ngo.id === d.ngoId);
      const cat = n?.category || 'General';
      allocations[cat] = (allocations[cat] || 0) + d.amount;
    });

    return Object.keys(allocations).map(key => ({
      name: key,
      value: allocations[key]
    }));
  }, [trackedDonations, ngos]);

  const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#3b82f6'];

  const badges = [
    { name: 'Impact Pioneer', desc: 'Sponsored your first transparency verification ledger.', icon: Award, unlocked: true },
    { name: 'Code Auditor', desc: 'Inspected raw invoices and evidence logs.', icon: Sparkles, unlocked: true },
    { name: 'Girls Advocate', desc: 'Backed campaigns under education and literacy.', icon: Heart, unlocked: true },
    { name: 'Eco Protector', desc: 'Sponsor sapling beds and micro forest trees.', icon: Users, unlocked: false },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen space-y-6 font-sans">
      
      {/* 1. Header Portfolio Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200/50 shadow-premium text-left">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Workspace</span>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mt-0.5">
            My Impact Portfolio
          </h1>
          <p className="text-[10px] text-slate-550">Secure donor session active.</p>
        </div>

        <button className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition-all flex items-center gap-1.5 shadow-sm">
          <Download className="h-4 w-4" />
          Download Tax Certificate (80G)
        </button>
      </div>

      {/* 2. Metrics Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-premium text-left">
          <span className="block text-[9px] text-slate-400 font-bold uppercase">Total Contributed</span>
          <span className="text-xl font-extrabold text-slate-950 font-display mt-0.5 block">₹{totalAmount.toLocaleString()}</span>
          <span className="text-[9px] text-emerald-600 font-bold block mt-1 flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" />
            100% direct traceability
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-premium text-left">
          <span className="block text-[9px] text-slate-400 font-bold uppercase">Lives Impacted</span>
          <span className="text-xl font-extrabold text-slate-950 font-display mt-0.5 block">{livesImpacted} Lives</span>
          <span className="text-[9px] text-slate-400 block mt-1">Calculated by output index</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-premium text-left">
          <span className="block text-[9px] text-slate-400 font-bold uppercase">NGOs Backed</span>
          <span className="text-xl font-extrabold text-slate-950 font-display mt-0.5 block">{supportNgosCount} Partners</span>
          <span className="text-[9px] text-indigo-600 font-bold block mt-1">Audited compliance records</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-premium text-left">
          <span className="block text-[9px] text-slate-400 font-bold uppercase">District Coverage</span>
          <span className="text-xl font-extrabold text-slate-950 font-display mt-0.5 block">3 Regions</span>
          <span className="text-[9px] text-slate-400 block mt-1">Pune, Udaipur, Bengaluru</span>
        </div>
      </div>

      {/* 3. Package Tracking Live Timeline - PLACED AT THE TOP */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/50 shadow-premium space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-left">
          <div>
            <h2 className="text-base font-display font-extrabold text-slate-900">
              Live Donation Tracker (Package Ledger)
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Select one of your donations below to trace its allocation, invoice uploads, audits, and physical delivery.
            </p>
          </div>

          {/* Stepper Selection Tab List */}
          <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
            {trackedDonations.map((track) => (
              <button
                key={track.id}
                onClick={() => setSelectedTrackId(track.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  selectedTrackId === track.id
                    ? 'bg-slate-950 border-slate-950 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100'
                }`}
              >
                ₹{track.amount.toLocaleString()} - {track.ngoName.split(' ')[0]} ({track.currentStage})
              </button>
            ))}
          </div>
        </div>

        {activeTrack ? (
          <div className="border border-slate-100 p-4 rounded-2xl bg-slate-50/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 mb-4 gap-2 text-left">
              <div>
                <span className="text-[9px] text-slate-450 font-bold uppercase leading-none block">Tracked Campaign Target</span>
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm mt-1">{activeTrack.campaignTitle}</h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">ID: {activeTrack.id}</span>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-250/30 rounded">
                  {activeTrack.currentStage}
                </span>
              </div>
            </div>
            <TransparencyTimeline 
              stages={activeTrack.stages} 
              currentStage={activeTrack.currentStage} 
              amount={activeTrack.amount}
            />
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs">
            No tracked donations yet.
          </div>
        )}
      </div>

      {/* 4. Allocations & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Allocations Pie Chart */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-premium flex flex-col justify-between h-[300px] text-left">
          <div>
            <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Cause Allocations</h3>
            <p className="text-[9px] text-slate-450 mt-0.5">Categorized distribution of your donations.</p>
          </div>

          <div className="h-44 relative mt-2">
            {chartData.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">No chart data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                  <Legend verticalAlign="bottom" iconSize={6} iconType="circle" wrapperStyle={{ fontSize: 9 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Gamified Achievements / Badges */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-premium flex flex-col justify-between h-[300px] lg:col-span-2 text-left">
          <div>
            <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Impact Milestones</h3>
            <p className="text-[9px] text-slate-450 mt-0.5">Achievements unlocked by tracking and verifying social contributions.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.name} className={`p-3 rounded-2xl border flex gap-3 transition-all text-left ${
                  badge.unlocked 
                    ? 'border-emerald-100 bg-emerald-50/10' 
                    : 'border-slate-100 bg-slate-50/20 opacity-50'
                }`}>
                  <div className={`p-1.5 rounded-lg shrink-0 flex items-center justify-center ${
                    badge.unlocked 
                      ? 'bg-emerald-500 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      {badge.name}
                      {badge.unlocked && <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded font-bold uppercase">Unlocked</span>}
                    </h4>
                    <p className="text-[10px] text-slate-450 mt-0.5 leading-normal">{badge.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-400 border-t border-slate-50 pt-2 text-center">
            Complete active campaigns to unlock additional field badges.
          </div>
        </div>

      </div>

      {/* 5. Donation History Table */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/50 shadow-premium space-y-3">
        <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider text-left">Transaction History Log</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-2 pl-2">Tracking ID</th>
                <th className="pb-2">Organization</th>
                <th className="pb-2">Campaign Name</th>
                <th className="pb-2">Contribution</th>
                <th className="pb-2">Timestamp</th>
                <th className="pb-2">Compliance status</th>
                <th className="pb-2 pr-2 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {trackedDonations.map((track) => (
                <tr key={track.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 pl-2 font-mono text-slate-400 text-[10px]">{track.id}</td>
                  <td className="py-3 text-slate-850">{track.ngoName}</td>
                  <td className="py-3 text-slate-700 max-w-xs truncate">{track.campaignTitle}</td>
                  <td className="py-3 font-extrabold text-slate-950">₹{track.amount.toLocaleString()}</td>
                  <td className="py-3 text-slate-450">{track.date}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      track.currentStage === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-indigo-50 text-indigo-750'
                    }`}>
                      {track.currentStage === 'Delivered' ? 'Impact Logged' : 'Active Routing'}
                    </span>
                  </td>
                  <td className="py-3 pr-2 text-right">
                    <button className="text-[10px] font-bold text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded transition-all">
                      80G Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
