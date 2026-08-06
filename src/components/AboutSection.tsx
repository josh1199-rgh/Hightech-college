import React from 'react';
import { ArrowRight, BookOpen, GraduationCap, Users, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { useCMS } from '../context/CMSContext';
import { DEFAULT_SITE_IMAGES } from '../data/collegeData';
import siteAboutTeamImage from '../assets/images/site-aboutTeamImage.jpeg';
import siteAboutApproachImage from '../assets/images/site-aboutApproachImage.jpeg';
import siteAboutProcessImage from '../assets/images/site-aboutProcessImage.jpeg';

interface AboutSectionProps {
  onApplyClick?: () => void;
  onExploreCourses?: () => void;
}

const cubicEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sectionVariant = {
  hidden: { opacity: 0, y: 80, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: cubicEase },
  },
};

const imageRevealVariant = {
  hidden: { opacity: 0, scale: 1.1, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, ease: cubicEase },
  },
};

export const AboutSection: React.FC<AboutSectionProps> = ({
  onApplyClick,
  onExploreCourses,
}) => {
  const { settings } = useCMS();

  const teamImage = settings.siteImages?.aboutTeamImage || siteAboutTeamImage;
  const approachImage = settings.siteImages?.aboutApproachImage || siteAboutApproachImage;
  const processImage = settings.siteImages?.aboutProcessImage || siteAboutProcessImage;

  return (
    <section id="about" className="bg-white text-slate-800 font-inter py-16 sm:py-24 transition-colors overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

        {/* 1. HEADER TITLE SECTION */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariant}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <h1 className="text-4xl sm:text-6xl font-playfair font-bold text-slate-900 tracking-tight">
            About Us
          </h1>
          <p className="text-red-600 text-lg sm:text-xl font-medium font-playfair italic">
            Empowering Futures Through Practical Education
          </p>
          <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed pt-2">
            High-Tech College Kitengela Campus equips students with industry-relevant knowledge, practical skills, and confidence to succeed in today's competitive world.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={onApplyClick}
              className="px-6 py-3 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white font-poppins font-bold text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Apply Today</span>
              <ArrowRight className="w-4 h-4 text-red-500" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={onExploreCourses}
              className="px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-poppins font-semibold text-sm transition-all cursor-pointer"
            >
              Our Courses
            </motion.button>
          </div>
        </motion.div>

        {/* 2. SECTION 1: OUR VISION (Text Left, Image Right) */}
        <motion.div
          id="our-vision"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariant}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8"
        >
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-slate-900 tracking-tight">
              Our Vision
            </h2>
            <div className="space-y-4 text-slate-600 text-base leading-relaxed">
              <p>
                A wonderful serenity has taken possession of our institution as we prepare students for real impact. High-Tech College Kitengela Campus aims to become a leading center of excellence in practical and professional education across Kenya.
              </p>
              <p>
                We equip learners with practical skills, tech innovation, integrity, and hands-on confidence, turning passion into rewarding lifelong careers.
              </p>
              <p>
                Through state-of-the-art laboratories and TVETA-accredited curriculum, our graduates stand out in technology, engineering, business, and vocational sectors.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <motion.div
              variants={imageRevealVariant}
              className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 group"
            >
              <img
                src={teamImage}
                alt="High-Tech College Team and Staff"
                className="w-full h-[380px] sm:h-[460px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* 3. SECTION 2: OUR APPROACH (Image Left, Text Right) */}
        <motion.div
          id="our-approach"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariant}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          <div className="lg:col-span-6 order-2 lg:order-1">
            <motion.div
              variants={imageRevealVariant}
              className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 group"
            >
              <img
                src={approachImage}
                alt="High-Tech College Our Approach"
                className="w-full h-[380px] sm:h-[460px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-slate-900 tracking-tight">
              Our Approach
            </h2>
            <div className="space-y-4 text-slate-600 text-base leading-relaxed">
              <p>
                High-Tech College Kitengela Campus is committed to providing quality technical education through active practical learning, experienced trainers, and a supportive environment.
              </p>
              <p>
                Over 70% of study time is dedicated to hands-on practical lab sessions, workshop training, and real-world project builds rather than passive classroom theory.
              </p>
              <p>
                We foster a collaborative atmosphere where experienced instructors mentor students individually, building industry competence and entrepreneurial drive.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 4. SECTION 3: OUR PROCESS (Text Left, Image Right) */}
        <motion.div
          id="our-process"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariant}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-slate-900 tracking-tight">
              Our Process
            </h2>
            <div className="space-y-4 text-slate-600 text-base leading-relaxed">
              <p>
                Our educational pathway is structured for maximum success: <br />
                <span className="font-semibold text-slate-900">Learn → Practice → Build Skills → Graduate → Career Success.</span>
              </p>
              <p>
                Starting from fundamental concepts, students transition into intensive practical training in fully equipped computer, electronics, and vocational workshops.
              </p>
              <p>
                Accredited qualifications through KNEC, CDACC, NITA, and TVETA ensure every graduate receives national recognition and immediate corporate attachment opportunities.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <motion.div
              variants={imageRevealVariant}
              className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 group"
            >
              <img
                src={processImage}
                alt="High-Tech College Our Process"
                className="w-full h-[380px] sm:h-[460px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* 5. WHY CHOOSE HIGH-TECH COLLEGE SECTION */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariant}
          className="pt-8 border-t border-slate-200 space-y-10"
        >
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-playfair font-bold text-slate-900">
              Why Choose High-Tech?
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Discover what sets Kitengela Campus apart in practical tertiary education.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ y: -12, filter: 'drop-shadow(0 25px 50px -12px rgba(0, 0, 0, 0.15))' }}
              transition={{ duration: 0.4, ease: cubicEase }}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 group hover:border-red-500/60 hover:bg-white transition-colors cursor-pointer"
            >
              <div className="p-3 rounded-xl bg-[#0F172A] text-red-500 w-fit group-hover:rotate-6 transition-transform duration-300">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-playfair text-slate-900">Experienced Trainers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Learn directly from seasoned industry specialists, engineers, and certified instructors.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -12, filter: 'drop-shadow(0 25px 50px -12px rgba(0, 0, 0, 0.15))' }}
              transition={{ duration: 0.4, ease: cubicEase }}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 group hover:border-red-500/60 hover:bg-white transition-colors cursor-pointer"
            >
              <div className="p-3 rounded-xl bg-[#0F172A] text-red-500 w-fit group-hover:rotate-6 transition-transform duration-300">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-playfair text-slate-900">Practical Learning</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                70% hands-on laboratory sessions using modern ICT equipment and tools.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -12, filter: 'drop-shadow(0 25px 50px -12px rgba(0, 0, 0, 0.15))' }}
              transition={{ duration: 0.4, ease: cubicEase }}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 group hover:border-red-500/60 hover:bg-white transition-colors cursor-pointer"
            >
              <div className="p-3 rounded-xl bg-[#0F172A] text-red-500 w-fit group-hover:rotate-6 transition-transform duration-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-playfair text-slate-900">Industry Courses</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                TVETA-accredited diploma & certificate pathways tailored to employment demand.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -12, filter: 'drop-shadow(0 25px 50px -12px rgba(0, 0, 0, 0.15))' }}
              transition={{ duration: 0.4, ease: cubicEase }}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 group hover:border-red-500/60 hover:bg-white transition-colors cursor-pointer"
            >
              <div className="p-3 rounded-xl bg-[#0F172A] text-red-500 w-fit group-hover:rotate-6 transition-transform duration-300">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-playfair text-slate-900">Student Success</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Active job placement linkages, industrial attachments, and startup support.
              </p>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutSection;

