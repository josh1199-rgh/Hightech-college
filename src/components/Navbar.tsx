import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, GraduationCap, Sparkles } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import { useCMS } from '../context/CMSContext';

interface NavbarProps {
  onApplyClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onApplyClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { settings } = useCMS();


  // Scroll Progress Bar (Top 2px Gold line)
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Courses', href: '#courses' },
    { name: 'Campus Life', href: '#campus-life' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = ['home', 'about', 'courses', 'campus-life', 'faq', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 2px Red Scroll Progress Line at top of viewport */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-red-500 to-rose-600 z-[100] origin-left shadow-[0_0_10px_#EF4444]"
        style={{ scaleX }}
      />

      <header
        className={`fixed left-0 right-0 z-50 px-3 sm:px-6 max-w-7xl mx-auto transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
          isScrolled ? 'top-2 sm:top-3' : 'top-4 sm:top-6'
        }`}
      >
        <nav
          className={`w-full transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] rounded-[28px] border px-4 sm:px-7 flex items-center justify-between shadow-2xl ${
            isScrolled
              ? 'h-[70px] bg-slate-950/95 backdrop-blur-[20px] border-red-500/20 text-white shadow-black/40'
              : 'h-[95px] bg-slate-900/80 backdrop-blur-md border-white/15 text-white shadow-xl'
          }`}
        >
          {/* LOGO - Scales 100% -> 92% when scrolled */}
          <motion.a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            animate={{ scale: isScrolled ? 0.92 : 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2.5 group cursor-pointer select-none origin-left"
          >
            {settings.siteImages?.logoUrl ? (
              <img
                src={settings.siteImages.logoUrl}
                alt="High-Tech College Logo"
                className="h-10 w-auto object-contain max-w-[120px]"
                referrerPolicy="no-referrer"
              />
            ) : null}
            <div className="flex flex-col">
              <span className="font-playfair italic font-bold text-lg sm:text-xl tracking-tight text-white group-hover:text-red-400 transition-colors">
                High-Tech College
              </span>
              <span className="text-[10px] text-red-500 font-semibold tracking-widest uppercase opacity-90">
                Kitengela Campus
              </span>
            </div>
          </motion.a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 group ${
                    isActive
                      ? 'text-red-400 font-semibold'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  {/* Animated Underline */}
                  <span
                    className={`absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-300 ${
                      isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-70'
                    }`}
                  />
                </a>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="hidden sm:flex items-center gap-2.5">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={onApplyClick}
              className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white shadow-md hover:shadow-red-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-white" />
              <span>Apply & Enroll</span>
            </motion.button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden mt-3 rounded-[24px] bg-slate-950/95 backdrop-blur-2xl border border-red-500/20 p-5 shadow-2xl text-white"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`px-4 py-3 text-base font-medium rounded-2xl flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                        : 'text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  </a>
                );
              })}

              <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onApplyClick();
                  }}
                  className="w-full py-3 rounded-2xl text-sm font-bold bg-red-600 text-white hover:bg-red-500 shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Apply & Enroll</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </header>
    </>
  );
};


