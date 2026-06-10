import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore, UserRole } from '../store/useStore';
import { 
  Heart, 
  Bell, 
  Menu, 
  X, 
  ShieldCheck, 
  User, 
  Database, 
  Award, 
  PlusCircle, 
  CheckSquare, 
  FileText 
} from 'lucide-react';

export default function Navbar() {
  const { currentRole, setRole, notifications, markNotificationsAsRead } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const handleRoleChange = (role: UserRole) => {
    setRole(role);
    if (role === 'donor') {
      navigate('/donor');
    } else if (role === 'ngo') {
      navigate('/ngo');
    } else if (role === 'admin') {
      navigate('/admin');
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Explore NGOs', path: '/explore' },
    { label: 'Impact Feed', path: '/feed' },
    { label: 'About Us', path: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-emerald-500 text-white p-2 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Heart className="h-5 w-5 fill-current" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-slate-900">
                IMPARENCY
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-md border border-emerald-200/50 font-medium">
                v2.0
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path 
                    ? 'text-emerald-600 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Role Simulator Widget */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold px-2">Role:</span>
              {(['donor', 'ngo', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-all duration-200 ${
                    currentRole === r
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {r === 'donor' ? 'Donor' : r === 'ngo' ? 'NGO' : 'Admin'}
                </button>
              ))}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotif(!showNotif);
                  if (!showNotif) markNotificationsAsRead();
                }}
                className="relative p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotif && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                    <span className="font-semibold text-sm text-slate-800">Notifications</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      {notifications.length} Total
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">No notifications yet</div>
                    ) : (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          className={`px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-b-0 transition-colors cursor-pointer ${
                            !n.read ? 'bg-emerald-50/20' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                              {n.type === 'donation' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                              {n.type === 'verification' && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />}
                              {n.type === 'milestone' && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                              {n.title}
                            </h4>
                            <span className="text-[9px] text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">{n.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-slate-100 text-center">
                    <Link 
                      to={currentRole === 'donor' ? '/donor' : '/'} 
                      onClick={() => setShowNotif(false)} 
                      className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold"
                    >
                      View all in Portfolio
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Button / Workspace Portal */}
            <Link
              to={currentRole === 'donor' ? '/donor' : currentRole === 'ngo' ? '/ngo' : '/admin'}
              className="flex items-center space-x-2 pl-2 border-l border-slate-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                {currentRole.slice(0, 2)}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-none">
                  {currentRole === 'donor' ? 'Impact Portfolio' : currentRole === 'ngo' ? 'Vidyoday Admin' : 'Super Admin'}
                </span>
                <span className="text-[10px] text-slate-500 leading-none mt-1">Dashboard</span>
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={() => {
                setShowNotif(!showNotif);
                if (!showNotif) markNotificationsAsRead();
              }}
              className="relative p-1.5 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent-500" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md animate-in slide-in-from-top-5 duration-200">
          <div className="px-4 pt-2 pb-4 space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-medium ${
                  location.pathname === link.path 
                    ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-slate-100 my-3 pt-3">
              <span className="block px-3 text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2">
                Simulate Role View
              </span>
              <div className="grid grid-cols-3 gap-1.5 px-3">
                {(['donor', 'ngo', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      handleRoleChange(r);
                      setIsOpen(false);
                    }}
                    className={`py-1.5 text-center text-xs font-semibold rounded-lg capitalize border ${
                      currentRole === r
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-slate-50 text-slate-600 border-slate-200/50 hover:bg-slate-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 px-3">
              <Link
                to={currentRole === 'donor' ? '/donor' : currentRole === 'ngo' ? '/ngo' : '/admin'}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 bg-slate-50 p-2 rounded-xl border border-slate-100"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs uppercase">
                  {currentRole.slice(0, 2)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 capitalize">{currentRole} Dashboard</div>
                  <div className="text-[9px] text-slate-400">View workspace settings</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
