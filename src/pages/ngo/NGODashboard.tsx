import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  UploadCloud, 
  TrendingUp, 
  FileText, 
  CheckCircle,
  Clock,
  ChevronRight,
  ArrowUpRight,
  Eye,
  Activity,
  Award,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function NGODashboard() {
  const { campaigns, ngos, activeNgoId } = useStore();

  const myNgo = useMemo(() => 
    ngos.find(n => n.id === activeNgoId) || ngos.find(n => n.id === 'ngo-2')!, 
    [ngos, activeNgoId]
  );
  
  const myCampaigns = useMemo(() => 
    campaigns.filter(c => c.ngoId === myNgo.id),
    [campaigns, myNgo.id]
  );

  const totalRaised = useMemo(() => 
    myCampaigns.reduce((sum, c) => sum + c.raisedAmount, 0),
    [myCampaigns]
  );

  const chartData = [
    { month: 'Jan', donations: 45000 },
    { month: 'Feb', donations: 85000 },
    { month: 'Mar', donations: 120000 },
    { month: 'Apr', donations: 95000 },
    { month: 'May', donations: 210000 },
    { month: 'Jun', donations: totalRaised > 0 ? Math.round(totalRaised * 0.3) : 180000 },
  ];

  // Growth center data points
  const growthMetrics = [
    { label: 'Followers Growth', value: '+12.4% MoM', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Donation Conversion', value: '4.82%', icon: Award, color: 'text-indigo-650 bg-indigo-50' },
    { label: 'Profile Views', value: '1,840 views', icon: Eye, color: 'text-slate-700 bg-slate-50' },
    { label: 'Trust Score Growth', value: '+2.8%', icon: Sparkles, color: 'text-violet-600 bg-violet-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen space-y-6 font-sans">
      
      {/* 1. Profile Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200/50 shadow-premium text-left">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden shrink-0">
            <img src={myNgo.logo} alt={myNgo.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">NGO Management Center</span>
            <h1 className="text-lg sm:text-xl font-display font-extrabold text-slate-900 mt-0.5">
              {myNgo.name} Workspace
            </h1>
            <p className="text-[10px] text-slate-550">Active Partner Session.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 shrink-0">
          <Link
            to="/ngo/campaign-manager"
            className="flex-1 md:flex-initial px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="h-4 w-4" />
            New Campaign
          </Link>
          <Link
            to="/ngo/proof-upload"
            className="flex-1 md:flex-initial px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <UploadCloud className="h-4 w-4 text-slate-400" />
            Upload Proof
          </Link>
        </div>
      </div>

      {/* 2. Metrics SaaS Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-premium text-left">
          <span className="block text-[9px] text-slate-400 font-bold uppercase">Total Raised</span>
          <span className="text-xl font-extrabold text-slate-950 font-display mt-0.5 block">₹{totalRaised.toLocaleString()}</span>
          <span className="text-[9px] text-slate-500 mt-1 block">Across {myCampaigns.length} campaigns</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-premium text-left">
          <span className="block text-[9px] text-slate-400 font-bold uppercase">Supporters/Followers</span>
          <span className="text-xl font-extrabold text-slate-950 font-display mt-0.5 block">{myNgo.followersCount} Followers</span>
          <span className="text-[9px] text-emerald-600 font-bold block mt-1 flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" />
            +12.4% growth this month
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-premium text-left">
          <span className="block text-[9px] text-slate-400 font-bold uppercase">Trust Score Rating</span>
          <span className="text-xl font-extrabold text-slate-950 font-display mt-0.5 block">{myNgo.trustScore}%</span>
          <span className="text-[9px] text-indigo-600 font-bold block mt-1">Audit status: Excellent</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-premium text-left">
          <span className="block text-[9px] text-slate-400 font-bold uppercase">Target Reach</span>
          <span className="text-xl font-extrabold text-slate-950 font-display mt-0.5 block">{myNgo.beneficiariesReached.toLocaleString()} Students</span>
          <span className="text-[9px] text-slate-400 block mt-1">98% completion rate</span>
        </div>
      </div>

      {/* 3. Redesigned Split Section: Analytics & Growth Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Analytics line graph (8 Cols) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-premium lg:col-span-8 flex flex-col justify-between h-[340px] text-left">
          <div>
            <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Donations Velocity</h3>
            <p className="text-[9px] text-slate-450 mt-0.5">Trace of funds received over the past 6 months.</p>
          </div>

          <div className="h-52 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                <Area type="monotone" dataKey="donations" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#colorDonations)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* NGO Growth Center (4 Cols) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-premium lg:col-span-4 flex flex-col justify-between h-[340px] text-left">
          <div>
            <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-4.5 w-4.5 text-indigo-650" />
              NGO Growth Center
            </h3>
            <p className="text-[9px] text-slate-450 mt-0.5">Key metrics driving organization credibility.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 my-2.5">
            {growthMetrics.map((gm) => {
              const Icon = gm.icon;
              return (
                <div key={gm.label} className="bg-slate-50/50 p-3 rounded-xl border border-slate-100/80">
                  <div className={`p-1 w-fit rounded-lg ${gm.color} mb-2`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-800 block">{gm.value}</span>
                  <span className="text-[8px] text-slate-400 block mt-0.5 leading-none font-bold uppercase">{gm.label}</span>
                </div>
              );
            })}
          </div>

          <div className="text-[9px] text-slate-400 border-t border-slate-50 pt-2 leading-relaxed">
            Most Successful Campaign: <span className="font-bold text-slate-700">Digital Labs for Girls</span>
          </div>
        </div>

      </div>

      {/* 4. Documents Status & Active Campaigns Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Compliance doc checking */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-premium lg:col-span-4 flex flex-col justify-between h-[280px] text-left">
          <div>
            <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Compliance Registry</h3>
            <p className="text-[9px] text-slate-450 mt-0.5">Upload legally required compliance documents.</p>
          </div>

          <div className="space-y-2.5 my-3 overflow-y-auto">
            {[
              { label: 'PAN Card Exemption', key: 'pan', status: myNgo.documents.pan },
              { label: '80G Certificate Exemption', key: 'g80', status: myNgo.documents.g80 },
              { label: '12A Proof Registry', key: 'a12', status: myNgo.documents.a12 },
              { label: 'FCRA Audit Log Certificate', key: 'fcra', status: myNgo.documents.fcra },
            ].map((doc) => (
              <div key={doc.key} className="flex justify-between items-center p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-slate-400" />
                  <span className="font-semibold text-slate-700">{doc.label}</span>
                </div>
                {doc.status === 'Approved' ? (
                  <span className="text-[8px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <CheckCircle className="h-3 w-3 fill-current" />
                    Verified
                  </span>
                ) : doc.status === 'Pending' ? (
                  <span className="text-[8px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Clock className="h-3 w-3" />
                    Review
                  </span>
                ) : (
                  <span className="text-[8px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    Not Submitted
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="text-[9px] text-slate-400 border-t border-slate-50 pt-2 leading-relaxed">
            * Submitting FCRA logs increases transparency score.
          </p>
        </div>

        {/* Campaigns listing */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-premium lg:col-span-8 space-y-4 text-left">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Active Campaigns Ledger</h3>
            <Link to="/ngo/campaign-manager" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5">
              Manage Campaigns
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCampaigns.map((camp) => {
              const pct = Math.round((camp.raisedAmount / camp.targetAmount) * 100);
              return (
                <div key={camp.id} className="p-4 rounded-xl border border-slate-100 hover:border-slate-200/85 transition-all space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="text-left">
                      <span className="text-[8px] bg-slate-100 text-slate-550 px-2 py-0.5 rounded uppercase font-bold">{camp.category}</span>
                      <h4 className="font-bold text-slate-800 text-xs mt-1.5 leading-snug">{camp.title}</h4>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-slate-800">₹{camp.raisedAmount.toLocaleString()} / ₹{camp.targetAmount.toLocaleString()}</span>
                      <span className="text-slate-600">{pct}%</span>
                    </div>
                    <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[9px] text-slate-400 border-t border-slate-50 pt-2">
                    <span>{camp.beneficiariesCount} Target Students</span>
                    <Link to={`/campaign/${camp.id}`} className="text-slate-500 hover:text-slate-900 font-bold flex items-center gap-0.5">
                      View Page
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
