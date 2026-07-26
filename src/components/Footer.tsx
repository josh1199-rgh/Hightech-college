import React from 'react';
import { Github, Twitter, Linkedin, Youtube, ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useCMS } from '../context/CMSContext';

export const Footer: React.FC = () => {
  const { settings } = useCMS();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <footer className="bg-slate-950 text-white border-t border-white/10 pt-16 pb-12 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {settings.siteImages?.logoUrl ? (
                <img
                  src={settings.siteImages.logoUrl}
                  alt="High-Tech College Logo"
                  className="h-10 w-auto object-contain max-w-[120px]"
                  referrerPolicy="no-referrer"
                />
              ) : null}
              <span className="font-playfair italic font-bold text-2xl tracking-tight text-white">
                High-Tech College
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Leading the future of technology education through practical labs, accredited programs, and direct industry hiring pathways.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <motion.a
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#github"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 hover:text-red-400 hover:border-red-500/50 transition-colors"
              >
                <Github className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#twitter"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 hover:text-red-400 hover:border-red-500/50 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#linkedin"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 hover:text-red-400 hover:border-red-500/50 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#youtube"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 hover:text-red-400 hover:border-red-500/50 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-base">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#home" className="hover:text-red-400 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-red-400 transition-colors">About Us</a></li>
              <li><a href="#courses" className="hover:text-red-400 transition-colors">Academic Programs</a></li>
              <li><a href="#campus-life" className="hover:text-red-400 transition-colors">Campus Life</a></li>
              <li><a href="#faq" className="hover:text-red-400 transition-colors">Admissions FAQ</a></li>
            </ul>
          </div>

          {/* Column 3: Programs */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-base">Specializations</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#courses" className="hover:text-red-400 transition-colors">Software Engineering</a></li>
              <li><a href="#courses" className="hover:text-red-400 transition-colors">AI & Data Science</a></li>
              <li><a href="#courses" className="hover:text-red-400 transition-colors">Cybersecurity</a></li>
              <li><a href="#courses" className="hover:text-red-400 transition-colors">Cloud & DevOps</a></li>
              <li><a href="#courses" className="hover:text-red-400 transition-colors">Digital UX Design</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-base">Tech Campus News</h4>
            <p className="text-xs text-slate-400">Get notified about upcoming hackathons, tech workshops, and scholarship intakes.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to High-Tech College newsletter!'); }} className="space-y-2">
              <input
                type="email"
                required
                placeholder="Enter your email..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} High-Tech College. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-300">Terms of Service</a>
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 border border-white/10 hover:text-red-400 text-slate-300 transition-colors flex items-center gap-1 cursor-pointer ml-4"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

