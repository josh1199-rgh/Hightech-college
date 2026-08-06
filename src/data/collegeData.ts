import { Course, FAQItem, Statistic, StudentLifeHighlight, StudentApplication, ContactMessage, CollegeSettings, SiteImages } from '../types';

import siteHeroImage from '../assets/images/site-heroImage.jpeg';
import siteAboutTeamImage from '../assets/images/site-aboutTeamImage.jpeg';
import siteAboutApproachImage from '../assets/images/site-aboutApproachImage.jpeg';
import siteAboutProcessImage from '../assets/images/site-aboutProcessImage.jpeg';
import siteLogoUrl from '../assets/images/8.jpeg';
import siteCampusFeature1 from '../assets/images/site-campusFeature1.jpeg';
import siteCampusFeature2 from '../assets/images/site-campusFeature2.jpeg';
import siteCampusFeature3 from '../assets/images/site-campusFeature3.jpeg';
import siteCampusFeature4 from '../assets/images/site-campusFeature4.jpeg';
import siteCampusFeature5 from '../assets/images/site-campusFeature5.jpeg';
import siteCampusCommunityBanner from '../assets/images/site-campusCommunityBanner.jpeg';
import siteCampusGallery1 from '../assets/images/site-campusGallery1.jpeg';
import siteCampusGallery2 from '../assets/images/site-campusGallery2.jpeg';
import siteCampusGallery3 from '../assets/images/site-campusGallery3.jpeg';
import siteCampusGallery4 from '../assets/images/site-campusGallery4.jpeg';
import siteCampusGallery5 from '../assets/images/site-campusGallery5.jpeg';

import courseJournalismMedia from '../assets/images/course-journalism-media.jpeg';
import courseIct from '../assets/images/course-ict.jpeg';
import courseHospitality from '../assets/images/course-hospitality.jpeg';
import courseAccounts from '../assets/images/course-accounts.jpeg';
import courseBusiness from '../assets/images/course-business.jpeg';
import courseSecretarial from '../assets/images/course-secretarial.jpeg';
import courseHealthSocial from '../assets/images/course-health-social.jpeg';
import courseElectrical from '../assets/images/course-electrical.jpeg';
import courseHairdressing from '../assets/images/course-hairdressing.jpeg';

export {
  siteHeroImage,
  siteAboutTeamImage,
  siteAboutApproachImage,
  siteAboutProcessImage,
  siteLogoUrl,
  siteCampusFeature1,
  siteCampusFeature2,
  siteCampusFeature3,
  siteCampusFeature4,
  siteCampusFeature5,
  siteCampusCommunityBanner,
  siteCampusGallery1,
  siteCampusGallery2,
  siteCampusGallery3,
  siteCampusGallery4,
  siteCampusGallery5,
  courseJournalismMedia,
  courseIct,
  courseHospitality,
  courseAccounts,
  courseBusiness,
  courseSecretarial,
  courseHealthSocial,
  courseElectrical,
  courseHairdressing,
};

export const DEFAULT_SITE_IMAGES: SiteImages = {
  heroImage: siteHeroImage,
  aboutTeamImage: siteAboutTeamImage,
  aboutApproachImage: siteAboutApproachImage,
  aboutProcessImage: siteAboutProcessImage,
  logoUrl: siteLogoUrl,
  campusFeature1: siteCampusFeature1,
  campusFeature2: siteCampusFeature2,
  campusFeature3: siteCampusFeature3,
  campusFeature4: siteCampusFeature4,
  campusFeature5: siteCampusFeature5,
  campusGallery1: siteCampusGallery1,
  campusGallery2: siteCampusGallery2,
  campusGallery3: siteCampusGallery3,
  campusGallery4: siteCampusGallery4,
  campusGallery5: siteCampusGallery5,
  campusCommunityBanner: siteCampusCommunityBanner,
};

export const DEFAULT_SETTINGS: CollegeSettings = {
  announcementBanner: '🎓 MAY / SEPT 2026 INTAKE ONGOING! Register today for KSh 1,000 Early Bird Scholarship & Free Laptop Bag.',
  announcementActive: true,
  hotlinePhone: '0769313422',
  whatsappPhone: '0769313422',
  contactEmail: 'admissions@hightech.ac.ke',
  campusLocation: 'High-Tech College Kitengela Campus, Kitengela, Kajiado County, Kenya',
  ownerPin: '1234',
  siteImages: DEFAULT_SITE_IMAGES,
};

