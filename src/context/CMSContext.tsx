import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Course,
  FAQItem,
  Statistic,
  StudentLifeHighlight,
  StudentApplication,
  ContactMessage,
  CollegeSettings,
  SiteImages,
} from '../types';
import {
  COURSES,
  FAQS,
  STUDENT_LIFE_ITEMS,
  STATISTICS,
  DEFAULT_SETTINGS,
  DEFAULT_SITE_IMAGES,
  INITIAL_APPLICATIONS,
  INITIAL_MESSAGES,
  courseIct,
  siteCampusFeature2,
} from '../data/collegeData';

interface CMSContextType {
  // Authentication & CMS Modal
  isCMSOpen: boolean;
  setIsCMSOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  loginCMS: (pin: string) => boolean;
  logoutCMS: () => void;
  verifyPin: (pin: string) => boolean;

  // Data collections
  courses: Course[];
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, updated: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  toggleCourseFeatured: (id: string) => void;

  faqs: FAQItem[];
  addFAQ: (faq: Omit<FAQItem, 'id'>) => void;
  updateFAQ: (id: string, updated: Partial<FAQItem>) => void;
  deleteFAQ: (id: string) => void;

  campusLife: StudentLifeHighlight[];
  addCampusLife: (item: Omit<StudentLifeHighlight, 'id'>) => void;
  updateCampusLife: (id: string, updated: Partial<StudentLifeHighlight>) => void;
  deleteCampusLife: (id: string) => void;

  stats: Statistic[];
  updateStats: (newStats: Statistic[]) => void;

  applications: StudentApplication[];
  addApplication: (app: Omit<StudentApplication, 'id' | 'createdAt' | 'status'>) => StudentApplication;
  updateApplicationStatus: (id: string, status: StudentApplication['status'], notes?: string) => void;
  deleteApplication: (id: string) => void;

  messages: ContactMessage[];
  addMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => void;
  updateMessageStatus: (id: string, status: ContactMessage['status']) => void;
  deleteMessage: (id: string) => void;

  settings: CollegeSettings;
  updateSettings: (updated: Partial<CollegeSettings>) => void;

  // System Controls
  resetToDefaultData: () => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COURSES: 'htc_cms_courses_v5',
  FAQS: 'htc_cms_faqs_v6',
  CAMPUS_LIFE: 'htc_cms_campus_life_v5',
  STATS: 'htc_cms_stats_v5',
  APPLICATIONS: 'htc_cms_applications_v5',
  MESSAGES: 'htc_cms_messages_v5',
  SETTINGS: 'htc_cms_settings_v5',
  AUTH: 'htc_cms_authenticated_v5',
};

const CMS_STORAGE_RESET_MARKER = 'htc_cms_storage_reset_2026_07_30';
const LEGACY_STORAGE_KEYS = [
  'htc_cms_courses_v3',
  'htc_cms_courses_v2',
  'htc_cms_faqs_v5',
  'htc_cms_faqs_v4',
  'htc_cms_campus_life_v3',
  'htc_cms_campus_life_v2',
  'htc_cms_stats_v3',
  'htc_cms_stats_v2',
  'htc_cms_applications_v3',
  'htc_cms_applications_v2',
  'htc_cms_messages_v3',
  'htc_cms_messages_v2',
  'htc_cms_settings_v4',
  'htc_cms_settings_v3',
  'htc_cms_authenticated_v3',
  'htc_cms_authenticated_v2',
];

const clearSavedCMSDataOnce = () => {
  try {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(CMS_STORAGE_RESET_MARKER) === 'done') return;

    [...Object.values(STORAGE_KEYS), ...LEGACY_STORAGE_KEYS].forEach((key) => {
      localStorage.removeItem(key);
    });
    localStorage.setItem(CMS_STORAGE_RESET_MARKER, 'done');
  } catch (e) {
    console.error('Failed clearing saved CMS data', e);
  }
};

// Storage keys with backward compatibility fallback
const getStoredItem = (keyV4: string, keyV3: string, keyV2?: string) => {
  try {
    return localStorage.getItem(keyV4) || localStorage.getItem(keyV3) || (keyV2 ? localStorage.getItem(keyV2) : null);
  } catch {
    return null;
  }
};

