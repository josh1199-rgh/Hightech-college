import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { CoursesSection } from './components/CoursesSection';
import { CampusLifeSection } from './components/CampusLifeSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { ApplicationModal } from './components/ApplicationModal';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { Course } from './types';

export default function App() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgramForForm, setSelectedProgramForForm] = useState<string>(
    'B.Sc. Full-Stack Software Engineering'
  );

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
    </div>
  );
}

