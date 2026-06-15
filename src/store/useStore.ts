import { create } from 'zustand';
import type { AuthUser, UserProfile } from '../types/auth';

export type UserRole = 'DONOR' | 'NGO' | 'ADMIN';

export interface NGO {
  id: string;
  name: string;
  logo: string;
  banner: string;
  tagline: string;
  mission: string;
  story: string;
  category: string;
  location: string;
  verifiedStatus: boolean;
  trustScore: number;
  transparencyScore: number;
  impactScore: number;
  verificationScore: number;
  followersCount: number;
  beneficiariesReached: number;
  documents: {
    pan: 'Approved' | 'Pending' | 'Not Submitted';
    g80: 'Approved' | 'Pending' | 'Not Submitted';
    a12: 'Approved' | 'Pending' | 'Not Submitted';
    fcra: 'Approved' | 'Pending' | 'Not Submitted';
  };
  gallery: string[];
  
  // Imparency 3.0 Additional Data Model
  campaignSuccessRate: number;
  projectsCompleted: number;
  yearsActive: number;
  trustBreakdown: {
    documentsVerified: number;
    auditQuality: number;
    proofFrequency: number;
    donorSatisfaction: number;
    campaignCompletion: number;
    impactVerification: number;
  };
  whyTrust: {
    panVerified: boolean;
    g80Verified: boolean;
    a12Verified: boolean;
    fcraVerified: boolean;
    lastAuditDate: string;
    complianceStatus: 'Excellent' | 'Good' | 'Pending';
    riskRating: 'Low' | 'Medium' | 'High';
    aiVerificationStatus: 'Active' | 'Inactive';
  };
  supportersCount: number;
  recentDonors: string[];
  communitySize: number;
  email?: string;
}

export interface Campaign {
  id: string;
  ngoId: string;
  ngoName: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  category: string;
  banner: string;
  expectedImpact: {
    bracket1: string;
    bracket2: string;
    bracket3: string;
  };
  beneficiariesCount: number;
  active: boolean;
  trustIndicators: string[];
}

export interface TimelineStage {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'pending';
  timestamp: string;
  description: string;
  evidence?: {
    type: 'invoice' | 'photo' | 'report' | 'certificate';
    name: string;
    url: string;
    isAiVerified: boolean;
    verificationNotes?: string;
  };
}

export interface TrackedDonation {
  id: string;
  campaignId: string;
  campaignTitle: string;
  ngoId: string;
  ngoName: string;
  amount: number;
  date: string;
  currentStage: 'Received' | 'Allocated' | 'Purchased' | 'Uploaded' | 'Verified' | 'Delivered';
  stages: TimelineStage[];
}

export interface FeedPost {
  id: string;
  ngoId: string;
  ngoName: string;
  ngoLogo: string;
  type: 'milestone' | 'allocation' | 'purchase' | 'evidence' | 'story' | 'audit';
  title: string;
  content: string;
  timestamp: string;
  image?: string;
  document?: {
    name: string;
    size: string;
    url: string;
  };
  aiSummary?: string;
  rawEvidenceLink?: string;
  likes: number;
  comments: number;
  hasLiked?: boolean;
  beforeImage?: string;
  afterImage?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'donation' | 'milestone' | 'proof' | 'verification' | 'alert';
  read: boolean;
}

interface AppState {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  logout: () => void;

  // Real auth state (populated by useAuth hook after sign-in)
  authUser: AuthUser | null;
  userProfile: UserProfile | null;
  setAuthUser: (user: AuthUser | null, profile: UserProfile | null) => void;
  
  activeNgoId: string;
  setActiveNgoId: (id: string) => void;
  
  ngos: NGO[];
  campaigns: Campaign[];
  trackedDonations: TrackedDonation[];
  feedPosts: FeedPost[];
  notifications: AppNotification[];
  followedNgos: string[];
  
