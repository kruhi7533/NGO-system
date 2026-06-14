import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Calendar, Award, ArrowRight, ShieldCheck, Sparkles, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface StoryItem {
  id: string;
  name: string;
  age?: number;
  ngoId: string;
  ngoName: string;
  ngoLogo: string;
  category: string;
  location: string;
  image: string;
  need: string;
  support: string;
  outcome: string;
  metrics: { label: string; value: string }[];
}

export default function Stories() {
  const { ngos } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Healthcare', 'Education', 'Environment', 'Animal Welfare'];

  const stories: StoryItem[] = [
    {
      id: 's-1',
      name: 'Priya',
      age: 11,
      ngoId: 'ngo-1',
      ngoName: 'Sanjeevani Health Trust',
      ngoLogo: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=60',
      category: 'Healthcare',
      location: 'Udaipur, India',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600',
      need: 'Priya was suffering from severe chronic anemia and frequent dizzy spells, causing her to miss over 15 school days last month. Her family could not afford pediatric medical camps or nutritional therapies.',
      support: 'Received pediatric clinical diagnosis, free prescription medications, and a 3-month medical nutritional supplement kit funded by Udaipur campaign donors.',
      outcome: 'Her hemoglobin level recovered from 7.5 to 11.2 in four weeks. She is back in class with 95% attendance and active energy.',
      metrics: [
        { label: 'Hemoglobin Recovery', value: '+49% increase' },
        { label: 'School Attendance', value: '95% reached' },
        { label: 'Medication Cost', value: '₹1,500 sponsored' }
      ]
    },
    {
      id: 's-2',
      name: 'Amit',
      age: 13,
      ngoId: 'ngo-2',
      ngoName: 'Vidyoday Foundation',
      ngoLogo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=60',
      category: 'Education',
      location: 'Pune, India',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600',
      need: 'Amit had never touched a computer and was falling behind in STEM literacy courses at his government school in Pune. They had no smart boards or computers.',
      support: 'Vidyoday installed a high-speed computer lab router and desktop terminal in his school, and Amit attended daily 45-minute digital literacy classes.',
      outcome: 'He successfully completed our 12-week Scratch & Python logic certification course and improved his math grades significantly.',
      metrics: [
        { label: 'Digital Course Status', value: 'Certified' },
        { label: 'Math Grade Growth', value: '+30% improvement' },
        { label: 'Lab Equipment Share', value: '₹5,000 sponsored' }
      ]
    },
    {
      id: 's-3',
      name: 'Whitefield Miyawaki Mini Forest',
      ngoId: 'ngo-3',
      ngoName: 'Green Canopy Initiative',
      ngoLogo: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=60',
      category: 'Environment',
      location: 'Bengaluru, India',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
      need: 'An industrial layout in Whitefield suffered from high dust toxicity, extreme concrete heat loops, and zero green cover.',
      support: 'Enriched soil bed bedsmiy with coco-peat, biomass, planted 3,000 indigenous trees, and added metal security fencing.',
      outcome: 'A dense urban micro-forest has grown 10x faster than traditional trees, creating a carbon sink and cooling local layout temperature by 2 degrees.',
      metrics: [
        { label: 'Saplings Planted', value: '3,000 trees' },
        { label: 'Local Temperature', value: '-2°C decrease' },
        { label: 'Soil Bed Prep Share', value: '₹2,500 sponsored' }
      ]
    },
    {
      id: 's-4',
      name: 'Bruno',
      ngoId: 'ngo-4',
      ngoName: 'Paws & Tails Shelter',
      ngoLogo: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=60',
      category: 'Animal Welfare',
      location: 'Mumbai, India',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=600',
      need: 'Bruno, a stray street dog, suffered a fractured femur and dehydration after a hit-and-run accident in Mumbai suburbs.',
      support: 'Rushed to isolation ward, received veterinary orthopedic surgery, rabies vaccinations, and 3 weeks of recovery shelter care.',
      outcome: 'Successfully healed his leg, completed vaccinations, and was adopted by a loving family.',
      metrics: [
        { label: 'Injury Status', value: 'Fully Healed' },
        { label: 'Sterilized & Vaccinated', value: '100% Completed' },
        { label: 'Surgery & Meds Cost', value: '₹5,000 sponsored' }
      ]
    }
  ];

  const filteredStories = stories.filter(story => {
    if (selectedCategory === 'All') return true;
    return story.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen space-y-8">
      
      {/* Page Header */}
      <div className="text-left space-y-2 max-w-2xl">
        <h1 className="text-3xl font-display font-extrabold tracking-tight text-slate-900">
          Impact Stories
        </h1>
        <p className="text-sm text-slate-500">
          Real-world stories of lives changed, environments restored, and animals rehabilitated. Traced directly to donor ledger contributions.
        </p>
      </div>

      {/* Filter Stepper */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 border-b border-slate-200/60">
        <Filter className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-slate-950 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stories list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredStories.map((story) => (
          <div 
            key={story.id}
            className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col group"
          >
            {/* Story Banner */}
            <div className="h-64 overflow-hidden relative">
              <img 
                src={story.image} 
                alt={story.name} 
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-200/50 flex items-center gap-1.5 shadow-sm">
                <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wide">{story.category}</span>
              </div>
            </div>

            {/* Profile Info overlay */}
            <div className="p-6 flex-grow space-y-5 flex flex-col justify-between">
              
              <div className="space-y-4">
                {/* NGO header info */}
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                      <img src={story.ngoLogo} alt={story.ngoName} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-slate-850 hover:text-emerald-600 transition-colors">
                        <Link to={`/ngo/${story.ngoId}`}>{story.ngoName}</Link>
                      </h4>
                      <p className="text-[9px] text-slate-400 mt-0.5">{story.location}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                    <Sparkles className="h-3 w-3 fill-current text-indigo-500" />
                    Ledger Traced
                  </span>
                </div>

                {/* Need, Support, Outcome layout */}
                <div className="text-left space-y-3">
                  <h3 className="font-display font-extrabold text-slate-900 text-lg leading-tight">
                    {story.age ? `Meet ${story.name}, Age ${story.age}` : `${story.name}`}
                  </h3>
                  
                  <div className="space-y-2 text-xs text-slate-600">
                    <p className="leading-relaxed">
                      <span className="font-bold text-slate-800 uppercase block text-[9px] text-slate-400 mb-0.5">The Need</span>
                      {story.need}
                    </p>
                    <p className="leading-relaxed">
                      <span className="font-bold text-slate-800 uppercase block text-[9px] text-slate-400 mb-0.5">Support Provided</span>
                      {story.support}
                    </p>
                    <p className="leading-relaxed">
                      <span className="font-bold text-slate-800 uppercase block text-[9px] text-slate-400 mb-0.5">Verified Outcome</span>
                      {story.outcome}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metrics bar */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2">
                {story.metrics.map((m) => (
                  <div key={m.label} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">{m.label}</span>
                    <span className="text-[11px] font-extrabold text-slate-800 block mt-0.5 truncate">{m.value}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
