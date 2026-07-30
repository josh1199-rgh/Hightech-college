import React, { useState } from 'react';
import { X, Image as ImageIcon, Upload, Copy, Check, Code, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCMS } from '../context/CMSContext';
import { SiteImages, Course } from '../types';
import { ImageUploader } from './ImageUploader';

const downloadBase64 = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const getExtension = (dataUrl: string) => {
  const match = dataUrl.match(/data:image\/(\w+);/);
  return match ? match[1] : 'jpg';
};

const imageSlots: { key: keyof SiteImages; label: string; description: string }[] = [
  { key: 'heroImage', label: 'Hero Image', description: 'Main hero section background' },
  { key: 'aboutTeamImage', label: 'About Team', description: 'Team/group photo in About section' },
  { key: 'aboutApproachImage', label: 'About Approach', description: 'Approach/process image in About' },
  { key: 'aboutProcessImage', label: 'About Process', description: 'Process image in About section' },
  { key: 'logoUrl', label: 'Logo', description: 'Navbar logo (leave empty for text)' },
  { key: 'campusFeature1', label: 'Feature 1', description: 'Campus Life feature card 1' },
  { key: 'campusFeature2', label: 'Feature 2', description: 'Campus Life feature card 2' },
  { key: 'campusFeature3', label: 'Feature 3', description: 'Campus Life feature card 3' },
  { key: 'campusFeature4', label: 'Feature 4', description: 'Campus Life feature card 4' },
  { key: 'campusFeature5', label: 'Feature 5', description: 'Campus Life feature card 5' },
  { key: 'campusGallery1', label: 'Gallery 1', description: 'Campus moments gallery photo 1' },
  { key: 'campusGallery2', label: 'Gallery 2', description: 'Campus moments gallery photo 2' },
  { key: 'campusGallery3', label: 'Gallery 3', description: 'Campus moments gallery photo 3' },
  { key: 'campusGallery4', label: 'Gallery 4', description: 'Campus moments gallery photo 4' },
  { key: 'campusGallery5', label: 'Gallery 5', description: 'Campus moments gallery photo 5' },
  { key: 'campusCommunityBanner', label: 'Community Banner', description: 'Bottom community banner image' },
];

