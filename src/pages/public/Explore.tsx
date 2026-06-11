import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Users, 
  Bookmark, 
  Filter, 
  SlidersHorizontal,
  BookmarkCheck,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Explore() {
  const { ngos, followedNgos, toggleFollowNGO } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [minTrustScore, setMinTrustScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('trustScore');

  const categories = ['All', 'Healthcare', 'Education', 'Environment', 'Women Empowerment', 'Child Welfare', 'Animal Welfare', 'Disaster Relief'];
  const locations = ['All', 'Ahmedabad, India', 'Pune, India', 'Bengaluru, India', 'Mumbai, India'];

  // Filter & Sort Logic
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      
      {/* Page Header */}
      <div className="text-left mb-8 space-y-2">
        <h1 className="text-3xl font-display font-extrabold tracking-tight text-slate-900">
          Discover Trustworthy NGOs
        </h1>
        <p className="text-sm text-slate-500 max-w-xl">
          Search and inspect credentials of organizations committed to real accountability. Click follow to stay updated in your feed.
        </p>
      </div>

      {/* Filter Toolbar Panel */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-premium space-y-4 mb-8">
        
        {/* Search and Sort */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, cause, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            />
          </div>

          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
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
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <option value="trustScore">Sort by: Trust Score</option>
              <option value="followers">Sort by: Followers</option>
              <option value="impact">Sort by: Impact Index</option>
            </select>
          </div>
        </div>

        {/* Category Filter Stepper */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 border border-slate-200/40 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary sliders & toggles */}
        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            
            {/* Verified Only Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600 fill-emerald-50" />
                Verified NGOs Only
              </span>
            </label>

            {/* Min Trust Slider */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Min Trust Score:</span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={minTrustScore}
                onChange={(e) => setMinTrustScore(Number(e.target.value))}
                className="w-24 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/40">{minTrustScore}%</span>
            </div>

          </div>

          <div className="text-xs text-slate-400 font-semibold font-mono">
            Showing {filteredNgos.length} of {ngos.length} Results
          </div>
        </div>

      </div>

      {/* Grid List */}
      {filteredNgos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-premium">
          <Filter className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 text-lg">No Results Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Try widening your search terms or relaxing filter options like the minimum trust score.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNgos.map((ngo) => {
            const isFollowing = followedNgos.includes(ngo.id);
            return (
              <motion.div
                key={ngo.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl border border-slate-200/50 overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Banner & Logo */}
                  <div className="h-32 bg-slate-100 relative">
                    <img src={ngo.banner} alt={ngo.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/10" />
                    
                    {/* Follow Pin */}
                    <button
                      onClick={() => toggleFollowNGO(ngo.id)}
                      className={`absolute top-4 right-4 p-2 rounded-xl backdrop-blur-md transition-all border ${
                        isFollowing 
                          ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm shadow-emerald-500/20' 
                          : 'bg-white/90 text-slate-600 hover:text-slate-900 border-white/20 hover:scale-105'
                      }`}
                    >
                      {isFollowing ? (
                        <BookmarkCheck className="h-4 w-4 fill-current" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 relative pt-10">
                    {/* Logo Overlay */}
                    <div className="absolute -top-8 left-6 w-16 h-16 rounded-2xl bg-white border border-slate-200/80 p-1 shadow-md overflow-hidden">
                      <img src={ngo.logo} alt={ngo.name} className="w-full h-full object-cover rounded-xl" />
                    </div>

                    <div className="space-y-3 mt-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-full capitalize">
                          {ngo.category}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                          <MapPin className="h-3 w-3" />
                          {ngo.location.split(',')[0]}
                        </div>
                      </div>

                      <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                        {ngo.name}
                        {ngo.verifiedStatus && (
                          <span title="Transparency Audited">
                            <ShieldCheck className="h-4 w-4 text-emerald-500 fill-emerald-50 shrink-0" />
                          </span>
                        )}
                      </h3>

                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                        {ngo.tagline}
                      </p>
                    </div>

                    {/* Quality Badges */}
                    <div className="grid grid-cols-3 gap-2.5 mt-5">
                      <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-100">
                        <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Trust</span>
                        <span className="text-xs font-extrabold text-emerald-600 block mt-0.5">{ngo.trustScore}%</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-100">
                        <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Transparency</span>
                        <span className="text-xs font-extrabold text-indigo-600 block mt-0.5">{ngo.transparencyScore}%</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-100">
                        <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Impact</span>
                        <span className="text-xs font-extrabold text-slate-700 block mt-0.5">{ngo.impactScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-6 pt-0 border-t border-slate-50 mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>{ngo.followersCount} Followers</span>
                  </div>

                  <Link
                    to={`/ngo/${ngo.id}`}
                    className="px-4 py-2 text-xs font-bold text-slate-800 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200/80 hover:border-emerald-200/40 rounded-xl transition-all"
                  >
                    View Audit Profile
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
}
