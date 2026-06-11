# 🌟 Vitalnspire: Transparent NGO & Impact Tracking System

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF.svg?logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![State Management](https://img.shields.io/badge/Zustand-5.0-orange.svg)](https://github.com/pmndrs/zustand)

Vitalnspire is a modern, high-transparency charitable platform designed to bridge the trust gap between donors and NGOs. By introducing **live, step-by-step donation tracking** (similar to package tracking), integrated **AI-powered proof verification**, and an **auditor compliance system**, Vitalnspire guarantees that every rupee donated reaches its intended destination.

---

## ✨ Key Features

### 📦 1. Live Donation Tracking Timeline
- **Real-Time Logistics**: Track your contribution step-by-step: `Received` ➔ `Allocated` ➔ `Purchased` ➔ `Proof Uploaded` ➔ `Verified` ➔ `Impact Delivered`.
- **Itemized Ledger**: View detailed logs showing exactly how pooled funds are combined for purchase orders.

### 🤖 2. AI-Powered & Auditor Compliance Audit
- **Automatic Receipt Auditing**: Uploaded invoices and receipts are processed for mismatch detection, validating purchase items against registered campaigns.
- **Geotagged Proof**: Photos from camp deliveries are scanned for geolocation coordination and child/patient consent guidelines.
- **Government Document Verification**: Administrative verification dashboard for critical NGO documents (PAN, 80G, 12A, FCRA) which automatically generates **Trust, Transparency, and Impact Scores**.

### 💼 3. Multi-Role Workspaces

#### 👤 Public / Donor Hub
- **Explore NGOs**: Search and filter organizations based on category, location, and verified trust ratings.
- **Campaign Insights**: Inspect target amounts, current milestones, and **impact brackets** (e.g., what ₹1,500 pays for vs ₹10,000).
- **Interactive Impact Feed**: Social engagement feed showcasing delivery milestones, proof documents, and success stories with community likes/comments.
- **Donation Dashboard**: View historical contributions and trace active timelines.

#### 🏢 NGO Management Portal
- **Campaign Creator**: Configure target amounts, banner imagery, expected impact metrics, and compliance categories.
- **Proof Upload Center**: Directly submit vendor invoices, delivery receipts, and photo logs to advance donation milestones.
- **Performance Analytics**: Track donor retention, campaign success rates, and average trust metrics via Recharts analytics.

#### 🛡️ Platform Admin Dashboard
- **Credential Verification**: Approve or flag NGO applications and regulatory tax-exemption papers.
- **Milestone Audits**: Inspect uploaded files and receipts manually to complete the final verification stage for deliveries.

---

## 🛠️ Technical Stack

- **Frontend Core**: React 19, TypeScript, HTML5, TailwindCSS
- **State Management**: Zustand 5 (persistent reactive global state store)
- **Routing**: React Router DOM 7
- **Animations**: Framer Motion 12 (smooth transition animations & interactive states)
- **Charts & Data Viz**: Recharts 3 (sleek interactive donor analytics)
- **Icons & Extras**: Lucide React, Canvas Confetti

---

## 📂 Project Architecture

```
Vitalnspire/
├── public/                 # Static assets & public resources
└── src/
    ├── components/         # Global Layout Components (Navbar, Footer, Timeline)
    ├── store/              # Zustand state engine & mock data models (useStore.ts)
    ├── pages/              # Role-specific workspaces and public routes
    │   ├── admin/          # Admin Dashboard & Audit Centers
    │   ├── donor/          # Donor Portfolio & Tracked Donation Timelines
    │   ├── ngo/            # Campaign Managers, Proof Upload Centers, NGO Dashboards
    │   └── public/         # Home, About, Explore, Profile, Campaign Details, Impact Feed, Login
    ├── App.tsx             # Route management and application wrapper
    ├── main.tsx            # Entry point
    └── index.css           # Custom styling system & background meshes
```

---

## 🚀 Getting Started

Follow these steps to run Vitalnspire locally:

### 1. Clone the Repository
```bash
git clone https://github.com/kruhi7533/NGO-system.git
cd NGO-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:5173/` by default.

### 4. Build for Production
```bash
npm run build
```
This compiles the TypeScript files and outputs a optimized production build in the `dist` folder.

---

## 👥 Accessing Sandbox Roles

For demonstration purposes, you can switch between roles in the top navbar or via the login page:
- **Donor View**: Access donor timelines, explore campaigns, and make test donations.
- **NGO View**: Create mock campaigns, upload invoices/proofs, and view NGO analytics.
- **Admin View**: Audit NGO credentials (approve/reject 80G documents) and verify uploaded proofs.

---

## 🤝 Contributing

We welcome contributions to Vitalnspire! Please follow these guidelines:
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