interface ImageSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImageSettingsPanel: React.FC<ImageSettingsPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings, updateSettings, courses, updateCourse } = useCMS();
  const [activeTab, setActiveTab] = useState<'all' | 'hero' | 'campus' | 'courses'>('all');
  const [showExport, setShowExport] = useState(false);
  const [copied, setCopied] = useState(false);

  const filteredSlots = imageSlots.filter((slot) => {
    if (activeTab === 'hero') return slot.key === 'heroImage';
    if (activeTab === 'campus') return slot.key.startsWith('campus');
    return true;
  });

  const handleImageChange = (key: keyof SiteImages, dataUrl: string) => {
    updateSettings({
      siteImages: {
        ...settings.siteImages,
        [key]: dataUrl,
      },
    });
  };

  const handleClearImage = (key: keyof SiteImages) => {
    updateSettings({
      siteImages: {
        ...settings.siteImages,
        [key]: '',
      },
    });
  };

  const handleCourseImageChange = (courseId: string, dataUrl: string) => {
    updateCourse(courseId, { image: dataUrl });
  };

  const handleCourseImageClear = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      updateCourse(courseId, { image: '' });
    }
  };

  const generateExport = () => {
    const siteImages = settings.siteImages || {};
    const exportLines = [
      `export const DEFAULT_SITE_IMAGES: SiteImages = {`,
      `  heroImage: '${(siteImages.heroImage || '/src/assets/images/home-page-background.jpg').replace(/'/g, "\\'")}',`,
      `  aboutTeamImage: '${(siteImages.aboutTeamImage || '/src/assets/images/hightech_team_group_1785009095079.jpg').replace(/'/g, "\\'")}',`,
      `  aboutApproachImage: '${(siteImages.aboutApproachImage || '/src/assets/images/kitengela_campus_life_1785001497935.jpg').replace(/'/g, "\\'")}',`,
      `  aboutProcessImage: '${(siteImages.aboutProcessImage || '/src/assets/images/hero_aerial_campus_1785000784118.jpg').replace(/'/g, "\\'")}',`,
      `  logoUrl: '${(siteImages.logoUrl || '').replace(/'/g, "\\'")}',`,
      `  campusFeature1: '${(siteImages.campusFeature1 || '/src/assets/images/tech_lab_course_1785000457542.jpg').replace(/'/g, "\\'")}',`,
      `  campusFeature2: '${(siteImages.campusFeature2 || '/src/assets/images/kitengela_campus_life_1785001497935.jpg').replace(/'/g, "\\'")}',`,
      `  campusFeature3: '${(siteImages.campusFeature3 || '/src/assets/images/hero_campus_bg_1785000443858.jpg').replace(/'/g, "\\'")}',`,
      `  campusFeature4: '${(siteImages.campusFeature4 || '/src/assets/images/hightech_team_group_1785009095079.jpg').replace(/'/g, "\\'")}',`,
      `  campusFeature5: '${(siteImages.campusFeature5 || '/src/assets/images/tech_lab_course_1785000457542.jpg').replace(/'/g, "\\'")}',`,
      `  campusGallery1: '${(siteImages.campusGallery1 || '/src/assets/images/hightech_team_group_1785009095079.jpg').replace(/'/g, "\\'")}',`,
      `  campusGallery2: '${(siteImages.campusGallery2 || '/src/assets/images/hero_aerial_campus_1785000784118.jpg').replace(/'/g, "\\'")}',`,
      `  campusGallery3: '${(siteImages.campusGallery3 || '/src/assets/images/college_reception_hero_1785008652637.jpg').replace(/'/g, "\\'")}',`,
      `  campusGallery4: '${(siteImages.campusGallery4 || '/src/assets/images/tech_lab_course_1785000457542.jpg').replace(/'/g, "\\'")}',`,
      `  campusGallery5: '${(siteImages.campusGallery5 || '/src/assets/images/kitengela_campus_life_1785001497935.jpg').replace(/'/g, "\\'")}',`,
      `  campusCommunityBanner: '${(siteImages.campusCommunityBanner || '/src/assets/images/kitengela_campus_life_1785001497935.jpg').replace(/'/g, "\\'")}',`,
      `};`,
      ``,
      `export const COURSES: Course[] = [`,
    ];

    courses.forEach((course) => {
      exportLines.push(`  {`);
      exportLines.push(`    id: '${course.id}',`);
      exportLines.push(`    title: '${course.title.replace(/'/g, "\\'")}',`);
      exportLines.push(`    category: '${course.category.replace(/'/g, "\\'")}',`);
      exportLines.push(`    duration: '${course.duration.replace(/'/g, "\\'")}',`);
      exportLines.push(`    level: '${course.level.replace(/'/g, "\\'")}',`);
      exportLines.push(`    format: '${course.format.replace(/'/g, "\\'")}',`);
      exportLines.push(`    description: '${course.description.replace(/'/g, "\\'")}',`);
      exportLines.push(`    skills: [${course.skills.map((s) => `'${s.replace(/'/g, "\\'")}'`).join(', ')}],`);
      exportLines.push(`    nextCohort: '${course.nextCohort.replace(/'/g, "\\'")}',`);
      exportLines.push(`    tuition: '${course.tuition.replace(/'/g, "\\'")}',`);
      exportLines.push(`    rating: ${course.rating},`);
      if (course.featured !== undefined) {
        exportLines.push(`    featured: ${course.featured},`);
      }
      exportLines.push(`    image: '${(course.image || '').replace(/'/g, "\\'")}',`);
      exportLines.push(`    examBody: '${course.examBody.replace(/'/g, "\\'")}',`);
      exportLines.push(`    location: '${course.location.replace(/'/g, "\\'")}',`);
      exportLines.push(`  },`);
    });

    exportLines.push(`];`);
    return exportLines.join('\n');
  };

  const handleCopy = async () => {
    const text = generateExport();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-[201] w-full max-w-lg bg-slate-950 border-l border-white/10 shadow-2xl flex flex-col"
            >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white font-playfair">Site Images</h2>
                  <p className="text-xs text-slate-500">Drag & drop to replace any image</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const siteImages = settings.siteImages || {};
                    Object.entries(siteImages).forEach(([key, value]) => {
                      if (value && typeof value === 'string' && value.startsWith('data:')) {
                        downloadBase64(value, `site-${key}.${getExtension(value)}`);
                      }
                    });
                    courses.forEach((course) => {
                      if (course.image && course.image.startsWith('data:')) {
                        downloadBase64(course.image, `course-${course.id}.${getExtension(course.image)}`);
                      }
                    });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download All Images
                </button>
                <button
                  onClick={() => setShowExport(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                >
                  <Code className="w-3.5 h-3.5" />
                  Save as Default
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-4 border-b border-white/5">
              {(['all', 'hero', 'campus', 'courses'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'bg-red-600 text-white'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Slots */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeTab === 'courses' ? (
                courses.map((course) => (
                  <CourseImageSlot
                    key={course.id}
                    course={course}
                    onImageChange={handleCourseImageChange}
                    onClear={handleCourseImageClear}
                  />
                ))
              ) : (
                filteredSlots.map((slot) => {
                  const currentImage = settings.siteImages?.[slot.key];
                  return (
                    <div
                      key={slot.key}
                      className="bg-slate-900/50 border border-white/5 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white">{slot.label}</h4>
                          <p className="text-xs text-slate-500">{slot.description}</p>
                        </div>
                      {currentImage && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => downloadBase64(currentImage, `${slot.key}.${getExtension(currentImage)}`)}
                            className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                          <button
                            onClick={() => handleClearImage(slot.key)}
                            className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                          >
                            Clear
                          </button>
                        </div>
                      )}
                      </div>
                      <div className="w-full h-32 bg-slate-800 rounded-lg overflow-hidden border border-white/5 flex items-center justify-center">
                        {currentImage ? (
                          <img
                            src={currentImage}
                            alt={slot.label}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-slate-600">
                            <ImageIcon className="w-6 h-6" />
                            <span className="text-xs">No image set</span>
                          </div>
                        )}
                      </div>
                      <ImageUploader
                        currentImage={currentImage}
                        onImageChange={(dataUrl) => handleImageChange(slot.key, dataUrl)}
                        onClear={() => handleClearImage(slot.key)}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {/* Export Modal */}
    <AnimatePresence>
      {showExport && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm"
            onClick={() => setShowExport(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[301] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl max-h-[80vh] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="text-sm font-bold text-white">Save as Default</h3>
                <button
                  onClick={() => setShowExport(false)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <pre className="text-xs text-slate-300 bg-slate-950 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                  {generateExport()}
                </pre>
              </div>
              <div className="p-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy to Clipboard'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
};

interface CourseImageSlotProps {
  course: Course;
  onImageChange: (courseId: string, dataUrl: string) => void;
  onClear: (courseId: string) => void;
}

const CourseImageSlot: React.FC<CourseImageSlotProps> = ({
  course,
  onImageChange,
  onClear,
}) => {
  const [preview, setPreview] = useState<string | null>(course.image);

  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white">{course.title}</h4>
          <p className="text-xs text-slate-500">{course.category}</p>
        </div>
        {preview && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadBase64(preview, `course-${course.id}.${getExtension(preview)}`)}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Download
            </button>
            <button
              onClick={() => onClear(course.id)}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>
      <div className="w-full h-32 bg-slate-800 rounded-lg overflow-hidden border border-white/5 flex items-center justify-center">
        {preview ? (
          <img
            src={preview}
            alt={course.title}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-slate-600">
            <ImageIcon className="w-6 h-6" />
            <span className="text-xs">No image set</span>
          </div>
        )}
      </div>
      <ImageUploader
        currentImage={preview}
        onImageChange={(dataUrl) => {
          setPreview(dataUrl);
          onImageChange(course.id, dataUrl);
        }}
        onClear={() => {
          setPreview(null);
          onClear(course.id);
        }}
      />
    </div>
  );
};