import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  UploadCloud, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShieldCheck, 
  FileText, 
  CheckCircle,
  Clock,
  ChevronRight,
  MapPin,
  ArrowUpRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function NGODashboard() {
  const { campaigns, ngos, trackedDonations } = useStore();

  // NGO is Vidyoday Foundation (ngo-2) by default
  const myNgo = useMemo(() => ngos.find(n => n.id === 'ngo-2')!, [ngos]);
  
  const myCampaigns = useMemo(() => 
    campaigns.filter(c => c.ngoId === 'ngo-2'),
    [campaigns]
  );

  const myDonations = useMemo(() => 
    trackedDonations.filter(t => t.ngoId === 'ngo-2'),
    [trackedDonations]
  );

  // Compute total raised
  const totalRaised = useMemo(() => 
    myCampaigns.reduce((sum, c) => sum + c.raisedAmount, 0),
    [myCampaigns]
  );

  // Recharts analytic data
  const chartData = [
    { month: 'Jan', donations: 45000 },
    { month: 'Feb', donations: 85000 },
    { month: 'Mar', donations: 120000 },
    { month: 'Apr', donations: 95000 },
    { month: 'May', donations: 210000 },
    { month: 'Jun', donations: totalRaised > 0 ? Math.round(totalRaised * 0.3) : 180000 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen space-y-8">
      
      {/* 1. Profile Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/50 shadow-premium">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl border border-slate-200 overflow-hidden shrink-0">
            <img src={myNgo.logo} alt={myNgo.name} className="w-full h-full object-cover" />
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">NGO Management Center</span>
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mt-0.5">
              {myNgo.name} Workspace
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">Location: {myNgo.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 shrink-0">
          <Link
            to="/ngo/campaign-manager"
            className="flex-1 md:flex-initial px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            New Campaign
          </Link>
          <Link
            to="/ngo/proof-upload"
            className="flex-1 md:flex-initial px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <UploadCloud className="h-4.5 w-4.5 text-slate-400" />
            Upload Proof
          </Link>
        </div>
      </div>

      {/* 2. Metrics SaaS Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-premium">
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Raised</span>
          <span className="text-2xl font-extrabold text-slate-950 font-display mt-1 block">₹{totalRaised.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 mt-1.5 block">Across {myCampaigns.length} campaigns</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-premium">
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Supporters/Followers</span>
          <span className="text-2xl font-extrabold text-slate-950 font-display mt-1 block">{myNgo.followersCount} Followers</span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1.5 flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" />
            +12% growth this month
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-premium">
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Trust index rating</span>
          <span className="text-2xl font-extrabold text-slate-950 font-display mt-1 block">{myNgo.trustScore}%</span>
          <span className="text-[10px] text-indigo-600 font-bold block mt-1.5">Ranked #4 locally</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-premium">
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Campaign Target Reach</span>
          <span className="text-2xl font-extrabold text-slate-950 font-display mt-1 block">{myNgo.beneficiariesReached.toLocaleString()} People</span>
          <span className="text-[10px] text-slate-400 block mt-1.5">94% milestone completion rate</span>
        </div>
      </div>

      {/* 3. Middle Section: Analytics Chart & Compliance Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recharts Area Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/50 shadow-premium lg:col-span-2 flex flex-col justify-between h-[380px]">
          <div>
            <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Donations Velocity</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Trace of funds received over the past 6 months.</p>
          </div>

          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                <Area type="monotone" dataKey="donations" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorDonations)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verification Status list */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/50 shadow-premium flex flex-col justify-between h-[380px]">
          <div>
            <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Compliance Documents</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Legally required credentials submitted for admin audits.</p>
          </div>

          <div className="space-y-3.5 my-4 overflow-y-auto pr-1">
            {[
              { label: 'PAN Card Exemption', key: 'pan', status: myNgo.documents.pan },
              { label: '80G Certification Exemption', key: 'g80', status: myNgo.documents.g80 },
              { label: '12A Proof Registry', key: 'a12', status: myNgo.documents.a12 },
              { label: 'FCRA Audit Log Certificate', key: 'fcra', status: myNgo.documents.fcra },
            ].map((doc) => (
              <div key={doc.key} className="flex justify-between items-center p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-400" />
                  <span className="font-semibold text-slate-700">{doc.label}</span>
                </div>
                {doc.status === 'Approved' ? (
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-0.5">
                    <CheckCircle className="h-3 w-3 fill-current" />
                    Verified
                  </span>
                ) : doc.status === 'Pending' ? (
                  <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-0.5">
                    <Clock className="h-3 w-3" />
                    Review
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Not Submitted
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed text-left border-t border-slate-50 pt-3">
            * Submitting updated FCRA certificates boosts transparency score up to +15%.
          </p>
        </div>

      </div>

      {/* 4. Active Campaigns Performance Grid */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/50 shadow-premium space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Active Campaigns Ledger</h3>
          <Link to="/ngo/campaign-manager" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5">
            Manage Campaigns
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myCampaigns.map((camp) => {
            const pct = Math.round((camp.raisedAmount / camp.targetAmount) * 100);
            return (
              <div key={camp.id} className="p-5 rounded-2xl border border-slate-100 hover:border-slate-200/80 transition-all space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="text-left">
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-bold">{camp.category}</span>
                    <h4 className="font-semibold text-slate-800 text-sm mt-1.5 leading-snug">{camp.title}</h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {camp.id}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">₹{camp.raisedAmount.toLocaleString()} <span className="text-slate-400 font-medium">raised of</span> ₹{camp.targetAmount.toLocaleString()}</span>
                    <span className="text-slate-600">{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-50 pt-3">
                  <span>{camp.beneficiariesCount} Target Students</span>
                  <Link to={`/campaign/${camp.id}`} className="text-slate-500 hover:text-slate-900 font-bold flex items-center gap-0.5">
                    View Live Tracker
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
