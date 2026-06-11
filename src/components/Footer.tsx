import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-emerald-500 text-white p-1.5 rounded-lg">
                <Heart className="h-4 w-4 fill-current" />
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                IMPARENCY
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Discover trusted NGOs. Track every donation live. See direct proof of the impact you create. Join the new era of radical transparency in social good.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="h-4 w-4" />
              <span>All registered NGOs are certified 12A, 80G, and PAN audited.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">Explore NGOs</Link>
              </li>
              <li>
                <Link to="/feed" className="hover:text-white transition-colors">Live Impact Feed</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">Our Mission</Link>
              </li>
              <li>
                <span className="text-slate-600 cursor-not-allowed">Partner Integration (SaaS)</span>
              </li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Transparency Audits</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">NGO Guidelines</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">API Documentation</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Donor Safety Policy</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>© {new Date().getFullYear()} Imparency Inc. Frontend-only interactive demonstration.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Security Disclosure</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