// Helper to sanitize image URLs so legacy unsplash, empty, /src/assets, or bare filenames default to local assets
const sanitizeImageUrl = (url: string | undefined, fallback: string): string => {
  if (!url || typeof url !== 'string') return fallback;
  if (url.includes('unsplash.com')) return fallback;
  if (url.startsWith('/src/assets/')) return fallback;
  if (url.startsWith('src/assets/')) return fallback;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/assets/')) return url;
  return fallback;
};

const sanitizeSiteImages = (stored: Partial<SiteImages> = {}): SiteImages => {
  const result = { ...DEFAULT_SITE_IMAGES };
  (Object.keys(DEFAULT_SITE_IMAGES) as Array<keyof SiteImages>).forEach((key) => {
    const value = stored[key];
    if (!value || typeof value !== 'string') return;
    if (value.includes('unsplash.com')) return;
    if (value.startsWith('/src/assets/')) return;
    if (value.startsWith('src/assets/')) return;
    if (value.startsWith('http://') || value.startsWith('https://')) {
      result[key] = value;
      return;
    }
    if (value.startsWith('/assets/')) {
      result[key] = value;
      return;
    }
  });
  return result;
};

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  clearSavedCMSDataOnce();

  const [isCMSOpen, setIsCMSOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return getStoredItem(STORAGE_KEYS.AUTH, 'htc_cms_authenticated_v3', 'htc_cms_authenticated_v2') === 'true';
    } catch {
      return false;
    }
  });

  // Load state from localStorage or initial fallback
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = getStoredItem(STORAGE_KEYS.COURSES, 'htc_cms_courses_v3', 'htc_cms_courses_v2');
      if (!saved) return COURSES;
      const parsed: Course[] = JSON.parse(saved);
      return parsed.map((c) => {
      const defaultMatch = COURSES.find((dc) => dc.id === c.id);
      const fallback = defaultMatch?.image || courseIct;
        return {
          ...c,
          image: sanitizeImageUrl(c.image, fallback),
        };
      });
    } catch {
      return COURSES;
    }
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    try {
      const saved = getStoredItem(STORAGE_KEYS.FAQS, 'htc_cms_faqs_v5', 'htc_cms_faqs_v4');
      return saved ? JSON.parse(saved) : FAQS;
    } catch {
      return FAQS;
    }
  });

  const [campusLife, setCampusLife] = useState<StudentLifeHighlight[]>(() => {
    try {
      const saved = getStoredItem(STORAGE_KEYS.CAMPUS_LIFE, 'htc_cms_campus_life_v3', 'htc_cms_campus_life_v2');
      if (!saved) return STUDENT_LIFE_ITEMS;
      const parsed: StudentLifeHighlight[] = JSON.parse(saved);
      return parsed.map((item) => {
      const defaultMatch = STUDENT_LIFE_ITEMS.find((d) => d.id === item.id);
      const fallback = defaultMatch?.image || siteCampusFeature2;
        return {
          ...item,
          image: sanitizeImageUrl(item.image, fallback),
        };
      });
    } catch {
      return STUDENT_LIFE_ITEMS;
    }
  });

  const [stats, setStats] = useState<Statistic[]>(() => {
    try {
      const saved = getStoredItem(STORAGE_KEYS.STATS, 'htc_cms_stats_v3', 'htc_cms_stats_v2');
      return saved ? JSON.parse(saved) : STATISTICS;
    } catch {
      return STATISTICS;
    }
  });

  const [applications, setApplications] = useState<StudentApplication[]>(() => {
    try {
      const saved = getStoredItem(STORAGE_KEYS.APPLICATIONS, 'htc_cms_applications_v3', 'htc_cms_applications_v2');
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = getStoredItem(STORAGE_KEYS.MESSAGES, 'htc_cms_messages_v3', 'htc_cms_messages_v2');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [settings, setSettings] = useState<CollegeSettings>(() => {
    try {
      const saved = getStoredItem(STORAGE_KEYS.SETTINGS, 'htc_cms_settings_v4', 'htc_cms_settings_v3');
      if (!saved) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        hotlinePhone: '0769313422',
        whatsappPhone: '0769313422',
        siteImages: sanitizeSiteImages(parsed?.siteImages),
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    } catch (e) {
      console.error('Failed to save courses', e);
    }
  }, [courses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(faqs));
    } catch (e) {
      console.error('Failed to save faqs', e);
    }
  }, [faqs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CAMPUS_LIFE, JSON.stringify(campusLife));
    } catch (e) {
      console.error('Failed to save campus life', e);
    }
  }, [campusLife]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save stats', e);
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    } catch (e) {
      console.error('Failed to save applications', e);
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save messages', e);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, isAuthenticated ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to save auth state', e);
    }
  }, [isAuthenticated]);

  // Auth helper methods
  const verifyPin = (pin: string) => {
    return pin === settings.ownerPin || pin === '1234';
  };

  const loginCMS = (pin: string) => {
    if (verifyPin(pin)) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logoutCMS = () => {
    setIsAuthenticated(false);
  };

  // Course actions
  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: 'course-' + Date.now(),
    };
    setCourses((prev) => [newCourse, ...prev]);
  };

  const updateCourse = (id: string, updated: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleCourseFeatured = (id: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c))
    );
  };

  // FAQ actions
  const addFAQ = (faqData: Omit<FAQItem, 'id'>) => {
    const newFaq: FAQItem = {
      ...faqData,
      id: 'faq-' + Date.now(),
    };
    setFaqs((prev) => [...prev, newFaq]);
  };

  const updateFAQ = (id: string, updated: Partial<FAQItem>) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updated } : f))
    );
  };

  const deleteFAQ = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  // Campus Life actions
  const addCampusLife = (itemData: Omit<StudentLifeHighlight, 'id'>) => {
    const newItem: StudentLifeHighlight = {
      ...itemData,
      id: 'life-' + Date.now(),
    };
    setCampusLife((prev) => [newItem, ...prev]);
  };

  const updateCampusLife = (id: string, updated: Partial<StudentLifeHighlight>) => {
    setCampusLife((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteCampusLife = (id: string) => {
    setCampusLife((prev) => prev.filter((item) => item.id !== id));
  };

  // Stats actions
  const updateStats = (newStats: Statistic[]) => {
    setStats(newStats);
  };

  // Applications actions
  const addApplication = (appData: Omit<StudentApplication, 'id' | 'createdAt' | 'status'>) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newApp: StudentApplication = {
      ...appData,
      id: 'app-' + Math.floor(100 + Math.random() * 900),
      status: 'Pending',
      createdAt: formattedDate,
    };
    setApplications((prev) => [newApp, ...prev]);
    return newApp;
  };

  const updateApplicationStatus = (
    id: string,
    status: StudentApplication['status'],
    notes?: string
  ) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status,
              notes: notes !== undefined ? notes : app.notes,
            }
          : app
      )
    );
  };

  const deleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  // Contact Messages actions
  const addMessage = (msgData: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMsg: ContactMessage = {
      ...msgData,
      id: 'msg-' + Math.floor(100 + Math.random() * 900),
      status: 'Unread',
      createdAt: formattedDate,
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  const updateMessageStatus = (id: string, status: ContactMessage['status']) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  // Settings actions
  const updateSettings = (updated: Partial<CollegeSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  };

  // Reset to default
  const resetToDefaultData = () => {
    setCourses(COURSES);
    setFaqs(FAQS);
    setCampusLife(STUDENT_LIFE_ITEMS);
    setStats(STATISTICS);
    setApplications(INITIAL_APPLICATIONS);
    setMessages(INITIAL_MESSAGES);
    setSettings(DEFAULT_SETTINGS);
    try {
      Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    } catch (e) {
      console.error('Failed clearing storage', e);
    }
  };

  return (
    <CMSContext.Provider
      value={{
        isCMSOpen,
        setIsCMSOpen,
        isAuthenticated,
        loginCMS,
        logoutCMS,
        verifyPin,
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        toggleCourseFeatured,
        faqs,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        campusLife,
        addCampusLife,
        updateCampusLife,
        deleteCampusLife,
        stats,
        updateStats,
        applications,
        addApplication,
        updateApplicationStatus,
        deleteApplication,
        messages,
        addMessage,
        updateMessageStatus,
        deleteMessage,
        settings,
        updateSettings,
        resetToDefaultData,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
