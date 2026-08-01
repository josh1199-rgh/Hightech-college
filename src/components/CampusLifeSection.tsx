import React, { useState, useEffect, useRef } from 'react';
import { useCMS } from '../context/CMSContext';
import { DEFAULT_SITE_IMAGES } from '../data/collegeData';

import { motion, useInView } from 'motion/react';
import { LazyImage } from './LazyImage';
import {
  Monitor,
  Utensils,
  Activity,
  Users,
  Settings,
  GraduationCap,
  Building2,
  Trophy,
  ArrowRight,
  X,
  Maximize2
} from 'lucide-react';

const cubicEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface CampusLifeSectionProps {
  onApplyClick?: () => void;
}

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
}

interface GalleryPhoto {
  id: number;
  title: string;
  image: string;
  category: string;
}

const sectionVariant = {
  hidden: { opacity: 0, y: 80, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: cubicEase },
  },
};

// Animated Number Counter Component
const AnimatedStat: React.FC<{ value: number; suffix?: string; label: string; icon: React.ReactNode }> = ({
  value,
  suffix = '',
  label,
  icon,
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000; // 2 seconds
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out cubic
      const currentCount = Math.round(value * (1 - Math.pow(1 - progress, 3)));
      setCount(currentCount);

      if (frame >= totalFrames) {
        clearInterval(timer);
        setCount(value);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 shadow-xs">
      <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-playfair tracking-tight">
          {count}
          {suffix}
        </div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
};

export const CampusLifeSection: React.FC<CampusLifeSectionProps> = ({ onApplyClick }) => {
  const { settings } = useCMS();
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const siteImg = settings.siteImages || DEFAULT_SITE_IMAGES;

  const featureCards: FeatureCard[] = [
    {
      id: 'learning-spaces',
      title: 'Modern Learning Spaces',
      description: 'Equipped labs and smart classrooms for practical, hands-on learning.',
      image: siteImg.campusFeature1 || DEFAULT_SITE_IMAGES.campusFeature1!,
      icon: <Monitor className="w-5 h-5 text-red-600" />,
    },
    {
      id: 'practical-training',
      title: 'Practical Training',
      description: 'Real-world training in hospitality, health, ICT, engineering and more.',
      image: siteImg.campusFeature2 || DEFAULT_SITE_IMAGES.campusFeature2!,
      icon: <Utensils className="w-5 h-5 text-red-600" />,
    },
    {
      id: 'sports-recreation',
      title: 'Sports & Recreation',
      description: 'Stay active, build teamwork and enjoy a healthy campus lifestyle.',
      image: siteImg.campusFeature3 || DEFAULT_SITE_IMAGES.campusFeature3!,
      icon: <Activity className="w-5 h-5 text-red-600" />,
    },
    {
      id: 'clubs-societies',
      title: 'Student Clubs & Societies',
      description: 'Join clubs, explore your interests and grow your talents.',
      image: siteImg.campusFeature4 || DEFAULT_SITE_IMAGES.campusFeature4!,
      icon: <Users className="w-5 h-5 text-red-600" />,
    },
    {
      id: 'innovation-tech',
      title: 'Innovation & Technology',
      description: 'Hands-on experience with modern tools and emerging technologies.',
      image: siteImg.campusFeature5 || DEFAULT_SITE_IMAGES.campusFeature5!,
      icon: <Settings className="w-5 h-5 text-red-600" />,
    },
  ];

  const galleryPhotos: GalleryPhoto[] = [
    {
      id: 1,
      title: 'Graduation & Milestone Celebrations',
      category: 'Events',
      image: siteImg.campusGallery1 || DEFAULT_SITE_IMAGES.campusGallery1!,
    },
    {
      id: 2,
      title: 'Kitengela Campus Architecture & Grounds',
      category: 'Facilities',
      image: siteImg.campusGallery2 || DEFAULT_SITE_IMAGES.campusGallery2!,
    },
    {
      id: 3,
      title: 'Collaborative Classrooms & Group Study',
      category: 'Academics',
      image: siteImg.campusGallery3 || DEFAULT_SITE_IMAGES.campusGallery3!,
    },
    {
      id: 4,
      title: 'Science & Hospitality Practical Suite',
      category: 'Practicals',
      image: siteImg.campusGallery4 || DEFAULT_SITE_IMAGES.campusGallery4!,
    },
    {
      id: 5,
      title: 'Outdoor Student Gathering & Lawn Discussions',
      category: 'Student Life',
      image: siteImg.campusGallery5 || DEFAULT_SITE_IMAGES.campusGallery5!,
    },
  ];

  return (
    <section id="campus-life" className="bg-white text-slate-900 py-16 sm:py-24 px-4 sm:px-6 lg:px-12 font-inter transition-colors overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariant}
        className="max-w-7xl mx-auto space-y-16"
      >
        
        {/* 1. HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          {/* Title */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-playfair font-bold text-[#0F172A] tracking-tight">
            More Than Just Classrooms
          </h2>

          {/* Underline Bar */}
          <div className="w-12 h-1 bg-red-600 rounded-full mx-auto my-3" />

          {/* Subtitle */}
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-1">
            At High-Tech College Kitengela Campus, we believe in nurturing the whole student.
            From state-of-the-art facilities to exciting activities, every moment on campus is
            designed to help you discover your potential and build lifelong connections.
          </p>
        </div>

        {/* 2. FEATURE CARDS GRID WITH 3D TILT EFFECT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featureCards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -12, rotateX: -2, rotateY: 3, filter: 'drop-shadow(0 25px 50px -12px rgba(0, 0, 0, 0.12))' }}
              className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm transition-all duration-400 flex flex-col group cursor-pointer"
            >
              {/* Photo */}
              <div className="h-52 sm:h-56 overflow-hidden relative bg-slate-100">
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Icon & Text Content */}
              <div className="p-5 sm:p-6 flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform">
                  {card.icon}
                </div>

                {/* Text Details */}
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#0F172A] group-hover:text-red-700 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3. MOMENTS THAT SHAPE OUR JOURNEY - COLLAGE & CALLOUT */}
        <div className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Box (Callout) */}
            <div className="lg:col-span-4 bg-[#F8FAFC] border border-slate-200/80 rounded-3xl p-8 sm:p-10 flex flex-col justify-center space-y-6">
              <div className="space-y-3">
                <h3 className="text-3xl sm:text-4xl font-playfair font-bold text-[#0F172A] leading-tight">
                  Moments That Shape Our Journey
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed pt-2">
                  From learning and collaboration to celebrations and adventures, campus life is full of experiences that inspire us every day.
                </p>
              </div>
            </div>

            {/* Right Side Photo Collage (Cascading stagger entry) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryPhotos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  onClick={() => setSelectedPhoto(photo)}
                  className={`${
                    i === 0
                      ? 'sm:col-span-2 lg:col-span-2 h-52 sm:h-60'
                      : i === 1
                      ? 'sm:col-span-1 lg:col-span-1 h-52 sm:h-60'
                      : 'h-44 sm:h-48'
                  } rounded-2xl overflow-hidden relative cursor-pointer group shadow-xs border border-slate-200/60`}
                >
                  <LazyImage
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    fallback={DEFAULT_SITE_IMAGES.campusGallery1}
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors" />
                  <div className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}

            </div>

          </div>
        </div>

        {/* 5. BOTTOM BANNER ("Be Part of Our Community") */}
        <div className="relative rounded-3xl overflow-hidden bg-[#0A1628] text-white shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-red-500 leading-tight">
                Be Part of Our Community
              </h2>
              <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-md">
                Join a campus that feels like home and prepares you for a successful future.
              </p>
              <div>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onApplyClick}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-3.5 rounded-full text-sm inline-flex items-center gap-2 transition-all shadow-lg cursor-pointer"
                >
                  <span>Apply Today</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </motion.button>
              </div>
            </div>

            {/* Right Photo Banner */}
            <div className="lg:col-span-6 h-64 sm:h-80 lg:h-full min-h-[320px] relative">
              <img
                src={siteImg.campusCommunityBanner || DEFAULT_SITE_IMAGES.campusCommunityBanner!}
                alt="Students walking on Kitengela Campus pathway"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] via-transparent to-transparent hidden lg:block" />
            </div>

          </div>
        </div>

      </motion.div>

      {/* LIGHTBOX MODAL FOR GALLERY */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-5xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-[80vh] bg-slate-900">
              <LazyImage
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
                fallback={DEFAULT_SITE_IMAGES.campusGallery1}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CampusLifeSection;
