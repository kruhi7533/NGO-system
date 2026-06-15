import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building, UploadCloud, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, ShieldCheck, FileText, Image as ImageIcon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createNgoRegistration } from '../../lib/authClient';

export default function NGORegistration() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    regNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    website: '',
    location: '',
    mission: '',
    description: '',
    category: 'Education',
    logo: '',
    coverImage: '',
    panUploaded: false,
    g80Uploaded: false,
    a12Uploaded: false,
    fcraUploaded: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Verification Checklist simulation
  const handleToggleDoc = (docKey: 'panUploaded' | 'g80Uploaded' | 'a12Uploaded' | 'fcraUploaded') => {
    setFormData(prev => ({
      ...prev,
      [docKey]: !prev[docKey]
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (formData.password !== formData.confirmPassword) {
      setSubmitError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 8) {
      setSubmitError('Password must be at least 8 characters.');
      return;
    }

    try {
      // Server-side atomic signup: creates auth user + Profile(NGO) + NgoRegistration + AuditLog.
      // No client session needed — email verification is required, so none exists yet.
      const result = await createNgoRegistration({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        orgName: formData.name.trim(),
        registrationNumber: formData.regNumber || undefined,
        phone: formData.phone || undefined,
        website: formData.website || undefined,
        state: formData.location ? formData.location.split(',')[1]?.trim() : undefined,
        city: formData.location ? formData.location.split(',')[0]?.trim() : undefined,
        category: formData.category,
        mission: formData.mission,
      });

      if (!result.success) {
        setSubmitError(result.error || 'Registration failed. Please try again.');
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError('An unexpected error occurred. Please try again.');
    }
  };

  const handleInstantVerify = () => {
    // Dev shortcut: navigate to admin (requires admin session in real usage)
    navigate('/admin');
  };

  // Steps definitions
  const steps = [
    { num: 1, title: 'Organization info' },
    { num: 2, title: 'Verification docs' },
    { num: 3, title: 'Profile details' },
    { num: 4, title: 'Review & submit' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 min-h-screen font-sans text-left">
      
      {/* Back to Home link */}
      <div className="mb-6">
        <Link to="/get-started" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to onboarding
        </Link>
      </div>

      {!submitted ? (
        <div className="bg-white rounded-3xl border border-slate-200/50 shadow-premium p-6 sm:p-8 space-y-6">
          
          {/* Stepper Header */}
          <div className="border-b border-slate-100 pb-5">
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 flex items-center gap-2">
              <Building className="h-6 w-6 text-emerald-500" />
              NGO Registration Portal
            </h1>
            <p className="text-xs text-slate-450 mt-1 font-medium">Verify your organization and unlock transparent donation features.</p>
            
            {/* Steps indicator */}
            <div className="flex justify-between items-center mt-6 gap-2">
              {steps.map((st) => (
                <div key={st.num} className="flex-1 flex flex-col gap-1.5">
                  <div className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentStep >= st.num ? 'bg-emerald-500' : 'bg-slate-100'
                  }`} />
                  <span className={`text-[9px] font-bold uppercase tracking-wider hidden sm:inline ${
                    currentStep === st.num ? 'text-slate-900' : 'text-slate-400'
                  }`}>
                    {st.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Info */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Organization General Details</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">NGO Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Hope India Trust"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:border-slate-950 focus:bg-white transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Government Reg Number *</label>
                    <input
                      type="text"
                      name="regNumber"
                      required
                      placeholder="e.g. U85110GJ2015NPL08324"
                      value={formData.regNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:border-slate-950 focus:bg-white transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Official Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. contact@organization.org"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:border-slate-950 focus:bg-white transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Password *</label>
                    <input
                      type="password"
                      name="password"
                      required
                      minLength={8}
                      placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:border-slate-950 focus:bg-white transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:border-slate-950 focus:bg-white transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Contact Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:border-slate-950 focus:bg-white transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Organization Website</label>
                    <input
                      type="url"
                      name="website"
                      placeholder="e.g. https://hopefoundation.org"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:border-slate-950 focus:bg-white transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Headquarters Location *</label>
                    <input
                      type="text"
                      name="location"
                      required
                      placeholder="e.g. New Delhi, India"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:border-slate-950 focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Documents */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Verification Certificates</h3>
                  <p className="text-[11px] text-slate-450 mt-1 leading-normal font-medium">To display verified status and unlock campaign backing, upload copies of your legally required non-profit certificates.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'PAN Card Exemption Proof', desc: 'Legally mandated entity identification.', key: 'panUploaded' as const },
                    { label: '80G Tax Certification', desc: 'Allows donors to claim 50% tax deductions.', key: 'g80Uploaded' as const },
                    { label: '12A Income Registration', desc: 'Confirms NGO tax exemption on earnings.', key: 'a12Uploaded' as const },
                    { label: 'FCRA Audit Log Certificate', desc: 'Required for accepting foreign sponsorships.', key: 'fcraUploaded' as const },
                  ].map((doc) => {
                    const isUploaded = formData[doc.key];
                    return (
                      <button
                        type="button"
                        key={doc.key}
                        onClick={() => handleToggleDoc(doc.key)}
                        className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                          isUploaded
                            ? 'border-emerald-500 bg-emerald-50/10 shadow-sm'
                            : 'border-slate-100 hover:border-slate-200 bg-slate-50/30'
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 flex items-center justify-center ${
                          isUploaded ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-450 border border-slate-200/40'
                        }`}>
                          {isUploaded ? <Check className="h-4.5 w-4.5" /> : <UploadCloud className="h-4.5 w-4.5" />}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-slate-800 leading-tight">{doc.label}</h4>
                          <p className="text-[10px] text-slate-450 leading-relaxed font-medium">{doc.desc}</p>
                          <span className={`block text-[9px] font-bold mt-1.5 uppercase ${
                            isUploaded ? 'text-emerald-600' : 'text-slate-400'
                          }`}>
                            {isUploaded ? 'File Attached (Simulation)' : 'Click to Upload Mock File'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 3: Profile */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Public Profile Assets</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Primary Cause Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:border-slate-950 focus:bg-white transition-all outline-none"
                      >
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Environment">Environment</option>
                        <option value="Animal Welfare">Animal Welfare</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Logo URL (Simulation)</label>
                      <input
                        type="url"
                        name="logo"
                        placeholder="Leave blank for generic fallback logo"
                        value={formData.logo}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:border-slate-950 focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Cover Image URL (Simulation)</label>
                    <input
                      type="url"
                      name="coverImage"
                      placeholder="Leave blank for generic fallback banner"
                      value={formData.coverImage}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:border-slate-950 focus:bg-white transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Mission Statement (One-Sentence Tagline) *</label>
                    <input
                      type="text"
                      name="mission"
                      required
                      placeholder="e.g. Providing smart tech learning structures to remote schools."
                      value={formData.mission}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:border-slate-950 focus:bg-white transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Organization Narrative (Long Story) *</label>
                    <textarea
                      name="description"
                      required
                      rows={4}
                      placeholder="Provide background history, recent achievements, and why donors should support your causes..."
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:border-slate-950 focus:bg-white transition-all outline-none resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Application Summary</h3>
                  <p className="text-[11px] text-slate-450 mt-1 font-medium">Please verify all registration values before submitting for auditor check.</p>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] text-slate-450 font-bold block uppercase">NGO Name</span>
                      <span className="font-bold text-slate-800">{formData.name || 'Not Provided'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-450 font-bold block uppercase">Reg Number</span>
                      <span className="font-bold text-slate-800">{formData.regNumber || 'Not Provided'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-450 font-bold block uppercase">Email</span>
                      <span className="font-bold text-slate-800">{formData.email || 'Not Provided'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-450 font-bold block uppercase">Category</span>
                      <span className="font-bold text-slate-800">{formData.category}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200/60 pt-3">
                    <span className="text-[9px] text-slate-450 font-bold block uppercase">Mission Tagline</span>
                    <span className="font-medium text-slate-700 leading-normal block">{formData.mission || 'Not Provided'}</span>
                  </div>

                  <div className="border-t border-slate-200/60 pt-3 grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[9px] text-slate-450 font-bold block uppercase">Documents Attached</span>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {formData.panUploaded && <span className="bg-emerald-50 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded border border-emerald-100">PAN</span>}
                        {formData.g80Uploaded && <span className="bg-emerald-50 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded border border-emerald-100">80G</span>}
                        {formData.a12Uploaded && <span className="bg-emerald-50 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded border border-emerald-100">12A</span>}
                        {formData.fcraUploaded && <span className="bg-emerald-50 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded border border-emerald-100">FCRA</span>}
                        {!formData.panUploaded && !formData.g80Uploaded && !formData.a12Uploaded && !formData.fcraUploaded && (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/30 border border-amber-100/50 rounded-2xl flex gap-3 text-amber-800">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-xs">Review & Verification Note</h5>
                    <p className="text-[10px] leading-relaxed text-amber-700/95 font-medium">
                      Your application will be reviewed within 24–48 hours. Once verified by our super auditor console, your NGO page will display the verification mark and your campaigns will go live.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stepper Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 disabled:opacity-30 flex items-center gap-1 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <ShieldCheck className="h-4.5 w-4.5" />
                  Submit for Verification
                </button>
              )}
            </div>

            {submitError && (
              <p className="text-[11px] text-red-600 font-medium mt-2">{submitError}</p>
            )}

          </form>

        </div>
      ) : (
        /* Success Screen */
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl border border-slate-200/50 p-8 sm:p-10 shadow-premium space-y-6 text-center"
        >
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full border-4 border-emerald-100 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">Application Submitted!</h2>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Thank you for registering <span className="font-bold text-slate-800">"{formData.name}"</span>. Two things happen next:
            </p>
          </div>

          <div className="p-5 bg-amber-50/50 border border-amber-100/50 rounded-2xl max-w-md mx-auto text-amber-900 text-left space-y-3">
            <div className="space-y-3 text-xs font-medium text-amber-800">
              <div className="flex items-start gap-2">
                <span className="font-bold text-amber-600 shrink-0">1.</span>
                <p>Check <strong>{formData.email}</strong> — click the verification link we just sent to verify your email.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-amber-600 shrink-0">2.</span>
                <p>Our team will review your NGO registration. You'll be notified once approved. Your dashboard will unlock after approval.</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link to="/" className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
              Return to Homepage
            </Link>
          </div>
        </motion.div>
      )}

    </div>
  );
}