export const INITIAL_APPLICATIONS: StudentApplication[] = [
  {
    id: 'app-101',
    applicantName: 'Brian Wambua',
    email: 'brian.wambua@gmail.com',
    phone: '+254 712 345 678',
    program: 'ICT (INFORMATION & COMMUNICATION TECH)',
    kcseGrade: 'C+',
    intakePeriod: 'May 2026 Intake',
    message: 'I would like to specialize in full-stack web engineering and cybersecurity.',
    notes: 'Called candidate. Verified KCSE result slip attached.',
    status: 'Approved',
    createdAt: '2026-07-24 14:30',
  },
  {
    id: 'app-102',
    applicantName: 'Faith Chebet',
    email: 'faith.chebet@yahoo.com',
    phone: '+254 723 890 123',
    program: 'JOURNALISM AND MEDIA STUDIES',
    kcseGrade: 'B-',
    intakePeriod: 'Sept 2026 Intake',
    message: 'Interested in TV broadcasting and digital media production.',
    notes: 'Invited for campus interview next Tuesday.',
    status: 'Under Review',
    createdAt: '2026-07-25 09:15',
  },
  {
    id: 'app-103',
    applicantName: 'Kevin Mutua',
    email: 'k.mutua@outlook.com',
    phone: '+254 798 112 233',
    program: 'ELECTRICAL ENGINEERING & ELECTRONICS',
    kcseGrade: 'C',
    intakePeriod: 'May 2026 Intake',
    message: 'Requesting details regarding evening and weekend practical lab shifts.',
    notes: 'Awaiting ID copy verification.',
    status: 'Pending',
    createdAt: '2026-07-25 11:40',
  },
  {
    id: 'app-104',
    applicantName: 'Mercy Nyambura',
    email: 'mercy.nyambura@gmail.com',
    phone: '+254 711 998 877',
    program: 'ACCOUNTS (ATD, CPA, CS, CIFA)',
    kcseGrade: 'B',
    intakePeriod: 'May 2026 Intake',
    message: 'Enrolling for CPA Section 1 and 2 evening classes.',
    notes: 'Full tuition deposit paid. Student card issued.',
    status: 'Enrolled',
    createdAt: '2026-07-22 16:05',
  },
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-201',
    name: 'David Omondi',
    email: 'david.omondi@corp.co.ke',
    phone: '+254 733 445 566',
    subject: 'Corporate Internship Partnership',
    message: 'Hello Administration, our IT firm in Kitengela would like to offer internship slots to 5 top ICT graduates every term.',
    status: 'Unread',
    createdAt: '2026-07-25 10:20',
  },
  {
    id: 'msg-202',
    name: 'Sarah Kimani',
    email: 'sarah.kimani@gmail.com',
    phone: '+254 722 111 222',
    subject: 'Fee Installments Inquiry',
    message: 'Good morning, do you offer monthly installment options for Diploma in Hospitality Management?',
    status: 'Read',
    createdAt: '2026-07-24 16:50',
  },
];


export const STATISTICS: Statistic[] = [
  {
    value: '98%',
    label: 'Graduate Employment',
    sublabel: 'Hired within 6 months',
    iconName: 'Award',
  },
  {
    value: '$92,000',
    label: 'Avg Starting Salary',
    sublabel: 'For tech graduates',
    iconName: 'TrendingUp',
  },
  {
    value: '150+',
    label: 'Industry Hiring Partners',
    sublabel: 'Including top global tech firms',
    iconName: 'Building2',
  },
  {
    value: '100%',
    label: 'Hands-on Labs',
    sublabel: 'Project-based curriculum',
    iconName: 'Cpu',
  },
];

