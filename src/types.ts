export interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  format: string;
  description: string;
  skills: string[];
  nextCohort: string;
  tuition: string;
  rating: number;
  featured?: boolean;
  image: string;
  examBody: string;
  location: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Admissions' | 'Academics' | 'Financial Aid' | 'Career' | 'General';
}

export interface Statistic {
  value: string;
  label: string;
  sublabel: string;
  iconName: string;
}

export interface StudentLifeHighlight {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  tag: string;
}

export interface StudentApplication {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  program: string;
  kcseGrade?: string;
  intakePeriod: string;
  message?: string;
  notes?: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Enrolled' | 'Rejected';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Read' | 'Replied';
  createdAt: string;
}

export interface SiteImages {
  heroImage: string;
  aboutTeamImage: string;
  aboutApproachImage: string;
  aboutProcessImage: string;
  logoUrl?: string;
  // Campus Life section customizable images
  campusFeature1?: string;
  campusFeature2?: string;
  campusFeature3?: string;
  campusFeature4?: string;
  campusFeature5?: string;
  campusGallery1?: string;
  campusGallery2?: string;
  campusGallery3?: string;
  campusGallery4?: string;
  campusGallery5?: string;
  campusCommunityBanner?: string;
}

export interface CollegeSettings {
  announcementBanner: string;
  announcementActive: boolean;
  hotlinePhone: string;
  whatsappPhone: string;
  contactEmail: string;
  campusLocation: string;
  ownerPin: string;
  siteImages: SiteImages;
}

