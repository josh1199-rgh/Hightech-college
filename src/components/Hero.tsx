import React, { useRef } from 'react';
import { ArrowRight, ArrowDownRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useCMS } from '../context/CMSContext';
import { DEFAULT_SITE_IMAGES } from '../data/collegeData';
import siteHeroImage from '../assets/images/site-heroImage.jpeg';

interface HeroProps {
  onExploreCourses: () => void;
  onApplyClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCourses, onApplyClick }) => {
  const { settings } = useCMS();
  const cubicEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const heroRef = useRef<HTMLDivElement>(null);

  // Hero Scroll Fill Transformation
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Background Image Scale 100% -> 115%
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  // Overlay darkness 10% -> 35% for maximum visibility
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.1, 0.35]);
  // Text translateY 0 -> -80px and Opacity 100% -> 0%
  const textY = useTransform(scrollYProgress, [0, 0.8], [0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const handleScrollClick = () => {
    const aboutEl = document.getElementById('about');
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cmsHeroImage = settings.siteImages?.heroImage;
  const heroImageSrc = (cmsHeroImage && cmsHeroImage.trim() !== '') ? cmsHeroImage : siteHeroImage;

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen w-full flex flex-col justify-between pt-28 pb-12 px-4 sm:px-6 lg:px-12 overflow-hidden bg-slate-950 text-white"
    >
      {/* High-Tech College reception desk background image with parallax scale */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          style={{ scale: imageScale }}
          src={heroImageSrc}
          alt="High-Tech College Reception Desk"
          className="w-full h-full object-cover object-center origin-center transition-transform duration-100 ease-out brightness-105 contrast-105"
          referrerPolicy="no-referrer"
        />
        {/* Subtle translucent scroll overlay */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-slate-950"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/25 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/10 pointer-events-none" />
      </div>

      {/* Main Hero Content with Scroll Motion */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 max-w-7xl mx-auto w-full my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
      >
        {/* Left Column: Heading & Subtitle */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6 lg:space-y-8">
          {/* Main Heading styled matching display serif typography */}
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: cubicEase }}
            className="tracking-tight leading-[1.08] text-white drop-shadow-2xl"
          >
            <span className="block font-playfair text-4xl sm:text-6xl lg:text-7xl font-normal text-slate-100 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              Shape Your Future at
            </span>
            <span className="block font-playfair italic font-extrabold text-5xl sm:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-white to-red-300 mt-1 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              High-Tech College
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: cubicEase }}
            className="text-lg sm:text-2xl text-slate-100 max-w-2xl font-light leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          >
            Professional Skills. Practical Training. Career Success.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: cubicEase }}
            className="pt-2 flex flex-wrap items-center gap-4 w-full sm:w-auto"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={onExploreCourses}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white font-bold text-base sm:text-lg shadow-xl shadow-red-600/30 hover:shadow-red-600/50 transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Floating Bar */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-end pt-4">
        {/* Bottom Right: Signature Circular Red "Learn More ↘" Button */}
        <motion.button
          whileHover={{ scale: 1.08, rotate: 3 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleScrollClick}
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold flex flex-col items-center justify-center shadow-2xl shadow-red-950/50 transition-all duration-300 cursor-pointer group shrink-0 border-4 border-slate-900/80"
        >
          <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
            Learn More
          </span>
          <ArrowDownRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:translate-x-1 group-hover:translate-y-1 transition-transform mt-0.5" />
        </motion.button>
      </div>
    </section>
  );
};

