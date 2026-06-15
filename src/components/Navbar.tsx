import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useAuth } from '../hooks/useAuth';
import {
  Heart,
  Bell,
  Menu,
  X,
  LogOut
} from 'lucide-react';

export default function Navbar() {
  const { currentRole, notifications, markNotificationsAsRead } = useStore();
  const { user, signOut } = useAuth();
  const isAuthenticated = !!user;
  const [isOpen, setIsOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    await signOut();
    setShowProfileMenu(false);
    navigate('/');
  };

  // Dynamic Navigation Links based on role
  const getNavLinks = () => {
    switch (currentRole) {
      case 'DONOR':
        return [
          { label: 'Explore NGOs', path: '/explore' },
          { label: 'Impact Feed', path: '/feed' },
          { label: 'My Impact', path: '/donor' },
        ];
      case 'NGO':
        return [
          { label: 'Dashboard', path: '/ngo' },
          { label: 'Campaigns', path: '/ngo/campaign-manager' },
          { label: 'Impact Feed', path: '/feed' },
        ];
      case 'ADMIN':
        return [
          { label: 'Auditing Console', path: '/admin' },
          { label: 'Impact Feed', path: '/feed' },
        ];
      default:
        return [
          { label: 'Home', path: '/' },
          { label: 'Explore NGOs', path: '/explore' },
          { label: 'Impact Feed', path: '/feed' },
          { label: 'Success Stories', path: '/stories' },
          { label: 'About Us', path: '/about' },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-emerald-500 text-white p-1.5 rounded-lg flex items-center justify-center shadow-md">
                <Heart className="h-4.5 w-4.5 fill-current" />
              </div>
              <span className="font-display font-extrabold text-lg tracking-tight text-slate-900">
                IMPARENCY
              </span>
              {isAuthenticated && (
                <span className="text-[9px] bg-slate-900 text-slate-200 px-1.5 py-0.5 rounded capitalize font-mono font-semibold">
                  {currentRole.toLowerCase()}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-7">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-bold transition-all ${
                  location.pathname === link.path 
                    ? 'text-emerald-600 font-extrabold border-b-2 border-emerald-500 py-4 translate-y-[2px]' 
                    : 'text-slate-500 hover:text-slate-900 hover:translate-y-[-1px] duration-150'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Notifications */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotif(!showNotif);
                    if (!showNotif) markNotificationsAsRead();
                  }}
                  className="relative p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <Bell className="h-4.5 w-4.5" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent-500 ring-2 ring-white animate-pulse" />
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotif && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-950 text-slate-200 rounded-2xl shadow-xl border border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="px-4 py-2 border-b border-slate-850 flex justify-between items-center bg-slate-900/50">
                      <span className="font-semibold text-xs text-white">Notifications</span>
                      <span className="text-[9px] bg-slate-850 text-slate-400 px-2 py-0.5 rounded-full font-medium">
                        {notifications.length} Total
                      </span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-500">No notifications yet</div>
                      ) : (
                        notifications.map((n) => (
                          <div 
                            key={n.id} 
                            className={`px-4 py-3 hover:bg-slate-900/50 border-b border-slate-900 last:border-b-0 transition-colors cursor-pointer ${
                              !n.read ? 'bg-violet-950/20' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="text-[11px] font-bold text-white flex items-center gap-1.5">
                                {n.type === 'donation' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                                {n.type === 'verification' && <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />}
                                {n.type === 'milestone' && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
                                {n.title}
                              </h4>
                              <span className="text-[9px] text-slate-500">{n.timestamp}</span>
                            </div>
                            <p className="text-slate-400 text-[10px] mt-1 leading-relaxed">{n.description}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Avatar / Login CTA */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 pl-2 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                    {currentRole.slice(0, 2)}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-bold text-slate-800 leading-none">
                      {currentRole === 'DONOR' ? 'Donor Account' : currentRole === 'NGO' ? 'NGO Account' : 'Admin'}
                    </span>
                    <span className="text-[9px] text-slate-400 leading-none mt-1">Workspace</span>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-50">
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase">Active Profile</span>
                      <span className="block text-xs font-bold text-slate-800 mt-0.5">
                        {currentRole === 'DONOR' ? 'Sponsor Account' : currentRole === 'NGO' ? 'NGO Dashboard' : 'Platform Auditor'}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1.5 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/get-started"
                  className="px-3.5 py-2 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-xl transition-all shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}

          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center md:hidden space-x-2">
            {isAuthenticated && (
              <button
                onClick={() => {
                  setShowNotif(!showNotif);
                  if (!showNotif) markNotificationsAsRead();
                }}
                className="relative p-1.5 text-slate-500 hover:text-slate-900 rounded-xl"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-accent-500" />
                )}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-xl"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md animate-in slide-in-from-top-5 duration-200">
          <div className="px-4 pt-2 pb-4 space-y-1.5 text-left">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-xs font-bold ${
                  location.pathname === link.path 
                    ? 'bg-emerald-50 text-emerald-700 font-extrabold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-slate-100 my-3 pt-3">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs uppercase">
                      {currentRole.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 capitalize">{currentRole.toLowerCase()} Account</div>
                      <div className="text-[9px] text-slate-400">Workspace Active</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full py-2.5 text-center text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200/60 rounded-xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/get-started"
                    onClick={() => setIsOpen(false)}
                    className="block py-2.5 text-center text-xs font-bold text-white bg-slate-950 rounded-xl"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
