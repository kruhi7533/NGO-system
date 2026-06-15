import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public pages
import Home from './pages/public/Home';
import Explore from './pages/public/Explore';
import Stories from './pages/public/Stories';
import GetStarted from './pages/public/GetStarted';
import NGORegistration from './pages/public/NGORegistration';
import NGOProfile from './pages/public/NGOProfile';
import CampaignDetails from './pages/public/CampaignDetails';
import ImpactFeed from './pages/public/ImpactFeed';
import About from './pages/public/About';
import Login from './pages/public/Login';

// Donor workspace
import DonorDashboard from './pages/donor/DonorDashboard';

// NGO workspace
import NGODashboard from './pages/ngo/NGODashboard';
import CampaignManager from './pages/ngo/CampaignManager';
import ProofUploadCenter from './pages/ngo/ProofUploadCenter';

// Admin workspace
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
        {/* Navigation Header */}
        <Navbar />

        {/* Content Viewport */}
        <main className="flex-grow">
          <Routes>
            {/* Public Routing */}
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/register-ngo" element={<NGORegistration />} />
            <Route path="/ngo/:id" element={<NGOProfile />} />
            <Route path="/campaign/:id" element={<CampaignDetails />} />
            <Route path="/feed" element={<ImpactFeed />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />

            {/* Email verification and pending states */}
            <Route path="/verify-email" element={
              <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="max-w-md text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-5xl mb-4">📧</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h2>
                  <p className="text-gray-500">Check your inbox and click the verification link to continue.</p>
                </div>
              </div>
            } />
            <Route path="/pending-approval" element={
              <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="max-w-md text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-5xl mb-4">⏳</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Awaiting admin approval</h2>
                  <p className="text-gray-500">Your NGO registration has been submitted. We'll notify you once it's reviewed.</p>
                </div>
              </div>
            } />

            {/* Donor Portfolio Routing — protected */}
            <Route element={<ProtectedRoute allowedRoles={['DONOR']} />}>
              <Route path="/donor" element={<DonorDashboard />} />
            </Route>

            {/* NGO Management Routing — protected + must be VERIFIED */}
            <Route element={<ProtectedRoute allowedRoles={['NGO']} />}>
              <Route path="/ngo" element={<NGODashboard />} />
              <Route path="/ngo/campaign-manager" element={<CampaignManager />} />
              <Route path="/ngo/proof-upload" element={<ProofUploadCenter />} />
            </Route>

            {/* Admin Audit Routing — protected */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </main>

        {/* Brand Footer */}
        <Footer />

        {/* Global AI Assistant Floating Toggle */}
        <AIAssistant />
      </div>
    </Router>
  );
}

export default App;
