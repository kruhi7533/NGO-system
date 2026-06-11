import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { 
  ShieldCheck, 
  MapPin, 
  Users, 
  Bookmark, 
  BookmarkCheck,
  FileText, 
  ChevronRight, 
  Calendar,
  Image as ImageIcon,
  Heart,
  TrendingUp,
  Download,
  CheckCircle,
  Clock,
  HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function NGOProfile() {
  const { id } = useParams<{ id: string }>();
  const { ngos, campaigns, feedPosts, followedNgos, toggleFollowNGO } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'feed'>('overview');

  const ngo = useMemo(() => ngos.find(n => n.id === id), [ngos, id]);

  const ngoCampaigns = useMemo(() => 
    campaigns.filter(c => c.ngoId === id), 
    [campaigns, id]
  );

  const ngoPosts = useMemo(() => 
    feedPosts.filter(p => p.ngoId === id), 
    [feedPosts, id]
  );

  if (!ngo) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">NGO Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The organization profile you are looking for does not exist.</p>
        <Link to="/explore" className="text-emerald-600 font-bold text-xs mt-4 inline-block">Back to Explore</Link>
      </div>
    );
  }

  const isFollowing = followedNgos.includes(ngo.id);

  // Docs details
  const docMetadata = [
    { label: 'Permanent Account Number (PAN)', key: 'pan', filename: `PAN_AUDIT_${ngo.name.split(' ')[0].toUpperCase()}.pdf` },
    { label: '80G Income Tax Exemption certificate', key: 'g80', filename: `80G_CERTIFICATE_FY26.pdf` },
    { label: '12A Registration Proof', key: 'a12', filename: `12A_REGISTRATION_${ngo.name.split(' ')[0].toUpperCase()}.pdf` },
    { label: 'Foreign Contribution Regulation Act (FCRA)', key: 'fcra', filename: `FCRA_AUDIT_LOG.pdf` },
  ];

  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      
      {/* 1. Header Banner & Profile Card */}
      <div className="w-full h-64 bg-slate-200 relative overflow-hidden">
        <img src={ngo.banner} alt={ngo.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24 z-10">
        <div className="bg-white rounded-3xl border border-slate-200/50 p-6 sm:p-8 shadow-premium flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="w-28 h-28 rounded-3xl bg-white p-1 border border-slate-200 shadow-md overflow-hidden shrink-0">
              <img src={ngo.logo} alt={ngo.name} className="w-full h-full object-cover rounded-2xl" />
            </div>
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100/50 px-2.5 py-0.5 rounded-full capitalize">
                  {ngo.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                  <MapPin className="h-3.5 w-3.5" />
                  {ngo.location}
                </span>
              </div>

              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {ngo.name}
                {ngo.verifiedStatus ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 fill-emerald-50" />
                    Verified NGO
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-md">
                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                    Audits Pending
                  </span>
                )}
              </h1>

              <p className="text-sm text-slate-500 max-w-xl font-medium leading-relaxed">
                {ngo.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
            <button
              onClick={() => toggleFollowNGO(ngo.id)}
              className={`flex-1 md:flex-initial px-5 py-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                isFollowing 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400' 
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:scale-102'
              }`}
            >
              {isFollowing ? (
                <>
                  <BookmarkCheck className="h-4 w-4 fill-current" />
                  Following Updates
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4" />
                  Follow Organization
                </>
              )}
            </button>

            <Link
              to={`/campaign/${ngoCampaigns[0]?.id || ''}`}
              className="flex-1 md:flex-initial px-5 py-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all text-center"
            >
              Support Direct
            </Link>
          </div>

        </div>
      </div>

      {/* 2. Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Tabs Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tabs bar */}
          <div className="border-b border-slate-200 flex space-x-6">
            {(['overview', 'campaigns', 'feed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3.5 text-sm font-semibold capitalize border-b-2 transition-all leading-none ${
                  activeTab === tab
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab === 'feed' ? `Impact Stories (${ngoPosts.length})` : tab}
              </button>
            ))}
          </div>

          {/* Active tab panels */}
          <div>
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Mission & Story */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/50 shadow-premium space-y-4">
                  <h3 className="text-base font-bold text-slate-900">Our Story & Mission</h3>
                  <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <p className="font-semibold text-slate-800">Mission Statement:</p>
                    <p className="pl-4 border-l-2 border-emerald-500 italic bg-emerald-50/20 py-2 text-slate-700">
                      "{ngo.mission}"
                    </p>
                    <p className="font-semibold text-slate-800 pt-2">Background Narrative:</p>
                    <p>{ngo.story}</p>
                  </div>
                </div>

                {/* Verification Documents Audit Grid */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/50 shadow-premium space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-slate-900">Compliance & Tax Exemption Audits</h3>
                    <span className="text-[10px] font-mono text-slate-400">PAN Register Checked</span>
                  </div>
                  <div className="space-y-3.5">
                    {docMetadata.map((doc) => {
                      const docStatus = ngo.documents[doc.key as keyof typeof ngo.documents];
                      return (
                        <div key={doc.key} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors gap-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                              <h4 className="text-xs font-semibold text-slate-800 leading-snug">{doc.label}</h4>
                              <p className="text-[10px] font-mono text-slate-400 mt-0.5">{doc.filename}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-between sm:justify-start">
                            {docStatus === 'Approved' ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200/50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 fill-current" />
                                Audited & Verified
                              </span>
                            ) : docStatus === 'Pending' ? (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200/50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Pending Review
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200/50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                                <HelpCircle className="h-3 w-3" />
                                Not Submitted
                              </span>
                            )}

                            {docStatus === 'Approved' && (
                              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all" title="Download Document">
                                <Download className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Photo Gallery */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/50 shadow-premium space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <ImageIcon className="h-4.5 w-4.5 text-slate-400" />
                    Field Projects Gallery
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {ngo.gallery.map((imgUrl, index) => (
                      <div key={index} className="h-40 rounded-2xl overflow-hidden border border-slate-200">
                        <img src={imgUrl} alt={`Gallery ${index}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Campaigns Tab */}
            {activeTab === 'campaigns' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {ngoCampaigns.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-premium">No campaigns available.</div>
                ) : (
                  ngoCampaigns.map((camp) => {
                    const pct = Math.round((camp.raisedAmount / camp.targetAmount) * 100);
                    return (
                      <div key={camp.id} className="bg-white rounded-3xl border border-slate-200/50 p-5 shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col sm:flex-row gap-5">
                        <div className="w-full sm:w-48 h-32 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                          <img src={camp.banner} alt={camp.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{camp.category}</span>
                            <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base hover:text-emerald-600 transition-colors">
                              <Link to={`/campaign/${camp.id}`}>{camp.title}</Link>
                            </h3>
                            <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                              {camp.description}
                            </p>
                          </div>

                          <div className="space-y-1.5 pt-3">
                            <div className="flex justify-between text-[11px] font-semibold">
                              <span className="text-slate-800">₹{camp.raisedAmount.toLocaleString()} / ₹{camp.targetAmount.toLocaleString()}</span>
                              <span className="text-slate-600">{pct}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center shrink-0">
                          <Link 
                            to={`/campaign/${camp.id}`}
                            className="p-3 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 rounded-2xl transition-all w-full sm:w-auto text-center"
                          >
                            <ChevronRight className="h-5 w-5 mx-auto" />
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Updates Tab */}
            {activeTab === 'feed' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {ngoPosts.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-premium">No update posts uploaded yet.</div>
                ) : (
                  ngoPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-3xl border border-slate-200/50 p-5 shadow-premium space-y-4">
                      {/* Post Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200">
                            <img src={ngo.logo} alt={ngo.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">{ngo.name}</h4>
                            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{post.timestamp}</span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          post.type === 'evidence' 
                            ? 'bg-violet-50 text-violet-700 border border-violet-100' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {post.type}
                        </span>
                      </div>

                      {/* Post Content */}
                      <div className="space-y-3">
                        <h3 className="font-display font-bold text-slate-900 text-sm leading-tight">{post.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{post.content}</p>
                      </div>

                      {post.image && (
                        <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-60">
                          <img src={post.image} alt="Update upload" className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Document Download Link */}
                      {post.document && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4.5 w-4.5 text-slate-400" />
                            <span className="text-xs font-semibold text-slate-700">{post.document.name}</span>
                          </div>
                          <button className="text-slate-400 hover:text-slate-600 p-1">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Score Summary & Sidebar Stats */}
        <div className="space-y-6">
          
          {/* Trust Indexes Display */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/50 shadow-premium space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Transparency Scores</h3>
            
            <div className="space-y-5">
              {/* Trust Score */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-600 flex items-center gap-1">
                    Trust Rating
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded">High</span>
                  </span>
                  <span className="text-slate-900 font-extrabold">{ngo.trustScore}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${ngo.trustScore}%` }} />
                </div>
              </div>

              {/* Transparency Score */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-600">Audit Trails Index</span>
                  <span className="text-slate-900 font-extrabold">{ngo.transparencyScore}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${ngo.transparencyScore}%` }} />
                </div>
              </div>

              {/* Impact Score */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-600">Goal Completion Rate</span>
                  <span className="text-slate-900 font-extrabold">{ngo.impactScore}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${ngo.impactScore}%` }} />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 text-[11px] text-slate-400 leading-relaxed">
              * The trust rating is calculated based on doc verification status, historical timeline delivery delay, and vendor invoices validation match rates.
            </div>
          </div>

          {/* Followers and Reach Panels */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/50 shadow-premium space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Impact Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <Users className="h-5 w-5 text-indigo-500 mx-auto mb-2" />
                <span className="text-base font-extrabold text-slate-800 block">{ngo.followersCount}</span>
                <span className="text-[10px] text-slate-400 font-medium">Followers</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <Heart className="h-5 w-5 text-emerald-500 mx-auto mb-2" />
                <span className="text-base font-extrabold text-slate-800 block">{ngo.beneficiariesReached.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 font-medium">Lives Impacted</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
