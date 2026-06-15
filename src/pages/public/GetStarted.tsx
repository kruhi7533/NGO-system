import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Building, ArrowRight, ShieldCheck, Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createDonorProfile } from '../../lib/authClient';

interface DonorFormState {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function validatePassword(pw: string): string | null {
  if (pw.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(pw)) return 'Password must include at least one uppercase letter.';
  if (!/[a-z]/.test(pw)) return 'Password must include at least one lowercase letter.';
  if (!/[0-9]/.test(pw)) return 'Password must include at least one number.';
  if (!/[^A-Za-z0-9]/.test(pw)) return 'Password must include at least one special character.';
  return null;
}

export default function GetStarted() {
  const [showDonorForm, setShowDonorForm] = useState(false);
  const [donorForm, setDonorForm] = useState<DonorFormState>({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successState, setSuccessState] = useState(false);

  const handleDonorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDonorForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleDonorSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (donorForm.displayName.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    const pwError = validatePassword(donorForm.password);
    if (pwError) { setError(pwError); return; }
    if (donorForm.password !== donorForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      // Server-side atomic signup: creates auth user + Profile(DONOR) + AuditLog.
      // No client session needed — email verification is required, so none exists yet.
      const result = await createDonorProfile({
        email: donorForm.email.trim().toLowerCase(),
        password: donorForm.password,
        displayName: donorForm.displayName.trim(),
      });

      if (!result.success) {
        setError(result.error || 'Account setup failed. Please try again.');
        return;
      }

      setSuccessState(true);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (successState) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 flex flex-col items-center text-center">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-2xl font-display font-extrabold text-slate-900 mb-2">Check your inbox</h2>
        <p className="text-sm text-slate-500 mb-6">
          We've sent a verification link to <strong>{donorForm.email}</strong>. Click it to activate your account.
        </p>
        <Link to="/login" className="text-xs font-bold text-emerald-600 hover:underline">
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 min-h-[80vh] flex flex-col justify-center font-sans text-left">
      <div className="space-y-10">

        {/* Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1 bg-slate-900 text-slate-100 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-slate-800">
            <Sparkles className="h-3 w-3 text-amber-400 fill-current animate-pulse" />
            Get Started
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
            Join the Transparency Movement
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">
            Choose how you'd like to use Imparency.
          </p>
        </div>

        {/* Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">

          {/* ─── Donor Card ──────────────────────────────────────────────── */}
          <motion.div
            whileHover={{ y: showDonorForm ? 0 : -5 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-premium flex flex-col justify-between relative overflow-hidden group hover:border-slate-350 duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-full blur-[40px] group-hover:scale-110 duration-500" />

            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                  For Supporters
                </span>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg">
                  <Heart className="h-5 w-5 fill-current/10" />
                </div>
                <h3 className="font-display font-extrabold text-slate-900 text-lg sm:text-xl">Donor</h3>
                <p className="text-xs text-slate-550 leading-relaxed font-medium">
                  Discover trusted NGOs, track donations, and measure impact.
                </p>
              </div>
            </div>

            {/* Inline Donor Signup Form */}
            <AnimatePresence>
              {showDonorForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleDonorSignup}
                  className="mt-5 space-y-3 overflow-hidden"
                >
                  <input
                    type="text"
                    name="displayName"
                    placeholder="Your name"
                    value={donorForm.displayName}
                    onChange={handleDonorChange}
                    required
                    minLength={2}
                    maxLength={100}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-slate-50"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={donorForm.email}
                    onChange={handleDonorChange}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-slate-50"
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Password (min 8 chars)"
                      value={donorForm.password}
                      onChange={handleDonorChange}
                      required
                      className="w-full px-3 py-2 pr-8 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-slate-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={donorForm.confirmPassword}
                    onChange={handleDonorChange}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-slate-50"
                  />
                  {error && (
                    <p className="text-[11px] text-red-600 font-medium">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                    {isLoading ? 'Creating account…' : 'Create Donor Account'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {!showDonorForm && (
              <button
                onClick={() => setShowDonorForm(true)}
                className="mt-5 w-full py-3 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 group/btn"
              >
                Create Donor Account
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            )}
          </motion.div>

          {/* ─── NGO Card ────────────────────────────────────────────────── */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-premium flex flex-col justify-between h-[320px] relative overflow-hidden group hover:border-slate-350 duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-full blur-[40px] group-hover:scale-110 duration-500" />
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                  For Non-Profits
                </span>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-lg">
                  <Building className="h-5 w-5 fill-current/10" />
                </div>
                <h3 className="font-display font-extrabold text-slate-900 text-lg sm:text-xl">NGO</h3>
                <p className="text-xs text-slate-550 leading-relaxed font-medium">
                  Build trust, attract supporters, launch campaigns, and showcase impact.
                </p>
              </div>
            </div>
            <Link
              to="/register-ngo"
              className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 group/btn"
            >
              Register NGO
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </motion.div>

        </div>

        <div className="text-center">
          <p className="text-xs text-slate-450 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-slate-900 hover:underline font-bold">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
