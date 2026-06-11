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
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImpactFeed() {
  const { feedPosts, ngos } = useStore();
  const [posts, setPosts] = useState<FeedPost[]>(feedPosts);
  const [filterType, setFilterType] = useState<string>('all');
  
  // Track toggle states for AI summary vs raw evidence for each post
  // key: postId, value: 'ai' | 'raw'
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
    { label: 'Proof Uploads', value: 'evidence' },
    { label: 'Success Stories', value: 'story' },
    { label: 'Milestones', value: 'milestone' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 min-h-screen">
      
      {/* Header */}
      <div className="text-left mb-8 space-y-2">
        <h1 className="text-3xl font-display font-extrabold tracking-tight text-slate-900">
          Live Impact Feed
        </h1>
        <p className="text-sm text-slate-500">
          Real-time updates posted by NGOs directly from the field. Audited by automated models and platform compliance representatives.
        </p>
      </div>

      {/* Feed Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 border-b border-slate-200/60">
        <Filter className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilterType(btn.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
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
      <div className="space-y-8">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-premium">
            <Info className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-700">No Posts in this Category</h3>
            <p className="text-xs text-slate-400 mt-1">Check back later for recent uploads.</p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const currentMode = viewModes[post.id] || 'ai';
            const matchingNgo = ngos.find(n => n.id === post.ngoId);

            return (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-premium space-y-5 p-6"
              >
                {/* 1. Header: NGO Details & Post category label */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Link to={`/ngo/${post.ngoId}`} className="w-11 h-11 rounded-2xl overflow-hidden border border-slate-200/50 block shrink-0 hover:scale-102 transition-transform">
                      <img src={post.ngoLogo} alt={post.ngoName} className="w-full h-full object-cover" />
                    </Link>
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-slate-900 hover:text-emerald-600 transition-colors">
                        <Link to={`/ngo/${post.ngoId}`}>{post.ngoName}</Link>
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium block mt-0.5 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.timestamp}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase ${
                    post.type === 'evidence'
                      ? 'bg-violet-50 text-violet-700 border-violet-100'
                      : post.type === 'story'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {post.type === 'evidence' ? 'Proof Uploaded' : post.type === 'story' ? 'Impact Story' : 'Milestone'}
                  </span>
                </div>

                {/* 2. Headline & Content */}
                <div className="space-y-2.5 text-left">
                  <h3 className="font-display font-extrabold text-slate-900 text-base sm:text-lg leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* 3. Image Graphic */}
                {post.image && (
                  <div className="rounded-2xl overflow-hidden border border-slate-200/80 max-h-80 sm:max-h-96">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* 4. AI Verification & Raw Evidence Tab panel (only for evidence or story post type) */}
                {post.type === 'evidence' && (
                  <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
                    
                    {/* Mode Steppers */}
                    <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleViewMode(post.id, 'ai')}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            currentMode === 'ai'
                              ? 'bg-violet-600 text-white shadow-sm'
                              : 'bg-white text-slate-600 border border-slate-200/40 hover:bg-slate-100'
                          }`}
                        >
                          <Sparkles className="h-3 w-3 inline-block mr-1 fill-current" />
                          AI Summary
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleViewMode(post.id, 'raw')}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            currentMode === 'raw'
                              ? 'bg-slate-900 text-white shadow-sm'
                              : 'bg-white text-slate-600 border border-slate-200/40 hover:bg-slate-100'
                          }`}
                        >
                          <FileText className="h-3.5 w-3.5 inline-block mr-1" />
                          Raw Evidence
                        </button>
                      </div>

                      <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">
                        Audited reference: REF-{post.id.toUpperCase()}
                      </span>
                    </div>

                    {/* Mode Panel Details */}
                    <div className="p-4 bg-white text-left">
                      {currentMode === 'ai' ? (
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-violet-700">
                            <Sparkles className="h-3.5 w-3.5 fill-current text-violet-500 animate-pulse" />
                            Artificial Intelligence Verification Audit
                          </div>
                          <p className="text-xs text-violet-600 leading-relaxed font-medium">
                            {post.aiSummary || 'Document scan matches disbursement ledger records. Geographical telemetry matches school smart-lab site. Content approved.'}
                          </p>
                          <div className="flex items-center gap-2 pt-1 text-[9px] text-emerald-600 font-bold bg-emerald-50 w-fit px-2 py-0.5 rounded">
                            <CheckCircle className="h-3 w-3 fill-current" />
                            Checksum Passed: ledger matches invoices
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4.5 w-4.5 text-slate-400" />
                              <div className="text-left">
                                <span className="block text-xs font-semibold text-slate-700">{post.document?.name || 'receipt_invoice_po.pdf'}</span>
                                <span className="block text-[9px] text-slate-400 font-mono mt-0.5">{post.document?.size || '250 KB'}</span>
                              </div>
                            </div>
                            <button className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 border border-slate-200 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1">
                              <Download className="h-3.5 w-3.5" />
                              Download File
                            </button>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <Info className="h-4 w-4 shrink-0" />
                            <span>This receipt was cross-referenced in the transparency registry with verified vendor GSTIN numbers.</span>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* 5. Footer Buttons: Like, Comment, Share */}
                <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs">
                  
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center justify-center gap-1.5 font-bold transition-colors ${
                      post.hasLiked 
                        ? 'text-emerald-600' 
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <ThumbsUp className={`h-4.5 w-4.5 ${post.hasLiked ? 'fill-current' : ''}`} />
                    <span>{post.likes} Likes</span>
                  </button>

                  <button className="flex items-center justify-center gap-1.5 font-bold text-slate-500 hover:text-slate-900 cursor-not-allowed">
                    <MessageSquare className="h-4.5 w-4.5" />
                    <span>{post.comments} Comments</span>
                  </button>

                  <button className="flex items-center justify-center gap-1.5 font-bold text-slate-500 hover:text-slate-900">
                    <Share2 className="h-4.5 w-4.5" />
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
