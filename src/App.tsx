import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';

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

            {/* Donor Portfolio Routing */}
            <Route path="/donor" element={<DonorDashboard />} />

            {/* NGO Management Routing */}
            <Route path="/ngo" element={<NGODashboard />} />
            <Route path="/ngo/campaign-manager" element={<CampaignManager />} />
            <Route path="/ngo/proof-upload" element={<ProofUploadCenter />} />

            {/* Admin Audit Routing */}
            <Route path="/admin" element={<AdminDashboard />} />
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