export const COURSES: Course[] = [
  {
    id: 'journalism-media',
    title: 'JOURNALISM AND MEDIA STUDIES',
    category: 'Media & Communication',
    duration: '1.5 - 2 Years',
    level: 'Diploma & Certificate',
    format: 'On-Campus Practical',
    description: 'Comprehensive training in TV/Radio broadcast journalism, digital media production, news reporting, photojournalism, and public relations.',
    skills: ['Broadcast News', 'Video Production', 'Digital PR', 'Audio Editing', 'Media Ethics'],
    nextCohort: 'May / Sept Intake',
    tuition: 'KSh 16,500 / Term',
    rating: 4.9,
    featured: true,
    image: courseJournalismMedia,
    examBody: 'KNEC / TVETA',
    location: 'Kitengela Campus, Media Hub',
  },
  {
    id: 'ict',
    title: 'ICT (INFORMATION & COMMUNICATION TECH)',
    category: 'Computing & IT',
    duration: '1 - 2 Years',
    level: 'Diploma & Certificate',
    format: 'High-Tech Fiber Lab',
    description: 'Master software engineering, networking, web development, cybersecurity, database administration, and hardware maintenance in our modern AI labs.',
    skills: ['Software Dev', 'Networking', 'Web Design', 'Database Admin', 'IT Support'],
    nextCohort: 'May / Sept Intake',
    tuition: 'KSh 18,000 / Term',
    rating: 4.95,
    featured: true,
    image: courseIct,
    examBody: 'KNEC / CDACC',
    location: 'Kitengela Campus, High-Tech Lab',
  },
  {
    id: 'hospitality',
    title: 'HOSPITALITY MANAGEMENT',
    category: 'Hospitality & Tourism',
    duration: '1.5 - 2 Years',
    level: 'Diploma & Certificate',
    format: 'Culinary Suite & Hotel Lab',
    description: 'Hands-on training in hotel administration, food & beverage management, international culinary arts, front office operations, and housekeeping.',
    skills: ['Hotel Admin', 'Culinary Arts', 'Front Office', 'Event Mgmt', 'Food Safety'],
    nextCohort: 'May / Sept Intake',
    tuition: 'KSh 17,500 / Term',
    rating: 4.88,
    featured: true,
    image: courseHospitality,
    examBody: 'KNEC / TVETA',
    location: 'Kitengela Campus, Hospitality Suite',
  },
  {
    id: 'accounts',
    title: 'ACCOUNTS (ATD, CPA, CS, CIFA)',
    category: 'Finance & Accounting',
    duration: '6 Months - 2 Years',
    level: 'Professional & Technician',
    format: 'Day / Evening / Weekend',
    description: 'Recognized professional accounting qualifications covering ATD, CPA, Certified Secretaries (CS), and Certified Financial Analysts (CIFA).',
    skills: ['Financial Accounting', 'Taxation & Audit', 'Financial Management', 'Corporate Law', 'QuickBooks'],
    nextCohort: 'May / Sept Intake',
    tuition: 'KSh 14,000 / Section',
    rating: 4.92,
    featured: true,
    image: courseAccounts,
    examBody: 'KASNEB Approved',
    location: 'Kitengela Campus, Business Center',
  },
  {
    id: 'business',
    title: 'BUSINESS MANAGEMENT & ADMINISTRATION',
    category: 'Business & Leadership',
    duration: '1 - 2 Years',
    level: 'Diploma & Certificate',
    format: 'On-Campus & Online',
    description: 'Empowering future business leaders in entrepreneurship, human resources, supply chain management, digital marketing, and sales leadership.',
    skills: ['Business Strategy', 'HR Management', 'Marketing', 'Supply Chain', 'Financial Planning'],
    nextCohort: 'May / Sept Intake',
    tuition: 'KSh 15,000 / Term',
    rating: 4.85,
    featured: false,
    image: courseBusiness,
    examBody: 'KNEC / CDACC',
    location: 'Kitengela Campus, Lecture Block A',
  },
  {
    id: 'secretarial',
    title: 'SECRETARIAL STUDIES & OFFICE ADMIN',
    category: 'Office Administration',
    duration: '1 - 1.5 Years',
    level: 'Diploma & Certificate',
    format: 'Computerized Suite',
    description: 'Executive secretarial skills, computerized document processing, shorthand, front office etiquette, business communication, and record management.',
    skills: ['Office Admin', 'Document Processing', 'Business Communication', 'Customer Care', 'Records Mgmt'],
    nextCohort: 'May / Sept Intake',
    tuition: 'KSh 14,500 / Term',
    rating: 4.82,
    featured: false,
    image: courseSecretarial,
    examBody: 'KNEC / NITA',
    location: 'Kitengela Campus, Admin Block',
  },
  {
    id: 'health-social',
    title: 'HEALTH AND SOCIAL SCIENCES',
    category: 'Health & Community',
    duration: '1.5 - 2 Years',
    level: 'Diploma & Certificate',
    format: 'Field & Community Labs',
    description: 'Practical training in Community Health & Development, Social Work, Counseling Psychology, Disaster Management, and Non-Profit Administration.',
    skills: ['Community Health', 'Social Work', 'Counseling', 'Project Management', 'Public Health'],
    nextCohort: 'May / Sept Intake',
    tuition: 'KSh 16,000 / Term',
    rating: 4.89,
    featured: false,
    image: courseHealthSocial,
    examBody: 'KNEC / TVETA',
    location: 'Kitengela Campus, Health Dept',
  },
  {
    id: 'electrical',
    title: 'ELECTRICAL ENGINEERING & ELECTRONICS',
    category: 'Technical & Engineering',
    duration: '1.5 - 2 Years',
    level: 'Diploma & Craft Certificate',
    format: 'Heavy Equipment Workshop',
    description: 'Hands-on training in electrical installation, power distribution, solar PV systems, industrial automation, circuit wiring, and safety protocols.',
    skills: ['Electrical Wiring', 'Circuit Design', 'Solar PV Systems', 'Industrial Controls', 'Safety Standards'],
    nextCohort: 'May / Sept Intake',
    tuition: 'KSh 18,500 / Term',
    rating: 4.91,
    featured: true,
    image: courseElectrical,
    examBody: 'KNEC / NITA',
    location: 'Kitengela Campus, Engineering Hub',
  },
  {
    id: 'hairdressing',
    title: 'HAIRDRESSING & BEAUTY THERAPY',
    category: 'Cosmetology & Fashion',
    duration: '6 Months - 1 Year',
    level: 'Certificate & Artisan',
    format: 'Fully Equipped Salon Lab',
    description: 'Modern hair styling, barbering, facial therapy, nail technology, bridal makeup artistry, spa treatments, and salon management.',
    skills: ['Hair Styling', 'Makeup Artistry', 'Nail Tech', 'Spa Treatments', 'Salon Management'],
    nextCohort: 'May / Sept Intake',
    tuition: 'KSh 13,500 / Term',
    rating: 4.87,
    featured: false,
    image: courseHairdressing,
    examBody: 'NITA / TVETA',
    location: 'Kitengela Campus, Beauty Salon',
  },
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Academics',
    question: 'What courses are offered at High-Tech College Kitengela Campus?',
    answer: 'We offer a variety of career-focused certificate, diploma, artisan, and professional courses in ICT, Business, Hospitality, Engineering, Health Sciences, Beauty & Cosmetology, and other technical programs.',
  },
  {
    id: 'faq-2',
    category: 'Admissions',
    question: 'How do I apply for admission?',
    answer: 'You can visit our campus to complete your application with assistance from our admissions team.',
  },
  {
    id: 'faq-3',
    category: 'Admissions',
    question: 'What are the admission requirements?',
    answer: 'Admission requirements vary depending on the course. Most programs require copies of your academic certificates, national ID or birth certificate, passport-size photos, and a completed application form.',
  },
  {
    id: 'faq-4',
    category: 'Admissions',
    question: 'When does student intake begin?',
    answer: 'We have several intakes throughout the year. contact our admissions office for the latest intake dates.',
  },
  {
    id: 'faq-5',
    category: 'Academics',
    question: 'Are your courses accredited?',
    answer: 'Yes. Our programs are offered in accordance with the relevant education and examination bodies where applicable.',
  },
  {
    id: 'faq-6',
    category: 'Academics',
    question: 'Do you offer practical training?',
    answer: 'Yes. Practical learning is a key part of our education. Students receive hands-on experience through laboratories, workshops, projects, and industrial attachment opportunities.',
  },
  {
    id: 'faq-7',
    category: 'Financial Aid',
    question: 'How much are the tuition fees?',
    answer: 'Tuition fees depend on the course you choose. Please contact our admissions office or request a fee structure for detailed information.',
  },
  {
    id: 'faq-8',
    category: 'Financial Aid',
    question: 'Can I pay my fees in installments?',
    answer: 'Yes. Flexible payment plans are available. Our finance office can advise you on the available payment options.',
  },
];

export const STUDENT_LIFE_ITEMS: StudentLifeHighlight[] = [
  {
    id: 'club-1',
    title: 'AI & Robotics Guild',
    category: 'Clubs',
    image: courseIct,
    description: 'Build autonomous drones, competitive robotics, and neural network applications with state grant funding.',
    tag: 'Weekly Labs',
  },
  {
    id: 'club-2',
    title: 'Annual 48-Hour Hackathon',
    category: 'Events',
    image: siteCampusFeature2,
    description: 'Over $25,000 in cash prizes sponsored by tech giants. Over 400 student developers competing live.',
    tag: '$25K Prizes',
  },
  {
    id: 'club-3',
    title: 'Next-Gen Esports & VR Lounge',
    category: 'Campus',
    image: siteCampusFeature3,
    description: 'High-end gaming rigs, VR simulators, and varsity esports teams competing nationally.',
    tag: '24/7 Access',
  },
  {
    id: 'club-4',
    title: 'Global Tech Exchange Program',
    category: 'Global',
    image: siteCampusFeature4,
    description: 'Spend a semester at partner tech institutes in Tokyo, Berlin, or Silicon Valley with full credit transfer.',
    tag: 'International',
  },
];
