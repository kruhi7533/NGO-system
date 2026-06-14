import React, { useState } from 'react';
import { useStore, FeedPost } from '../../store/useStore';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  FileText, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Download,
  Info,
  Calendar,
  Filter,
  CheckCircle,
  ShieldCheck,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImpactFeed() {
  const { feedPosts, ngos } = useStore();
  const [posts, setPosts] = useState<FeedPost[]>(() => {
    // Inject custom mock posts including Before/After images and Audit Updates for Redesign 3.0
    const redesignPosts: FeedPost[] = [
      {
        id: 'p-audit-1',
        ngoId: 'ngo-4',
        ngoName: 'Paws & Tails Shelter',
        ngoLogo: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=60',
        type: 'audit',
        title: 'Independent Auditor Report: hospital Expansion Phase 1 Passed',
        content: 'Auditor Sarah Jenkins completed physical site inspection of the critical isolation ward. All 8 cages were built using medical-grade stainless steel matching invoice PO-2026-081. Financial ledger values match disbursements with zero deviations.',
        timestamp: '2 hours ago',
        aiSummary: 'Independent external audit validated. Site coordinates match registered shelter address. Ledger cleared.',
        likes: 12,
        comments: 1,
        hasLiked: false
      },
      {
        id: 'p-before-after-1',
        ngoId: 'ngo-2',
        ngoName: 'Vidyoday Foundation',
        ngoLogo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=60',
        type: 'milestone',
        title: 'Before & After: Smart classroom Conversion in Ambegaon School',
        content: 'See the impact of your contributions! Thanks to our digital labs campaign donors, we transformed a bare storage room with zero connectivity into a modern digital learning center for 150 girls. Computers are online and solar batteries fully configured.',
        timestamp: '1 day ago',
        beforeImage: 'https://images.unsplash.com/photo-1577896851231-70ee18881754?auto=format&fit=crop&q=80&w=500',
        afterImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=500',
        likes: 84,
        comments: 9,
        hasLiked: false
      },
      ...feedPosts
    ];
    return redesignPosts;
  });

  const [filterType, setFilterType] = useState<string>('all');
  const [viewModes, setViewModes] = useState<Record<string, 'ai' | 'raw'>>({});

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const hasLiked = !post.hasLiked;
        return {
          ...post,
          hasLiked,
          likes: post.likes + (hasLiked ? 1 : -1)
        };
      }
      return post;
    }));
  };

  const toggleViewMode = (postId: string, mode: 'ai' | 'raw') => {
    setViewModes(prev => ({ ...prev, [postId]: mode }));
  };

  const filteredPosts = posts.filter(post => {
    if (filterType === 'all') return true;
    return post.type === filterType;
  });

  const filterButtons = [
    { label: 'All Updates', value: 'all' },
    { label: 'Proofs / Bills', value: 'evidence' },
    { label: 'Audits', value: 'audit' },
    { label: 'Success Stories', value: 'story' },
    { label: 'Milestones', value: 'milestone' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 min-h-screen font-sans space-y-6">
      
      {/* Header */}
      <div className="text-left space-y-1">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-slate-900">
          Live Impact Feed
        </h1>
        <p className="text-xs text-slate-500">
          Traceable field logs, audited invoices, before/after metrics, and regulatory checks in a unified community stream.
        </p>
      </div>

      {/* Feed Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 border-b border-slate-200/60">
        <Filter className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilterType(btn.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              filterType === btn.value
                ? 'bg-slate-950 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Posts list */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-premium">
            <Info className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-700">No updates found</h3>
            <p className="text-xs text-slate-450 mt-1">Try selecting a different filter category.</p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const currentMode = viewModes[post.id] || 'ai';
            const isAudit = post.type === 'audit';

            return (
              <motion.div
                key={post.id}
                layout
                className={`bg-white rounded-3xl border overflow-hidden shadow-premium space-y-4 p-5 text-left transition-all ${
                  isAudit 
                    ? 'border-amber-250 bg-amber-50/5' 
                    : 'border-slate-200/60'
                }`}
              >
                {/* 1. Post Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <Link to={`/ngo/${post.ngoId}`} className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200/50 block shrink-0">
                      <img src={post.ngoLogo} alt={post.ngoName} className="w-full h-full object-cover" />
                    </Link>
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-slate-900 hover:text-emerald-700">
                        <Link to={`/ngo/${post.ngoId}`}>{post.ngoName}</Link>
                      </h4>
                      <p className="text-[9px] text-slate-400 font-medium block mt-0.5 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.timestamp}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                    isAudit
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : post.type === 'evidence'
                      ? 'bg-violet-50 text-violet-750 border-violet-100'
                      : post.type === 'story'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                  }`}>
                    {post.type}
                  </span>
                </div>

                {/* 2. Content */}
                <div className="space-y-1.5 text-left">
                  <h3 className="font-display font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-650 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* 3. Before/After Visual Side-by-Side Panel */}
                {post.beforeImage && post.afterImage && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-2xl overflow-hidden border border-slate-200 relative h-36 sm:h-44 bg-slate-50">
                      <img src={post.beforeImage} alt="Before conversion" className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[8px] uppercase tracking-wide font-extrabold">
                        Before
                      </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-slate-200 relative h-36 sm:h-44 bg-slate-50">
                      <img src={post.afterImage} alt="After conversion" className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-emerald-500/90 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[8px] uppercase tracking-wide font-extrabold">
                        After
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Single Image Graphic */}
                {post.image && !post.beforeImage && (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-72">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* 5. Injected AI Compliance Summaries */}
                {post.type === 'evidence' && (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2 text-[9px] font-bold">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => toggleViewMode(post.id, 'ai')}
                          className={`px-2 py-0.5 rounded transition-all ${
                            currentMode === 'ai'
                              ? 'bg-violet-600 text-white shadow-sm'
                              : 'bg-white text-slate-500 border border-slate-200/40 hover:bg-slate-100'
                          }`}
                        >
                          AI Summary
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleViewMode(post.id, 'raw')}
                          className={`px-2 py-0.5 rounded transition-all ${
                            currentMode === 'raw'
                              ? 'bg-slate-900 text-white shadow-sm'
                              : 'bg-white text-slate-500 border border-slate-200/40 hover:bg-slate-100'
                          }`}
                        >
                          Raw Invoice
                        </button>
                      </div>
                      <span className="font-mono text-slate-450 uppercase">REF-{post.id.slice(0, 8)}</span>
                    </div>

                    <div className="p-3 bg-white text-left text-xs">
                      {currentMode === 'ai' ? (
                        <div className="space-y-1.5">
                          <p className="text-violet-600 font-semibold flex items-center gap-1">
                            <Sparkles className="h-3.5 w-3.5 fill-current text-violet-500" />
                            AI Audit check passed:
                          </p>
                          <p className="text-[11px] leading-relaxed text-slate-600 font-medium">
                            {post.aiSummary}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs py-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4.5 w-4.5 text-slate-400" />
                            <span className="font-semibold text-slate-700">{post.document?.name} ({post.document?.size})</span>
                          </div>
                          <button className="text-slate-450 hover:text-slate-700 p-1 flex items-center gap-0.5 font-bold">
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 6. Injected Audit Alerts */}
                {isAudit && (
                  <div className="p-3 bg-amber-50/60 border border-amber-250/50 rounded-2xl flex gap-2 text-xs">
                    <AlertTriangle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1 text-left">
                      <span className="font-bold text-amber-800 uppercase block text-[9px]">Platform compliance alert</span>
                      <p className="text-[11px] leading-normal text-amber-700 font-medium">
                        {post.aiSummary || 'Platform auditor completed the validation check. Serial check confirms structural materials correspond to hospital blueprints.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* 7. Footer Interactions */}
                <div className="border-t border-slate-50 pt-3 flex justify-between items-center text-[11px] font-bold">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 transition-colors ${
                      post.hasLiked 
                        ? 'text-emerald-600' 
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <ThumbsUp className={`h-4 w-4 ${post.hasLiked ? 'fill-current' : ''}`} />
                    <span>{post.likes} Likes</span>
                  </button>

                  <button className="flex items-center gap-1 text-slate-450 cursor-not-allowed">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments} Comments</span>
                  </button>

                  <button className="flex items-center gap-1 text-slate-450 hover:text-slate-800">
                    <Share2 className="h-4 w-4" />
                    <span>Share Link</span>
                  </button>
                </div>

              </motion.div>
            );
          })
        )}
      </div>

    </div>
  );
}
