import React, { useState, useMemo } from 'react';
import { useStore, NGO } from '../../store/useStore';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Users, 
  Bookmark, 
  BookmarkCheck,
  Filter, 
  SlidersHorizontal,
  Award,
  Crown,
  TrendingUp,
  Heart,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Explore() {
  const { ngos, followedNgos, toggleFollowNGO } = useStore();

  const [activeTab, setActiveTab] = useState<'directory' | 'leaderboard'>('directory');
  
  // Directory state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [minTrustScore, setMinTrustScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('trustScore');

  // Leaderboard state
  const [leaderboardCategory, setLeaderboardCategory] = useState<string>('All');

  const categories = ['All', 'Healthcare', 'Education', 'Environment', 'Animal Welfare'];
  const locations = ['All', 'Ahmedabad, India', 'Pune, India', 'Bengaluru, India', 'Mumbai, India'];

  // Directory filter & sort
  const filteredNgos = useMemo(() => {
    return ngos
      .filter((ngo) => {
        const matchesSearch = ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              ngo.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              ngo.mission.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || ngo.category === selectedCategory;
        const matchesLocation = selectedLocation === 'All' || ngo.location === selectedLocation;
        const matchesVerified = !onlyVerified || ngo.verifiedStatus;
        const matchesTrust = ngo.trustScore >= minTrustScore;

        return matchesSearch && matchesCategory && matchesLocation && matchesVerified && matchesTrust;
      })
      .sort((a, b) => {
        if (sortBy === 'trustScore') return b.trustScore - a.trustScore;
        if (sortBy === 'followers') return b.followersCount - a.followersCount;
        if (sortBy === 'impact') return b.impactScore - a.impactScore;
        return 0;
      });
  }, [ngos, searchQuery, selectedCategory, selectedLocation, onlyVerified, minTrustScore, sortBy]);

  // Leaderboard sort lists
  const sortedLeaderboard = useMemo(() => {
    const list = leaderboardCategory === 'All' 
      ? ngos 
      : ngos.filter(n => n.category === leaderboardCategory);

    // Return different sub-leaderboard arrays
    const trusted = [...list].sort((a, b) => b.trustScore - a.trustScore);
    const impactful = [...list].sort((a, b) => b.impactScore - a.impactScore);
    const followed = [...list].sort((a, b) => b.followersCount - a.followersCount);

    return { trusted, impactful, followed };
  }, [ngos, leaderboardCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="text-left space-y-1">
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-slate-900">
            NGO Growth Registry
          </h1>
          <p className="text-xs text-slate-500">
            Discover audited organizations, view leaderboard metrics, and follow causes.
          </p>
        </div>

        {/* Directory vs Leaderboard Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 shrink-0">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'directory'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Directory List
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            NGO Leaderboards
          </button>
        </div>
      </div>

      {activeTab === 'directory' ? (
        /* ================= DIRECTORY TAB ================= */
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Toolbar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/50 shadow-premium space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
                />
              </div>

              <div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
                >
                  <option value="All">All Locations</option>
                  {locations.filter(l => l !== 'All').map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
                >
                  <option value="trustScore">Sort by: Trust Rating</option>
                  <option value="followers">Sort by: Followers</option>
                  <option value="impact">Sort by: Impact Index</option>
                </select>
              </div>
            </div>

            {/* Categories */}
            <div className="border-t border-slate-100 pt-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      selectedCategory === cat
                        ? 'bg-slate-950 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-600 border border-slate-200/40 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider controls */}
            <div className="border-t border-slate-100 pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div className="flex items-center gap-5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyVerified}
                    onChange={(e) => setOnlyVerified(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 fill-emerald-50" />
                    Verified Only
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-600">Min Trust:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={minTrustScore}
                    onChange={(e) => setMinTrustScore(Number(e.target.value))}
                    className="w-20 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/40">{minTrustScore}%</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono">
                Showing {filteredNgos.length} of {ngos.length} results
              </div>
            </div>

          </div>

          {/* Directory Grid (Compact Cards) */}
          {filteredNgos.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-premium">
              <Filter className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-700">No NGOs Matched</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Try clearing search text or lowering the minimum trust rating slider.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNgos.map((ngo) => {
                const isFollowing = followedNgos.includes(ngo.id);
                return (
                  <div
                    key={ngo.id}
                    className="bg-white rounded-3xl border border-slate-200/50 overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Banner */}
                      <div className="h-28 bg-slate-100 relative">
                        <img src={ngo.banner} alt={ngo.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/10" />

                        {/* Follow Icon Pin */}
                        <button
                          onClick={() => toggleFollowNGO(ngo.id)}
                          className={`absolute top-3 right-3 p-1.5 rounded-lg backdrop-blur-md transition-all border ${
                            isFollowing 
                              ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm' 
                              : 'bg-white/90 text-slate-650 hover:text-slate-900 border-white/20'
                          }`}
                        >
                          {isFollowing ? (
                            <BookmarkCheck className="h-3.5 w-3.5 fill-current" />
                          ) : (
                            <Bookmark className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Content block */}
                      <div className="p-5 relative pt-8 text-left">
                        {/* Logo overlay */}
                        <div className="absolute -top-7 left-5 w-12 h-12 rounded-xl bg-white border border-slate-200/80 p-0.5 shadow overflow-hidden">
                          <img src={ngo.logo} alt={ngo.name} className="w-full h-full object-cover rounded-lg" />
                        </div>

                        <div className="space-y-2 mt-1">
                          <div className="flex justify-between items-center text-[9px] font-bold">
                            <span className="text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-full capitalize">
                              {ngo.category}
                            </span>
                            <span className="text-slate-400 flex items-center gap-0.5">
                              <MapPin className="h-3 w-3" />
                              {ngo.location.split(',')[0]}
                            </span>
                          </div>

                          <h3 className="font-display font-extrabold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center gap-1">
                            {ngo.name}
                            {ngo.verifiedStatus && (
                              <span title="Audited and compliant">
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 fill-emerald-50 shrink-0" />
                              </span>
                            )}
                          </h3>

                          <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
                            {ngo.tagline}
                          </p>
                        </div>

                        {/* Scores metrics */}
                        <div className="grid grid-cols-3 gap-2 mt-4 pt-1">
                          <div className="bg-slate-50/50 p-1.5 rounded-xl text-center border border-slate-100">
                            <span className="block text-[8px] text-slate-400 font-bold uppercase">Trust</span>
                            <span className="text-xs font-extrabold text-emerald-600 block mt-0.5">{ngo.trustScore}%</span>
                          </div>
                          <div className="bg-slate-50/50 p-1.5 rounded-xl text-center border border-slate-100">
                            <span className="block text-[8px] text-slate-400 font-bold uppercase">Impact</span>
                            <span className="text-xs font-extrabold text-indigo-650 block mt-0.5">{ngo.impactScore}%</span>
                          </div>
                          <div className="bg-slate-50/50 p-1.5 rounded-xl text-center border border-slate-100">
                            <span className="block text-[8px] text-slate-400 font-bold uppercase">Success</span>
                            <span className="text-xs font-extrabold text-slate-800 block mt-0.5">{ngo.campaignSuccessRate}%</span>
                          </div>
                        </div>

                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                      <div className="flex gap-3">
                        <span>{ngo.followersCount} Followers</span>
                        <span>{ngo.projectsCompleted} Projects completed</span>
                      </div>

                      <Link
                        to={`/ngo/${ngo.id}`}
                        className="text-slate-700 hover:text-emerald-700 font-bold flex items-center gap-0.5"
                      >
                        View Audit
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      ) : (
        /* ================= LEADERBOARD TAB ================= */
        <div className="space-y-8 animate-in fade-in duration-200 text-left">
          
          {/* Leaderboard controls */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/50 shadow-premium flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="text-left">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">NGO Ranks Console</h2>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Rankings refresh daily based on active auditing evidence uploads.</p>
            </div>
            
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setLeaderboardCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                    leaderboardCategory === cat
                      ? 'bg-slate-950 text-white'
                      : 'bg-slate-50 text-slate-500 border border-slate-200/40 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. Top Trusted */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-premium space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Crown className="h-4 w-4 fill-current" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-slate-900 text-sm">Top Trusted NGOs</h3>
                  <p className="text-[9px] text-slate-400">Sorted by verified Trust Rating</p>
                </div>
              </div>

              <div className="space-y-3.5">
                {sortedLeaderboard.trusted.map((ngo, idx) => (
                  <div key={ngo.id} className="flex justify-between items-center p-2 rounded-2xl hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 text-center font-mono text-xs font-bold ${
                        idx === 0 ? 'text-amber-500 font-extrabold text-sm' : idx === 1 ? 'text-slate-400' : 'text-slate-300'
                      }`}>
                        #{idx + 1}
                      </span>
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-100 shrink-0">
                        <img src={ngo.logo} alt={ngo.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-slate-800 leading-snug hover:text-emerald-600">
                          <Link to={`/ngo/${ngo.id}`}>{ngo.name}</Link>
                        </h4>
                        <span className="text-[9px] text-slate-400 capitalize">{ngo.category}</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600 font-display shrink-0">{ngo.trustScore}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Top Impact */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-premium space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Award className="h-4 w-4 fill-current" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-slate-900 text-sm">Top Impact Index</h3>
                  <p className="text-[9px] text-slate-400">Sorted by Goal Completion rates</p>
                </div>
              </div>

              <div className="space-y-3.5">
                {sortedLeaderboard.impactful.map((ngo, idx) => (
                  <div key={ngo.id} className="flex justify-between items-center p-2 rounded-2xl hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 text-center font-mono text-xs font-bold ${
                        idx === 0 ? 'text-amber-500 font-extrabold text-sm' : idx === 1 ? 'text-slate-400' : 'text-slate-300'
                      }`}>
                        #{idx + 1}
                      </span>
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-100 shrink-0">
                        <img src={ngo.logo} alt={ngo.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-slate-800 leading-snug hover:text-indigo-650">
                          <Link to={`/ngo/${ngo.id}`}>{ngo.name}</Link>
                        </h4>
                        <span className="text-[9px] text-slate-400 capitalize">{ngo.category}</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-indigo-650 font-display shrink-0">{ngo.impactScore}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Most Followed */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-premium space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-slate-900 text-sm">Most Followed NGOs</h3>
                  <p className="text-[9px] text-slate-400">Sorted by Supporter Communities size</p>
                </div>
              </div>

              <div className="space-y-3.5">
                {sortedLeaderboard.followed.map((ngo, idx) => (
                  <div key={ngo.id} className="flex justify-between items-center p-2 rounded-2xl hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 text-center font-mono text-xs font-bold ${
                        idx === 0 ? 'text-amber-500 font-extrabold text-sm' : idx === 1 ? 'text-slate-400' : 'text-slate-300'
                      }`}>
                        #{idx + 1}
                      </span>
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-100 shrink-0">
                        <img src={ngo.logo} alt={ngo.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-slate-800 leading-snug hover:text-slate-900">
                          <Link to={`/ngo/${ngo.id}`}>{ngo.name}</Link>
                        </h4>
                        <span className="text-[9px] text-slate-400 capitalize">{ngo.category}</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-slate-800 font-display shrink-0">{ngo.followersCount}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
