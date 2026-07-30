import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { CoursesSection } from './components/CoursesSection';
import { CampusLifeSection } from './components/CampusLifeSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { ApplicationModal } from './components/ApplicationModal';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { ImageSettingsPanel } from './components/ImageSettingsPanel';
import { Image } from 'lucide-react';
import { Course } from './types';

export default function App() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgramForForm, setSelectedProgramForForm] = useState<string>(
    'B.Sc. Full-Stack Software Engineering'
  );
  const [isImagePanelOpen, setIsImagePanelOpen] = useState(false);

  const handleExploreCourses = () => {
    const coursesEl = document.getElementById('courses');
    if (coursesEl) {
      coursesEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyClick = (programName?: string) => {
    if (programName) {
      setSelectedProgramForForm(programName);
    }
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenCourseModal = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Sticky Frosted Glass Navigation */}
      <Navbar onApplyClick={() => handleApplyClick()} />

      {/* Hero Section */}
      <Hero
        onExploreCourses={handleExploreCourses}
        onApplyClick={() => handleApplyClick()}
      />

      {/* About Section */}
      <AboutSection
        onApplyClick={() => handleApplyClick()}
        onExploreCourses={handleExploreCourses}
      />

      {/* Courses Section */}
      <CoursesSection
        onSelectCourse={handleOpenCourseModal}
        onApplyForCourse={(programName) => handleApplyClick(programName)}
      />

      {/* Campus Life Section */}
      <CampusLifeSection onApplyClick={() => handleApplyClick()} />

      {/* FAQ Section */}
      <FAQSection onContactClick={() => handleApplyClick()} />

      {/* Contact & Admissions Form */}
      <ContactSection initialProgram={selectedProgramForForm} />

      {/* Course Detail Modal */}
      <ApplicationModal
        course={selectedCourse}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApplyConfirm={(programName) => handleApplyClick(programName)}
      />

      {/* Floating Admin Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsImagePanelOpen(true)}
        className="fixed bottom-6 right-6 z-[50] w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/30 flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Image settings"
      >
        <Image className="w-5 h-5" />
      </motion.button>

      {/* Image Settings Panel */}
      <ImageSettingsPanel
        isOpen={isImagePanelOpen}
        onClose={() => setIsImagePanelOpen(false)}
      />
    </div>
  );
}

