import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, CornerDownLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  links?: { label: string; url: string }[];
}

export default function AIAssistant() {
  const navigate = useNavigate();
  const { ngos, campaigns, trackedDonations } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Hello! I am your AI Transparency Assistant. I can trace your donation routing, inspect invoices, verify compliance status, or recommend top-trusted NGOs. What would you like to audit today?",
      timestamp: 'Just now'
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const presets = [
    { label: 'Where did my ₹5,000 donation go?', q: 'Where did my ₹5,000 donation go?' },
    { label: 'Verify invoice for Vidyoday digital labs', q: 'Verify invoice for Vidyoday digital labs' },
    { label: 'Recommend a high-trust healthcare NGO', q: 'Recommend a high-trust healthcare NGO' },
    { label: 'Verify FCRA status for Green Canopy', q: 'Verify FCRA status for Green Canopy' },
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // User Message
    const userMsg: Message = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      setIsTyping(false);
      const reply = generateAIResponse(text);
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  const generateAIResponse = (query: string): Message => {
    const text = query.toLowerCase();
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Response 1: Donation trace
    if (text.includes('5,000') || text.includes('where did my') || text.includes('tr-1')) {
      const don = trackedDonations.find(d => d.id === 'tr-1');
      if (don) {
        return {
          sender: 'ai',
          text: `Found receipt trace for ${don.campaignTitle} by ${don.ngoName}.\n\nAllocation Status: ${don.currentStage}\nDonation Value: ₹${don.amount.toLocaleString()}\n\nLedger Path:\n1. Donation Received on 2026-06-05\n2. Allocated to PO-2026-049 on 2026-06-06\n3. Router switches and keyboards purchased. Invoice verified on 2026-06-09.\n\nAI Checksum matches: 100% of funds matched direct vendor invoice items.`,
          timestamp: timestampStr,
          links: [{ label: 'View Tracking in Portfolio', url: '/donor' }]
        };
      }
    }

    // Response 2: Invoice check
    if (text.includes('invoice') || text.includes('vidyoday') || text.includes('bill')) {
      return {
        sender: 'ai',
        text: `Inspecting invoice registry for Vidyoday Foundation:\n\nReference Invoice: PO-2026-049_Vidyoday.pdf\nIssuer: Netlink Hardware Distributors\nDate: 2026-06-09\nItems matched: 20 Netlink Routers, 15 Mechanical Keyboards, 5 Server Hubs.\n\nAudit Check: The items correspond exactly to the equipment listed in "Digital Labs for Rural Girls" targets. Geo-tag telemetry confirms delivery to Ambegaon High School district coordinates (19.0118° N, 73.8562° E).`,
        timestamp: timestampStr,
        links: [
          { label: 'Vidyoday Profile', url: '/ngo/ngo-2' },
          { label: 'View Updates Feed', url: '/feed' }
        ]
      };
    }

    // Response 3: Recommend Healthcare
    if (text.includes('recommend') || text.includes('healthcare') || text.includes('health')) {
      const sanj = ngos.find(n => n.id === 'ngo-1');
      return {
        sender: 'ai',
        text: `I recommend the "${sanj?.name || 'Sanjeevani Health Trust'}".\n\nTrust Score: ${sanj?.trustScore || 94}%\nTransparency Rating: ${sanj?.transparencyScore || 96}%\nVerification Status: Fully Audited (12A, 80G, PAN, FCRA Approved)\nRisk Rating: Low Risk\n\nThey run Pediatric camps treat rural clinics with live utilization invoice uploads.`,
        timestamp: timestampStr,
        links: [
          { label: 'Sanjeevani Profile', url: '/ngo/ngo-1' },
          { label: 'Explore Healthcare Campaigns', url: '/explore' }
        ]
      };
    }

    // Response 4: FCRA status Green Canopy
    if (text.includes('fcra') || text.includes('green canopy') || text.includes('environment')) {
      const gc = ngos.find(n => n.id === 'ngo-3');
      return {
        sender: 'ai',
        text: `Auditing compliance registry for ${gc?.name || 'Green Canopy Initiative'}:\n\nPAN: Approved\n80G: Approved\n12A: Approved\nFCRA status: Not Submitted\n\nAnalysis: Since they focus on domestic tree-planting saplings, foreign funding (FCRA) is currently not submitted. This is typical for national organizations and does not pose a financial risk. Their overall Trust score is ${gc?.trustScore || 89}%.`,
        timestamp: timestampStr,
        links: [{ label: 'Green Canopy Profile', url: '/ngo/ngo-3' }]
      };
    }

    // Fallback general response
    return {
      sender: 'ai',
      text: "I searched our ledger nodes and compliance database, but couldn't find a direct match. Try asking about:\n- 'Where did my ₹5,000 go?'\n- 'Verify invoice Vidyoday'\n- 'Recommend a high-trust health NGO'\n- 'Verify FCRA status for Green Canopy'",
      timestamp: timestampStr
    };
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white flex items-center justify-center shadow-xl border border-violet-500/20 hover:shadow-glow-secondary duration-300 relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <X className="h-6 w-6" key="close" />
          ) : (
            <div className="relative" key="open">
              <Sparkles className="h-6 w-6 fill-current animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
            </div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="absolute right-0 bottom-18 w-96 max-h-[500px] h-[500px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col glass-dark text-slate-100 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-tr from-violet-500 to-indigo-500 text-white rounded-xl">
                  <Bot className="h-5 w-5 fill-current" />
                </div>
                <div className="text-left">
                  <h3 className="font-display font-extrabold text-sm text-white flex items-center gap-1.5">
                    AI Transparency Assistant
                    <span className="text-[9px] bg-violet-900/50 text-violet-300 px-1.5 py-0.5 rounded border border-violet-800/40">Ledger API</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Auditing invoices & compliance docs</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 items-start ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`p-1.5 rounded-lg shrink-0 border ${
                    msg.sender === 'user'
                      ? 'bg-slate-800 border-slate-700 text-slate-300'
                      : 'bg-violet-950/40 border-violet-900/30 text-violet-300'
                  }`}>
                    {msg.sender === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </div>

                  <div className="space-y-2 max-w-[80%]">
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed text-left whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-slate-800 text-slate-200 rounded-tr-none'
                        : 'bg-slate-900/80 border border-slate-800 text-slate-300 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>

                    {/* Links attached */}
                    {msg.links && (
                      <div className="flex flex-col gap-1.5 pt-1">
                        {msg.links.map((link) => (
                          <button
                            key={link.label}
                            onClick={() => {
                              navigate(link.url);
                              setIsOpen(false);
                            }}
                            className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 w-fit transition-colors group"
                          >
                            {link.label}
                            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 items-center">
                  <div className="p-1.5 rounded-lg bg-violet-950/40 border border-violet-900/30 text-violet-300 shrink-0">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-2xl rounded-tl-none flex gap-1 items-center">
                    <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce" />
                    <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Presets list (only when input is empty and no custom chat yet) */}
            {messages.length === 1 && !isTyping && (
              <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800">
                <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-2 text-left">Suggested Audits</span>
                <div className="flex flex-wrap gap-1.5 pb-2">
                  {presets.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handleSend(p.q)}
                      className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 text-left rounded-xl text-[10px] text-slate-400 hover:text-white transition-all w-full leading-normal"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message input */}
            <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex gap-2 shrink-0">
              <input
                type="text"
                placeholder="Ask transparency ledger questions..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-850 bg-slate-900 text-slate-100 placeholder-slate-500"
              />
              <button
                type="button"
                onClick={() => handleSend(input)}
                className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