  // Actions
  toggleFollowNGO: (ngoId: string) => void;
  donate: (campaignId: string, amount: number, donorName: string) => void;
  verifyDocument: (ngoId: string, docType: 'pan' | 'g80' | 'a12' | 'fcra', status: 'Approved' | 'Pending') => void;
  approveCampaign: (campaignId: string) => void;
  uploadProof: (campaignId: string, stageName: string, description: string, evidenceName: string, evidenceType: 'invoice' | 'photo' | 'report') => void;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'raisedAmount' | 'ngoId' | 'ngoName'>) => void;
  addFeedPost: (post: Omit<FeedPost, 'id' | 'likes' | 'comments' | 'timestamp' | 'ngoLogo'>) => void;
  markNotificationsAsRead: () => void;
  registerNgo: (ngoData: {
    name: string;
    regNumber: string;
    email: string;
    phone: string;
    website: string;
    location: string;
    mission: string;
    description: string;
    category: string;
    logo: string;
    coverImage: string;
    panUploaded: boolean;
    g80Uploaded: boolean;
    a12Uploaded: boolean;
    fcraUploaded: boolean;
  }) => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentRole: 'DONOR',
  setRole: (role) => set({ currentRole: role }),
  logout: () => set({ currentRole: 'DONOR', authUser: null, userProfile: null }),

  authUser: null,
  userProfile: null,
  setAuthUser: (user, profile) => set({ authUser: user, userProfile: profile }),
  
  activeNgoId: 'ngo-2',
  setActiveNgoId: (id) => set({ activeNgoId: id }),
  
  followedNgos: ['ngo-2'], // Vidyoday followed by default
  
  notifications: [
    {
      id: 'n-1',
      title: 'Donation Traced!',
      description: 'Your contribution of ₹2,500 has been successfully allocated to purchase textbooks.',
      timestamp: '2 hours ago',
      type: 'donation',
      read: false,
    },
    {
      id: 'n-2',
      title: 'Milestone Reached 🎉',
      description: 'Vidyoday Foundation reached 80% of its target for "Digital Literacy for Girls".',
      timestamp: '5 hours ago',
      type: 'milestone',
      read: false,
    },
    {
      id: 'n-3',
      title: 'Verification Status Alert',
      description: 'Paws & Tails Shelter has uploaded their 80G documentation for admin approval.',
      timestamp: '1 day ago',
      type: 'verification',
      read: true,
    }
  ],

  ngos: [
    {
      id: 'ngo-1',
      name: 'Sanjeevani Health Trust',
      logo: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=120',
      banner: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      tagline: 'Delivering healthcare to the last mile.',
      mission: 'Providing accessible, affordable, and high-quality medical services to rural and marginalized communities across India.',
      story: 'Founded in 2015 by a group of retired doctors, Sanjeevani started as a single mobile health van in Gujarat. Today, we operate 14 mobile units, 3 community health clinics, and have treated over 250,000 patients who previously had to travel hours for basic treatment.',
      category: 'Healthcare',
      location: 'Ahmedabad, India',
      verifiedStatus: true,
      trustScore: 94,
      transparencyScore: 96,
      impactScore: 92,
      verificationScore: 95,
      followersCount: 1240,
      beneficiariesReached: 250000,
      documents: {
        pan: 'Approved',
        g80: 'Approved',
        a12: 'Approved',
        fcra: 'Approved',
      },
      gallery: [
        'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=300',
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=300',
        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=300',
      ],
      campaignSuccessRate: 94,
      projectsCompleted: 24,
      yearsActive: 9,
      trustBreakdown: {
        documentsVerified: 95,
        auditQuality: 96,
        proofFrequency: 93,
        donorSatisfaction: 94,
        campaignCompletion: 92,
        impactVerification: 90
      },
      whyTrust: {
        panVerified: true,
        g80Verified: true,
        a12Verified: true,
        fcraVerified: true,
        lastAuditDate: '2026-05-15',
        complianceStatus: 'Excellent',
        riskRating: 'Low',
        aiVerificationStatus: 'Active'
      },
      supportersCount: 920,
      recentDonors: ['Amit Sharma', 'Pooja Patel', 'Rohan Das'],
      communitySize: 12500,
      email: 'sanjeevani@imparency.org'
    },
    {
      id: 'ngo-2',
      name: 'Vidyoday Foundation',
      logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=120',
      banner: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800',
      tagline: 'Bridging the digital divide for underprivileged students.',
      mission: 'Empowering children in semi-urban and rural public schools through computer literacy, digital labs, and stem learning centers.',
      story: 'We believe that digital literacy is a fundamental right in the 21st century. Vidyoday was established in Pune in 2018. Over the past 6 years, we have converted 45 classrooms into state-of-the-art smart labs and trained over 12,000 first-generation digital learners.',
      category: 'Education',
      location: 'Pune, India',
      verifiedStatus: true,
      trustScore: 98,
      transparencyScore: 99,
      impactScore: 97,
      verificationScore: 98,
      followersCount: 3450,
      beneficiariesReached: 12000,
      documents: {
        pan: 'Approved',
        g80: 'Approved',
        a12: 'Approved',
        fcra: 'Approved',
      },
      gallery: [
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=300',
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=300',
        'https://images.unsplash.com/photo-1577896851231-70ee18881754?auto=format&fit=crop&q=80&w=300',
      ],
      campaignSuccessRate: 98,
      projectsCompleted: 32,
      yearsActive: 8,
      trustBreakdown: {
        documentsVerified: 98,
        auditQuality: 99,
        proofFrequency: 97,
        donorSatisfaction: 98,
        campaignCompletion: 99,
        impactVerification: 96
      },
      whyTrust: {
        panVerified: true,
        g80Verified: true,
        a12Verified: true,
        fcraVerified: true,
        lastAuditDate: '2026-06-01',
        complianceStatus: 'Excellent',
        riskRating: 'Low',
        aiVerificationStatus: 'Active'
      },
      supportersCount: 1840,
      recentDonors: ['Vikram Sen', 'Ananya Roy', 'Kabir Mehta'],
      communitySize: 24000,
      email: 'ngo@imparency.org'
    },
    {
      id: 'ngo-3',
      name: 'Green Canopy Initiative',
      logo: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=120',
      banner: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=800',
      tagline: 'Reforestation through community ownership.',
      mission: 'Combating local climate change by planting indigenous forest reserves and creating sustainable urban mini-forests.',
      story: 'What started as a weekend tree planting drive in Bengaluru by 4 friends in 2019 is now an ecosystem restoration initiative. We create micro-forests using the Miyawaki technique, which grow 10x faster and are 30x denser than conventional forests.',
      category: 'Environment',
      location: 'Bengaluru, India',
      verifiedStatus: true,
      trustScore: 89,
      transparencyScore: 91,
      impactScore: 87,
      verificationScore: 88,
      followersCount: 890,
      beneficiariesReached: 45000,
      documents: {
        pan: 'Approved',
        g80: 'Approved',
        a12: 'Approved',
        fcra: 'Not Submitted',
      },
      gallery: [
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=300',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=300',
        'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=300',
      ],
      campaignSuccessRate: 88,
      projectsCompleted: 14,
      yearsActive: 7,
      trustBreakdown: {
        documentsVerified: 88,
        auditQuality: 91,
        proofFrequency: 90,
        donorSatisfaction: 89,
        campaignCompletion: 87,
        impactVerification: 85
      },
      whyTrust: {
        panVerified: true,
        g80Verified: true,
        a12Verified: true,
        fcraVerified: false,
        lastAuditDate: '2026-04-20',
        complianceStatus: 'Good',
        riskRating: 'Low',
        aiVerificationStatus: 'Active'
      },
      supportersCount: 450,
      recentDonors: ['Sneha Nair', 'Aditya Rao', 'Meera Iyer'],
      communitySize: 6800,
      email: 'greencanopy@imparency.org'
    },
    {
      id: 'ngo-4',
      name: 'Paws & Tails Shelter',
      logo: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=120',
      banner: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=800',
      tagline: 'A safe haven for every stray animal.',
      mission: 'Providing medical care, rehabilitation, vaccination, and adoptive homes for injured and abandoned stray animals.',
      story: 'Paws & Tails shelter operates in the suburbs of Mumbai. We host a permanent sanctuary for disabled and blind animals and coordinate sterilization and rabies vaccination drives for community dogs and cats.',
      category: 'Animal Welfare',
      location: 'Mumbai, India',
      verifiedStatus: false,
      trustScore: 68,
      transparencyScore: 72,
      impactScore: 65,
      verificationScore: 70,
      followersCount: 420,
      beneficiariesReached: 3800,
      documents: {
        pan: 'Approved',
        g80: 'Pending',
        a12: 'Not Submitted',
        fcra: 'Not Submitted',
      },
      gallery: [
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300',
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=300',
      ],
      campaignSuccessRate: 72,
      projectsCompleted: 8,
      yearsActive: 4,
      trustBreakdown: {
        documentsVerified: 70,
        auditQuality: 72,
        proofFrequency: 75,
        donorSatisfaction: 72,
        campaignCompletion: 70,
        impactVerification: 66
      },
      whyTrust: {
        panVerified: true,
        g80Verified: false,
        a12Verified: false,
        fcraVerified: false,
        lastAuditDate: '2026-02-10',
        complianceStatus: 'Pending',
        riskRating: 'Medium',
        aiVerificationStatus: 'Inactive'
      },
      supportersCount: 280,
      recentDonors: ['Preeti Vyas', 'Arjun Kapoor', 'Siddharth Malhotra'],
      communitySize: 1800,
      email: 'pawstails@imparency.org'
    }
  ],

  campaigns: [
    {
      id: 'c-1',
      ngoId: 'ngo-2',
      ngoName: 'Vidyoday Foundation',
      title: 'Digital Labs for Rural Girls',
      description: 'We are setting up 5 complete computer learning labs in government girls secondary schools in rural Pune districts. This includes 50 computers, internet infrastructure, solar backup, and 12 months of digital curricula led by a full-time training instructor.',
      targetAmount: 850000,
      raisedAmount: 680000,
      category: 'Education',
      banner: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
      expectedImpact: {
        bracket1: '₹1,000 pays for computer lab accessories & digital worksheets for 2 girls.',
        bracket2: '₹5,000 funds the internet connection and electrical accessories setup for a computer lab.',
        bracket3: '₹15,000 fully sponsors 1 high-speed desktop computer with software licenses for rural students.',
      },
      beneficiariesCount: 1500,
      active: true,
      trustIndicators: ['Verified NGO', '100% Direct Utilization Tracked', 'Previous Milestones Audited']
    },
    {
      id: 'c-2',
      ngoId: 'ngo-1',
      ngoName: 'Sanjeevani Health Trust',
      title: 'Rural Pediatric Medical Camps',
      description: 'Funding medical diagnostic camps for infants and children under 12 in remote villages of Udaipur district. Funds cover pediatric doctor honorariums, free medicines, nutritional kits, and transportation for emergency care cases.',
      targetAmount: 450000,
      raisedAmount: 320000,
      category: 'Healthcare',
      banner: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=800',
      expectedImpact: {
        bracket1: '₹1,500 pays for comprehensive health checks and medicines for 3 children.',
        bracket2: '₹5,000 funds 20 pediatric clinical nutritional supplement packs.',
        bracket3: '₹10,000 covers full diagnostic setup and paramedic travel expenses for 1 village camp.',
      },
      beneficiariesCount: 2200,
      active: true,
      trustIndicators: ['Transparency Certified', 'Doctor Licenses Uploaded', 'Live Utilization Photos']
    },
    {
      id: 'c-3',
      ngoId: 'ngo-3',
      ngoName: 'Green Canopy Initiative',
      title: '10,000 Miyawaki Trees in Bengaluru',
      description: 'Creating 3 dense urban Miyawaki micro-forests on public layouts. Trees planted are 100% indigenous. The project covers soil preparation (coco-peat, biomass), sapling purchases, security fencing, and water tankers for the critical first 2 years.',
      targetAmount: 600000,
      raisedAmount: 120000,
      category: 'Environment',
      banner: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
      expectedImpact: {
        bracket1: '₹500 buys, plants, and protects 3 native saplings.',
        bracket2: '₹2,500 covers soil excavation and nutrition bed preparation for 15 square meters.',
        bracket3: '₹10,000 sponsors a deep borewell water irrigation share and protective metal mesh fencing.',
      },
      beneficiariesCount: 8000,
      active: true,
      trustIndicators: ['Location Geo-tagged', 'Bi-annual Growth Audit', 'Low Overhead Certified']
    },
    {
      id: 'c-4',
      ngoId: 'ngo-4',
      ngoName: 'Paws & Tails Shelter',
      title: 'Critical Animal Hospital Expansion',
      description: 'Funding the construction of 8 dedicated recovery cages and a veterinary isolation ward to house sick stray dogs and cats recovering from road traffic accidents and infectious diseases.',
      targetAmount: 300000,
      raisedAmount: 50000,
      category: 'Animal Welfare',
      banner: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=800',
      expectedImpact: {
        bracket1: '₹1,000 covers 5 stray dogs rabies vaccinations and anti-parasitic treatment.',
        bracket2: '₹5,000 sponsors 1 animal surgery, surgeon fee, and post-op painkillers.',
        bracket3: '₹15,000 pays for 1 high-grade stainless steel critical recovery cage.',
      },
      beneficiariesCount: 300,
      active: true,
      trustIndicators: ['Veterinarian Onsite', 'FCRA Pending Approval']
    }
  ],

  trackedDonations: [
    {
      id: 'tr-1',
      campaignId: 'c-1',
      campaignTitle: 'Digital Labs for Rural Girls',
      ngoId: 'ngo-2',
      ngoName: 'Vidyoday Foundation',
      amount: 5000,
      date: '2026-06-05',
      currentStage: 'Purchased',
      stages: [
        {
          id: 's1',
          name: 'Donation Received',
          status: 'completed',
          timestamp: '2026-06-05 10:14 AM',
          description: 'Donation of ₹5,000 processed successfully and securely allocated to the campaign ledger.'
        },
        {
          id: 's2',
          name: 'Funds Allocated',
          status: 'completed',
          timestamp: '2026-06-06 02:45 PM',
          description: 'Funds combined with other donor contributions and pooled into the digital equipment purchase order.',
        },
        {
          id: 's3',
          name: 'Resources Purchased',
          status: 'completed',
          timestamp: '2026-06-09 11:30 AM',
          description: 'Purchased 20 computer routers, server equipment, and digital science learning toolkits.',
          evidence: {
            type: 'invoice',
            name: 'PO-2026-049_Vidyoday.pdf',
            url: '#',
            isAiVerified: true,
            verificationNotes: 'AI matching: Vendor invoice description corresponds to networking hardware and primary digital textbooks for Girls Public School Pune.'
          }
        },
        {
          id: 's4',
          name: 'Proof Uploaded',
          status: 'current',
          timestamp: 'Pending upload...',
          description: 'NGO uploading delivery receipt and photographs of equipment arriving at school.',
        },
        {
          id: 's5',
          name: 'Verified',
          status: 'pending',
          timestamp: 'Waiting for proof...',
          description: 'Platform auditors verify physical assets and cross-check serial numbers with receipts.',
        },
        {
          id: 's6',
          name: 'Impact Delivered',
          status: 'pending',
          timestamp: 'Waiting for deployment...',
          description: 'Student learning dashboard activation and first training lesson commencement.',
        }
      ]
    },
    {
      id: 'tr-2',
      campaignId: 'c-2',
      campaignTitle: 'Rural Pediatric Medical Camps',
      ngoId: 'ngo-1',
      ngoName: 'Sanjeevani Health Trust',
      amount: 1500,
      date: '2026-05-20',
      currentStage: 'Delivered',
      stages: [
        {
          id: 'st-1',
          name: 'Donation Received',
          status: 'completed',
          timestamp: '2026-05-20 09:00 AM',
          description: 'Donation of ₹1,500 received and credited.'
        },
        {
          id: 'st-2',
          name: 'Funds Allocated',
          status: 'completed',
          timestamp: '2026-05-20 04:00 PM',
          description: 'Allocated for medication purchase ledger (Pediatric antibiotics and syrups).',
        },
        {
          id: 'st-3',
          name: 'Resources Purchased',
          status: 'completed',
          timestamp: '2026-05-23 10:15 AM',
          description: 'Purchased 40 pediatric wellness kits and antibiotics from MedPlus Pharma.',
          evidence: {
            type: 'invoice',
            name: 'MED_INV_77491.pdf',
            url: '#',
            isAiVerified: true,
            verificationNotes: 'Invoice scanned. Items: Vitamin-D drops, Amoxicillin suspensions, Paracetamol syrups.'
          }
        },
        {
          id: 'st-4',
          name: 'Proof Uploaded',
          status: 'completed',
          timestamp: '2026-05-25 05:00 PM',
          description: 'Uploaded medical camp attendance records and photographs.',
          evidence: {
            type: 'photo',
            name: 'camp_diagnostic_photos.jpg',
            url: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=300',
            isAiVerified: true,
            verificationNotes: 'AI Face & Location Verification matched geo-tag coords 24.5854° N (Udaipur District) with child consent guidelines.'
          }
        },
        {
          id: 'st-5',
          name: 'Verified',
          status: 'completed',
          timestamp: '2026-05-26 11:20 AM',
          description: 'Admin audit complete. Medical camp verified by Chief Medical Officer Dr. R. K. Patel.',
          evidence: {
            type: 'certificate',
            name: 'Verification_Stamp_CMO.pdf',
            url: '#',
            isAiVerified: false,
            verificationNotes: 'Audited and certified by Admin Auditor Sarah Jenkins.'
          }
        },
        {
          id: 'st-6',
          name: 'Impact Delivered',
          status: 'completed',
          timestamp: '2026-05-27 06:00 PM',
          description: '3 children received diagnosis, vaccinations, and a 3-month nutritional supply package.',
        }
      ]
    }
  ],

  feedPosts: [
    {
      id: 'p-1',
      ngoId: 'ngo-2',
      ngoName: 'Vidyoday Foundation',
      ngoLogo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=60',
      type: 'evidence',
      title: 'Digital routers and server hubs arrive in Pune School!',
      content: 'Exciting news! The first batch of hardware has been delivered to Government Girls High School in Ambegaon. The boxes contain 5 network switches, high-speed Wi-Fi routers, and 15 student keyboards sponsored entirely by donors in this quarter. Real-time installation begins tomorrow.',
      timestamp: 'Yesterday at 3:15 PM',
      image: 'https://images.unsplash.com/photo-1577896851231-70ee18881754?auto=format&fit=crop&q=80&w=600',
      document: {
        name: 'INVOICE-NET-8820.pdf',
        size: '342 KB',
        url: '#'
      },
      aiSummary: 'Hardware matched delivery order list. Serial numbers matches registered inventory catalog for Campaign "Digital Labs".',
      likes: 42,
      comments: 7,
      hasLiked: false,
    },
    {
      id: 'p-2',
      ngoId: 'ngo-1',
      ngoName: 'Sanjeevani Health Trust',
      ngoLogo: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=60',
      type: 'story',
      title: 'Meet Priya - A Story of Real Health Impact',
      content: 'Priya, aged 11, was suffering from acute chronic anemia and frequent dizzy spells, which caused her to miss more than 15 school days last month. Thanks to the diagnostics and pediatric supplements funded under the Udaipur medical camp, Priya received correct iron therapeutic care. Within 4 weeks, her hemoglobin level jumped from 7.5 to 11.2, and she is happily back in school, achieving 95% attendance this month!',
      timestamp: '3 days ago',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600',
      likes: 128,
      comments: 18,
      hasLiked: true,
    },
    {
      id: 'p-3',
      ngoId: 'ngo-3',
      ngoName: 'Green Canopy Initiative',
      ngoLogo: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=60',
      type: 'milestone',
      title: 'First Miyawaki Forest site completed in Whitefield!',
      content: 'We have successfully planted 3,000 indigenous trees (Neem, Jamun, Peepal, Pongamia) at our site in Whitefield, Bengaluru. Over 150 local corporate volunteers and children helped during the weekend. The soil bed has been deeply enriched with organic manure and agricultural waste. This completes Stage 1 of our campaign!',
      timestamp: '5 days ago',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
      likes: 95,
      comments: 12,
      hasLiked: false,
    }
  ],

  toggleFollowNGO: (ngoId) => set((state) => {
    const isFollowing = state.followedNgos.includes(ngoId);
    const updated = isFollowing
      ? state.followedNgos.filter(id => id !== ngoId)
      : [...state.followedNgos, ngoId];
    
    // Update count in ngos list
    const updatedNgos = state.ngos.map(n => {
      if (n.id === ngoId) {
        return { ...n, followersCount: n.followersCount + (isFollowing ? -1 : 1) };
      }
      return n;
    });

    return { 
      followedNgos: updated,
      ngos: updatedNgos
    };
  }),

  donate: (campaignId, amount, donorName) => set((state) => {
    const campaign = state.campaigns.find(c => c.id === campaignId);
    if (!campaign) return {};
    
    // Update campaign raisedAmount
    const updatedCampaigns = state.campaigns.map(c => {
      if (c.id === campaignId) {
        return { ...c, raisedAmount: Math.min(c.targetAmount, c.raisedAmount + amount) };
      }
      return c;
    });

    // Create a new TrackedDonation
    const donationId = `don-${Date.now()}`;
    const newTracked: TrackedDonation = {
      id: donationId,
      campaignId,
      campaignTitle: campaign.title,
      ngoId: campaign.ngoId,
      ngoName: campaign.ngoName,
      amount,
      date: new Date().toISOString().split('T')[0],
      currentStage: 'Received',
      stages: [
        {
          id: 's1',
          name: 'Donation Received',
          status: 'completed',
          timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          description: `Donation of ₹${amount.toLocaleString()} received and allocated under name "${donorName || 'Anonymous'}".`
        },
        {
          id: 's2',
          name: 'Funds Allocated',
          status: 'current',
          timestamp: 'Processing...',
          description: 'Funds are being queued for release to purchase request cycles.'
        },
        {
          id: 's3',
          name: 'Resources Purchased',
          status: 'pending',
          timestamp: 'Waiting for allocation...',
          description: 'Receipts and bills will be published here upon procurement.'
        },
        {
          id: 's4',
          name: 'Proof Uploaded',
          status: 'pending',
          timestamp: 'Waiting for shipment...',
          description: 'Evidence images and invoices will be uploaded by the NGO team.'
        },
        {
          id: 's5',
          name: 'Verified',
          status: 'pending',
          timestamp: 'Waiting for review...',
          description: 'Platform auditors and AI system will inspect proofs for compliance.'
        },
        {
          id: 's6',
          name: 'Impact Delivered',
          status: 'pending',
          timestamp: 'Pending deployment...',
          description: 'Beneficiary tracking, feedback photos, and project conclusion.'
        }
      ]
    };

    // Add to notifications
    const newNotification: AppNotification = {
      id: `n-${Date.now()}`,
      title: 'Donation Confirmed 💚',
      description: `Thank you! Your donation of ₹${amount.toLocaleString()} to "${campaign.title}" is now being tracked live.`,
      timestamp: 'Just now',
      type: 'donation',
      read: false,
    };

    return {
      campaigns: updatedCampaigns,
      trackedDonations: [newTracked, ...state.trackedDonations],
      notifications: [newNotification, ...state.notifications]
    };
  }),

  verifyDocument: (ngoId, docType, status) => set((state) => {
    const updatedNgos = state.ngos.map(n => {
      if (n.id === ngoId) {
        const updatedDocs = { ...n.documents, [docType]: status };
        // Recalculate scores based on document approvals
        const approvedCount = Object.values(updatedDocs).filter(v => v === 'Approved').length;
        const baseScore = 60 + approvedCount * 10;
        
        const updatedWhyTrust = {
          ...n.whyTrust,
          panVerified: updatedDocs.pan === 'Approved',
          g80Verified: updatedDocs.g80 === 'Approved',
          a12Verified: updatedDocs.a12 === 'Approved',
          fcraVerified: updatedDocs.fcra === 'Approved',
          complianceStatus: (approvedCount >= 3 ? 'Excellent' : 'Good') as any,
          riskRating: (approvedCount >= 3 ? 'Low' : 'Medium') as any,
          aiVerificationStatus: (approvedCount >= 3 ? 'Active' : 'Inactive') as any,
          lastAuditDate: status === 'Approved' ? new Date().toISOString().split('T')[0] : n.whyTrust.lastAuditDate
        };

        const updatedTrustBreakdown = {
          ...n.trustBreakdown,
          documentsVerified: Math.round((approvedCount / 4) * 100),
          auditQuality: approvedCount > 0 ? 80 + approvedCount * 4 : 50,
        };

        return {
          ...n,
          documents: updatedDocs,
          verifiedStatus: approvedCount >= 3,
          trustScore: Math.min(99, baseScore + 5),
          transparencyScore: Math.min(99, baseScore + 8),
          trustBreakdown: updatedTrustBreakdown,
          whyTrust: updatedWhyTrust
        };
      }
      return n;
    });

    const ngo = state.ngos.find(n => n.id === ngoId);
    const notification: AppNotification = {
      id: `n-${Date.now()}`,
      title: 'NGO Document Audited',
      description: `Document "${docType.toUpperCase()}" for ${ngo?.name} has been marked as ${status}.`,
      timestamp: 'Just now',
      type: 'verification',
      read: false,
    };

    return {
      ngos: updatedNgos,
      notifications: [notification, ...state.notifications]
    };
  }),

  approveCampaign: (campaignId) => set((state) => {
    const updatedCampaigns = state.campaigns.map(c => {
      if (c.id === campaignId) {
        return { ...c, active: true };
      }
      return c;
    });

    return { campaigns: updatedCampaigns };
  }),

  uploadProof: (campaignId, stageName, description, evidenceName, evidenceType) => set((state) => {
    // Find the tracked donation corresponding to this campaign
    const updatedTracked = state.trackedDonations.map(don => {
      if (don.campaignId === campaignId) {
        const timestampStr = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        let newStage: 'Received' | 'Allocated' | 'Purchased' | 'Uploaded' | 'Verified' | 'Delivered' = don.currentStage;
        if (stageName.includes('Allocate')) newStage = 'Allocated';
        else if (stageName.includes('Purchase')) newStage = 'Purchased';
        else if (stageName.includes('Proof') || stageName.includes('Upload')) newStage = 'Uploaded';
        else if (stageName.includes('Verify') || stageName.includes('Audited')) newStage = 'Verified';
        else if (stageName.includes('Deliver') || stageName.includes('Impact')) newStage = 'Delivered';

        const updatedStages = don.stages.map(st => {
          if (st.name.toLowerCase().includes(stageName.toLowerCase())) {
            return {
              ...st,
              status: 'completed' as const,
              timestamp: timestampStr,
              description: description,
              evidence: {
                type: evidenceType,
                name: evidenceName,
                url: '#',
                isAiVerified: true,
                verificationNotes: `Automated scan complete: Verified receipt amount matches pool disbursements. Doc structure validated.`
              }
            };
          }
          // Set next stage as current
          if (st.name === 'Proof Uploaded' && stageName.includes('Purchase')) {
            return { ...st, status: 'current' as const };
          }
          if (st.name === 'Verified' && stageName.includes('Upload')) {
            return { ...st, status: 'current' as const };
          }
          if (st.name === 'Impact Delivered' && stageName.includes('Verify')) {
            return { ...st, status: 'current' as const };
          }
          return st;
        });

        return {
          ...don,
          currentStage: newStage,
          stages: updatedStages
        };
      }
      return don;
    });

    // Also add to global Feed posts so users can see
    const campaign = state.campaigns.find(c => c.id === campaignId);
    let postType: FeedPost['type'] = 'evidence';
    if (evidenceType === 'photo') postType = 'story';
    if (evidenceType === 'report') postType = 'milestone';

    const newPost: FeedPost = {
      id: `p-${Date.now()}`,
      ngoId: campaign?.ngoId || 'ngo-1',
      ngoName: campaign?.ngoName || 'Unknown NGO',
      ngoLogo: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=60',
      type: postType,
      title: `Proof Uploaded: ${evidenceName}`,
      content: description,
      timestamp: 'Just now',
      image: evidenceType === 'photo' ? 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=600' : undefined,
      document: evidenceType === 'invoice' ? { name: evidenceName, size: '150 KB', url: '#' } : undefined,
      aiSummary: 'AI matched invoice values and verify shipment tracking with verified vendor records.',
      likes: 0,
      comments: 0,
      hasLiked: false,
    };

    return {
      trackedDonations: updatedTracked,
      feedPosts: [newPost, ...state.feedPosts]
    };
  }),

  addCampaign: (campaignData) => set((state) => {
    const myNgo = state.ngos.find(n => n.id === state.activeNgoId) || state.ngos.find(n => n.id === 'ngo-2')!;
    const newCampaign: Campaign = {
      ...campaignData,
      id: `c-${Date.now()}`,
      ngoId: myNgo.id,
      ngoName: myNgo.name,
      raisedAmount: 0,
      active: true,
      trustIndicators: ['Verified NGO', 'Zero Fee Direct Route', 'Timeline Tracked']
    };

    return {
      campaigns: [newCampaign, ...state.campaigns]
    };
  }),

  addFeedPost: (postData) => set((state) => {
    const newPost: FeedPost = {
      ...postData,
      id: `p-${Date.now()}`,
      ngoLogo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=60',
      timestamp: 'Just now',
      likes: 0,
      comments: 0
    };

    return {
      feedPosts: [newPost, ...state.feedPosts]
    };
  }),

  markNotificationsAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  registerNgo: (ngoData) => set((state) => {
    const newNgoId = `ngo-${Date.now()}`;
    const newNgo: NGO = {
      id: newNgoId,
      name: ngoData.name,
      logo: ngoData.logo || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=120',
      banner: ngoData.coverImage || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      tagline: ngoData.mission.substring(0, 60) + '...',
      mission: ngoData.mission,
      story: ngoData.description,
      category: ngoData.category,
      location: ngoData.location,
      verifiedStatus: false,
      trustScore: 60,
      transparencyScore: 50,
      impactScore: 70,
      verificationScore: 50,
      followersCount: 0,
      beneficiariesReached: 0,
      documents: {
        pan: ngoData.panUploaded ? 'Pending' : 'Not Submitted',
        g80: ngoData.g80Uploaded ? 'Pending' : 'Not Submitted',
        a12: ngoData.a12Uploaded ? 'Pending' : 'Not Submitted',
        fcra: ngoData.fcraUploaded ? 'Pending' : 'Not Submitted',
      },
      gallery: [],
      campaignSuccessRate: 0,
      projectsCompleted: 0,
      yearsActive: 1,
      trustBreakdown: {
        documentsVerified: 0,
        auditQuality: 50,
        proofFrequency: 0,
        donorSatisfaction: 0,
        campaignCompletion: 0,
        impactVerification: 0
      },
      whyTrust: {
        panVerified: false,
        g80Verified: false,
        a12Verified: false,
        fcraVerified: false,
        lastAuditDate: 'N/A',
        complianceStatus: 'Pending',
        riskRating: 'Medium',
        aiVerificationStatus: 'Inactive'
      },
      supportersCount: 0,
      recentDonors: [],
      communitySize: 0,
      email: ngoData.email
    };

    const newNotification: AppNotification = {
      id: `n-${Date.now()}`,
      title: 'New NGO Application 📝',
      description: `Application for "${ngoData.name}" has been received and is waiting for compliance review.`,
      timestamp: 'Just now',
      type: 'verification',
      read: false,
    };

    return {
      ngos: [...state.ngos, newNgo],
      notifications: [newNotification, ...state.notifications]
    };
  })
}));
