import React, { useState } from 'react';
import { Course } from '../types';
import { X, CheckCircle2, ArrowRight, Send, Sparkles } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface ApplicationModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyConfirm: (programName: string) => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  course,
  isOpen,
  onClose,
  onApplyConfirm,
}) => {
  const { addApplication } = useCMS();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [kcseGrade, setKcseGrade] = useState('C+');
  const [intakePeriod, setIntakePeriod] = useState('May 2025 Intake');
  const [message, setMessage] = useState('');
  const [validationError, setValidationError] = useState('');

  if (!isOpen || !course) return null;

  const validateEmail = (email: string): boolean => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-()]/g, '');
    return /^\+?[\d]{10,15}$/.test(cleaned);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setValidationError('');

    if (!applicantName.trim()) {
      setValidationError('Full name is required.');
      return;
    }
    if (!validatePhone(phone)) {
      setValidationError('Please enter a valid phone number.');
      return;
    }
    if (email && !validateEmail(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    addApplication({
      applicantName: applicantName.trim(),
      email: email.trim() || 'No email provided',
      phone: phone.trim(),
      program: course.title,
      kcseGrade,
      intakePeriod,
      message: message.trim() || 'Applied via website course modal',
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowApplicationForm(false);
      setIsSubmitting(false);
      setValidationError('');
      onClose();
      onApplyConfirm(course.title);
    }, 1800);
  };

  return (
<div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-white/20 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            setShowApplicationForm(false);
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!showApplicationForm ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 uppercase tracking-wider">
                {course.level}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-playfair text-white">
                {course.title}
              </h3>
            </div>

            {/* Description */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {course.description}
            </p>

            {/* Program Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950 border border-white/10 text-xs">
              <div>
                <div className="text-slate-400">Duration</div>
                <div className="font-bold text-white text-sm mt-0.5">{course.duration}</div>
              </div>
              <div>
                <div className="text-slate-400">Tuition</div>
                <div className="font-bold text-red-400 text-sm mt-0.5">{course.tuition}</div>
              </div>
              <div>
                <div className="text-slate-400">Next Cohort</div>
                <div className="font-bold text-white text-sm mt-0.5">{course.nextCohort}</div>
              </div>
            </div>

            {/* Skills Covered */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Core Technical Skills Covered
              </h4>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => setShowApplicationForm(true)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-500 text-white transition-colors flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Apply for Admission</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                Online Application Form
              </span>
              <h3 className="text-2xl font-bold font-playfair text-white">
                Apply for {course.title}
              </h3>
              <p className="text-xs text-slate-400">
                Complete your candidate details to submit directly to Kitengela Campus Admissions.
              </p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                <h4 className="text-xl font-bold text-white">Application Received!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Your application for <strong>{course.title}</strong> has been logged in the admissions office. Our desk will contact you via {phone}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Full Candidate Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Mary Wanjiku"
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mary@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      KCSE Grade
                    </label>
                    <select
                      value={kcseGrade}
                      onChange={(e) => setKcseGrade(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-red-500 focus:outline-none"
                    >
                      <option value="A / A-">A / A-</option>
                      <option value="B+ / B / B-">B+ / B / B-</option>
                      <option value="C+ / C / C-">C+ / C / C-</option>
                      <option value="D+ / D / D-">D+ / D / D-</option>
                      <option value="E / Other">E / Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Preferred Intake
                    </label>
                    <select
                      value={intakePeriod}
                      onChange={(e) => setIntakePeriod(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-red-500 focus:outline-none"
                    >
                      <option value="May 2025 Intake">May 2025 Intake</option>
                      <option value="September 2025 Intake">September 2025 Intake</option>
                      <option value="January 2026 Intake">January 2026 Intake</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Additional Notes / Questions
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Inquire about hostel availability, installment fee plans, etc..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                  {validationError && (
                    <p className="text-xs text-red-400 flex-1">{validationError}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="text-xs text-slate-400 hover:text-white font-medium"
                  >
                    ← Back to Course Details
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
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

