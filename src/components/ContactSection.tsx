import React, { useState, useEffect } from 'react';
import {
  Phone,
  Clock,
  MapPin,
  Calendar,
  Facebook,
  Instagram,
  Linkedin,
  MessageSquare,
  Send,
  X,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCMS } from '../context/CMSContext';

interface ContactSectionProps {
  initialProgram?: string;
}

const sectionVariant = {
  hidden: { opacity: 0, y: 80, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export const ContactSection: React.FC<ContactSectionProps> = ({ initialProgram }) => {
  const { settings, addMessage } = useCMS();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState(initialProgram ? `Application Enquiry: ${initialProgram}` : '');
  const [messageText, setMessageText] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-()]/g, '');
    return /^\+?[\d]{10,15}$/.test(cleaned);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!name.trim()) return;
    if (!validatePhone(phone)) return;
    if (email && !validateEmail(email)) return;
    if (!messageText.trim()) return;

    setIsSubmitting(true);

    addMessage({
      name: name.trim(),
      email: email.trim() || 'Not provided',
      phone: phone.trim(),
      subject: subject.trim() || 'General Course Enquiry',
      message: messageText.trim(),
    });

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setIsMessageModalOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessageText('');
      setIsSubmitting(false);
    }, 2000);
  };

  useEffect(() => {
    return () => setIsSubmitting(false);
  }, []);

  useEffect(() => {
    if (!isMessageModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMessageModalOpen(false);
      }
      if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMessageModalOpen]);

  return (
    <section id="contact" className="py-16 sm:py-24 bg-[#F8F9FD] text-slate-900 font-inter relative overflow-hidden">
      
      {/* Background Subtle Wireframe Grid / Circles Pattern */}
      <div className="absolute top-10 left-10 w-96 h-96 pointer-events-none opacity-40">
        <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="80" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="60" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="100" cy="100" r="40" stroke="#E2E8F0" strokeWidth="1" />
          {Array.from({ length: 12 }).map((_, i) => (
            <circle
              key={i}
              cx={40 + (i % 4) * 40}
              cy={40 + Math.floor(i / 4) * 40}
              r="1.5"
              fill="#CBD5E1"
            />
          ))}
        </svg>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariant}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ================= LEFT SIDE: Red Telephone Graphic & Header Info ================= */}
          <div className="lg:col-span-6 relative flex flex-col justify-center space-y-8 min-h-[320px] sm:min-h-[420px] lg:min-h-[520px]">
            
            {/* Red Vintage Telephone Handset Illustration with Coiled Wire */}
            <div className="relative w-full max-w-lg mx-auto lg:mx-0 flex flex-col items-start">
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center w-full">
                {/* 3D Stylized Red Phone Handset with Floating Cord Animation */}
                <div className="sm:col-span-5 flex justify-center sm:justify-start">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative w-36 h-80 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  >
                    <svg viewBox="0 0 140 320" fill="none" className="w-full h-full">
                      <defs>
                        <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FF3B30" />
                          <stop offset="50%" stopColor="#E0241A" />
                          <stop offset="100%" stopColor="#990000" />
                        </linearGradient>
                        <radialGradient id="earPieceGrad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#FF4D4D" />
                          <stop offset="70%" stopColor="#C41212" />
                          <stop offset="100%" stopColor="#660000" />
                        </radialGradient>
                        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="4" dy="12" stdDeviation="10" floodColor="#990000" floodOpacity="0.35" />
                        </filter>
                      </defs>

                      {/* Top Earpiece Cup */}
                      <g filter="url(#dropShadow)">
                        <ellipse cx="70" cy="55" rx="42" ry="42" fill="url(#earPieceGrad)" stroke="#B30000" strokeWidth="3" />
                        <ellipse cx="70" cy="55" rx="32" ry="32" fill="#B30000" />
                        <ellipse cx="70" cy="55" rx="22" ry="22" fill="#800000" />
                        {/* Spiral earpiece holes */}
                        <circle cx="70" cy="55" r="4" fill="#1A0000" />
                        <circle cx="70" cy="43" r="2.5" fill="#1A0000" />
                        <circle cx="70" cy="67" r="2.5" fill="#1A0000" />
                        <circle cx="58" cy="55" r="2.5" fill="#1A0000" />
                        <circle cx="82" cy="55" r="2.5" fill="#1A0000" />
                        <circle cx="61" cy="46" r="2" fill="#1A0000" />
                        <circle cx="79" cy="64" r="2" fill="#1A0000" />
                        <circle cx="61" cy="64" r="2" fill="#1A0000" />
                        <circle cx="79" cy="46" r="2" fill="#1A0000" />
                      </g>

                      {/* Main Vertical Handle Body */}
                      <path
                        d="M 46 88 C 46 88 44 140 44 160 C 44 180 46 232 46 232 C 46 232 94 232 94 232 C 94 232 96 180 96 160 C 96 140 94 88 94 88 Z"
                        fill="url(#redGradient)"
                        filter="url(#dropShadow)"
                      />

                      {/* "02" White Text Badge on Handle */}
                      <text x="70" y="125" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1">
                        02
                      </text>

                      {/* Circle Button on Handle */}
                      <circle cx="70" cy="160" r="10" fill="#B30000" stroke="#FF6666" strokeWidth="1.5" />
                      <circle cx="70" cy="160" r="5" fill="#E0241A" />

                      {/* Bottom Mouthpiece Cup */}
                      <g filter="url(#dropShadow)">
                        <ellipse cx="70" cy="265" rx="42" ry="42" fill="url(#earPieceGrad)" stroke="#B30000" strokeWidth="3" />
                        <ellipse cx="70" cy="265" rx="32" ry="32" fill="#B30000" />
                        <ellipse cx="70" cy="265" rx="22" ry="22" fill="#800000" />
                        {/* Spiral holes */}
                        <circle cx="70" cy="265" r="4" fill="#1A0000" />
                        <circle cx="70" cy="253" r="2.5" fill="#1A0000" />
                        <circle cx="70" cy="277" r="2.5" fill="#1A0000" />
                        <circle cx="58" cy="265" r="2.5" fill="#1A0000" />
                        <circle cx="82" cy="265" r="2.5" fill="#1A0000" />
                        <circle cx="61" cy="256" r="2" fill="#1A0000" />
                        <circle cx="79" cy="274" r="2" fill="#1A0000" />
                        <circle cx="61" cy="274" r="2" fill="#1A0000" />
                        <circle cx="79" cy="256" r="2" fill="#1A0000" />
                      </g>
                    </svg>
                  </motion.div>
                </div>

                {/* Text Content */}
                <div className="sm:col-span-7 space-y-4">
                  
                  {/* Eyebrow Label */}
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 font-bold text-xs tracking-wider uppercase">
                      GET IN TOUCH
                    </span>
                    <span className="w-6 h-[2px] bg-red-600 inline-block"></span>
                  </div>

                  {/* Main Headline */}
                  <h2 className="text-4xl sm:text-5xl font-black text-[#0B132A] tracking-tight leading-[1.1]">
                    We’re Here <br /> to Help
                  </h2>

                  {/* Description Paragraph */}
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-sm pt-1">
                    Reach out to us through any of the channels on the side. We’re ready to assist you.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* ================= RIGHT SIDE: 4 Stacked Channel Cards ================= */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* CARD 1: HOTLINE */}
            <motion.a
              href={`tel:${settings.hotlinePhone}`}
              whileHover={{ y: -4, shadow: '0 10px 25px -5px rgba(0,0,0,0.08)' }}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 transition-all flex items-center justify-between gap-5 cursor-pointer block"
            >
                 <div className="flex items-center gap-5">
                 {/* Red Circle Phone Icon */}
                 <div className="w-12 h-12 rounded-full bg-[#E0241A] text-white flex items-center justify-center shrink-0 shadow-md">
                   <Phone className="w-6 h-6 fill-current" />
                 </div>

                {/* Text Info */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                      HOTLINE
                    </span>
                    <span className="w-5 h-[2px] bg-red-600 inline-block"></span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0B132A] tracking-tight">
                    {settings.hotlinePhone}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Call our admissions hotline directly.
                  </p>
                </div>
              </div>
            </motion.a>

            {/* CARD 2: WHATSAPP */}
            <motion.a
              href={`https://wa.me/${settings.whatsappPhone.replace(/[^0-9]/g, '').replace(/^0/, '254')}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4, shadow: '0 10px 25px -5px rgba(0,0,0,0.08)' }}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 transition-all flex items-center gap-5 cursor-pointer block"
            >
              {/* Green Circle WhatsApp Icon */}
              <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>

              {/* Text Info */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#25D366] uppercase tracking-wider">
                    WHATSAPP
                  </span>
                  <span className="w-5 h-[2px] bg-[#25D366] inline-block"></span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#0B132A] tracking-tight">
                  {settings.whatsappPhone}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Instant response on WhatsApp.
                </p>
              </div>
            </motion.a>

            {/* CARD 3: OFFICE HOURS (Dark Blue Card) */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-[#070F22] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800"
            >
              
              <div className="flex items-start gap-5">
                {/* Red Circle Clock Icon */}
                <div className="w-12 h-12 rounded-full bg-[#E0241A] text-white flex items-center justify-center shrink-0 shadow-md">
                  <Clock className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                      OFFICE HOURS
                    </span>
                    <span className="w-5 h-[2px] bg-red-500 inline-block"></span>
                  </div>

                  {/* Hours Grid */}
                  <div className="space-y-2 text-xs sm:text-sm font-medium">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                        <span className="text-slate-200">Monday – Friday</span>
                      </div>
                      <span className="font-bold text-white">8:00 AM – 5:00 PM</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                        <span className="text-slate-200">Saturday</span>
                      </div>
                      <span className="font-bold text-white">8:00 AM – 1:00 PM</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                        <span className="text-slate-200">Sunday</span>
                      </div>
                      <span className="font-bold text-white">Closed</span>
                    </div>
                  </div>

                  {/* Divider Line */}
                  <div className="border-t border-slate-800/80 pt-3" />

                  {/* Closed on public holidays note */}
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                    <Calendar className="w-4 h-4 text-red-500 shrink-0" />
                    <span>We are closed on public holidays.</span>
                  </div>
                </div>
              </div>

            </motion.div>

            {/* CARD 4: OUR LOCATION (With Map specified coordinates 32.7314, -117.2139 / -1.4810, 36.9601) */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 transition-all space-y-4"
            >
              
              <div className="flex items-start gap-4">
                {/* Red Circle MapPin Icon with Bounce Effect */}
                <div className="w-12 h-12 rounded-full bg-[#E0241A] text-white flex items-center justify-center shrink-0 shadow-md animate-bounce">
                  <MapPin className="w-6 h-6" />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                      OUR LOCATION
                    </span>
                    <span className="w-5 h-[2px] bg-red-600 inline-block"></span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#0B132A] leading-snug">
                    High-Tech College Kitengela Campus, Kitengela, Kajiado County, Kenya.
                  </p>
                </div>
              </div>

              {/* Map View Frame */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="rounded-xl overflow-hidden border border-slate-200 shadow-inner h-48 relative bg-slate-100"
              >
                    <iframe
                      title="High-Tech College Kitengela Campus Map"
                      src="https://maps.google.com/maps?q=-1.4810,36.9601&z=15&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      sandbox="allow-scripts allow-same-origin allow-popups"
                      className="w-full h-full"
                    />

                {/* Custom Overlay Label on Map */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg shadow-md border border-slate-200/80 flex items-center gap-2 pointer-events-none">
                  <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-900">
                      High-Tech College Kitengela Campus
                    </span>
                    <span className="text-[9px] font-semibold text-slate-500">
                      1°28'51.6"S 36°57'36.4"E (-1.4810, 36.9601)
                    </span>
                  </div>
                </div>
              </motion.div>

            </motion.div>

            <motion.button
              onClick={() => setIsMessageModalOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Us a Message</span>
            </motion.button>

          </div>

        </div>
      </motion.div>

      {/* LEAVE MESSAGE MODAL */}
      <AnimatePresence>
        {isMessageModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-modal-title"
              className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-white"
            >
              <button
                onClick={() => setIsMessageModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="contact-modal-title" className="text-xl font-bold font-playfair text-white">Send Message to Kitengela Campus</h3>
                  <p className="text-xs text-slate-400">Our admissions desk will reply to your phone or email</p>
                </div>
              </div>

              {formSubmitted ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">Message Delivered!</h4>
                  <p className="text-xs text-slate-400">
                    Thank you for contacting High-Tech College. Your enquiry has been received by our desk.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+254 7..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. May Intake Fees"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Ask about courses, entry criteria, fee structures, or hostels..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsMessageModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 disabled:bg-slate-600 text-white flex items-center gap-2 shadow-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Enquiry</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ContactSection;

