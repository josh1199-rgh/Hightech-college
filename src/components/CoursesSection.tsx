import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Course } from '../types';
import { useCMS } from '../context/CMSContext';
import {
  MapPin,
  Clock,
  Award,
  Star,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle,
  Search,
  ArrowRight
} from 'lucide-react';

const cubicEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface CoursesSectionProps {
  onSelectCourse: (course: Course) => void;
  onApplyForCourse: (courseName: string) => void;
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

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  onSelectCourse,
  onApplyForCourse,
}) => {
  const { courses } = useCMS();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const coursesList = courses.filter((course) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.skills.some((s) => s.toLowerCase().includes(query))
    );
  });

  const activeCourse = coursesList[activeIndex] || coursesList[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % coursesList.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + coursesList.length) % coursesList.length);
  };

  return (
    <section id="courses" className="relative bg-white text-slate-800 py-12 sm:py-16 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden min-h-screen flex flex-col justify-between transition-colors">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariant}
        className="max-w-7xl mx-auto w-full relative z-10 space-y-12"
      >
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-slate-900 tracking-tight">
            Explore Our <span className="gold-gradient-text">Academic Courses</span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-inter max-w-2xl mx-auto leading-relaxed">
            Choose from our accredited TVETA, KNEC, NITA, and KASNEB programs designed for 70% practical skill development.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto pt-2">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses e.g. ICT, Accounts, Beauty..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveIndex(0);
                }}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-slate-50 border border-slate-300 focus:border-[#0F172A] text-slate-900 placeholder-slate-400 text-sm focus:outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* 3D COVERFLOW CAROUSEL CONTAINER */}
        <div className="relative py-6 sm:py-8 flex items-center justify-center min-h-[400px] sm:min-h-[500px] perspective-1000">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-40 p-3.5 rounded-full bg-[#0F172A] border border-slate-700 text-white hover:bg-red-600 hover:text-white transition-all shadow-xl cursor-pointer hover:scale-110"
            aria-label="Previous Course"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-40 p-3.5 rounded-full bg-[#0F172A] border border-slate-700 text-white hover:bg-red-600 hover:text-white transition-all shadow-xl cursor-pointer hover:scale-110"
            aria-label="Next Course"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Cards Stack */}
          <div className="relative w-full max-w-5xl h-[560px] flex items-center justify-center overflow-hidden sm:overflow-visible">
            {coursesList.map((course, index) => {
              // Calculate relative index position to activeIndex
              let offset = index - activeIndex;
              const total = coursesList.length;

              // Handle wrap-around math for smooth infinite carousel
              if (offset < -Math.floor(total / 2)) offset += total;
              if (offset > Math.floor(total / 2)) offset -= total;

              // Only display cards within offset -2 to +2
              if (Math.abs(offset) > 2) return null;

              const isCenter = offset === 0;

              // Card styling & transforms based on offset
              let xOffset = offset * 280; // horizontal separation
              if (typeof window !== 'undefined' && window.innerWidth < 640) {
                xOffset = offset * 200;
              }

              const scale = isCenter ? 1 : Math.abs(offset) === 1 ? 0.86 : 0.72;
              const zIndex = isCenter ? 30 : 20 - Math.abs(offset) * 5;
              const opacity = isCenter ? 1 : Math.abs(offset) === 1 ? 0.75 : 0.45;
              const rotateY = offset * -12; // 3D rotate effect matching coverflow image

              return (
                <motion.div
                  key={course.id}
                  initial={false}
                  animate={{
                    x: xOffset,
                    scale: scale,
                    rotateY: rotateY,
                    opacity: opacity,
                    zIndex: zIndex,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 26,
                  }}
                  onClick={() => setActiveIndex(index)}
                  className={`absolute w-[300px] sm:w-[350px] md:w-[380px] bg-white text-slate-900 rounded-[32px] overflow-hidden shadow-2xl cursor-pointer border border-slate-200 transition-shadow ${
                    isCenter ? 'ring-4 ring-red-500/50 shadow-black/80' : 'filter brightness-90 hover:brightness-100'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* CARD IMAGE */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/70 text-red-300 text-[11px] font-bold backdrop-blur-md border border-red-500/30">
                      {course.examBody}
                    </div>
                  </div>

                  {/* CARD CONTENT */}
                  <div className="p-6 space-y-4 text-left">
                    {/* Course Title */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold font-playfair text-slate-950 leading-tight line-clamp-1">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{course.location}</span>
                      </div>
                    </div>

                    {/* Description Section */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
                        Description
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-normal">
                        {course.description}
                      </p>
                    </div>

                    {/* Qualification Level Row */}
                    <div className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Level</span>
                      <span className="text-xs font-bold text-[#0F172A] bg-red-100 px-2.5 py-1 rounded-full text-red-900 border border-red-200">
                        {course.level}
                      </span>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-slate-700">Apply Online</span>
                      <button
                        id={`apply-course-btn-${course.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onApplyForCourse(course.title);
                        }}
                        className="px-4 py-2 rounded-full bg-[#0F172A] hover:bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md group/btn cursor-pointer"
                        title="Apply for this course"
                      >
                        <span>Apply Now</span>
                        <GraduationCap className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* THUMBNAIL NAVIGATOR DOTS */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto pt-4">
          {coursesList.map((course, idx) => (
            <button
              key={course.id}
              onClick={() => setActiveIndex(idx)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeIndex === idx
                  ? 'bg-red-600 text-white font-bold shadow-md scale-105'
                  : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {idx + 1}. {course.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default CoursesSection;
