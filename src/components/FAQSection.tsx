import React, { useState } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCMS } from '../context/CMSContext';

interface FAQSectionProps {
  onContactClick: () => void;
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

export const FAQSection: React.FC<FAQSectionProps> = ({ onContactClick }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { faqs } = useCMS();


  return (
    <section id="faq" className="bg-[#f1f1f3] text-slate-900 font-inter py-16 sm:py-24 px-4 sm:px-6 lg:px-12 w-full transition-colors overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariant}
        className="max-w-6xl mx-auto space-y-12"
      >
        
        {/* Top Header Section */}
        <div className="text-center space-y-3">
          {/* Main Title */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-playfair tracking-tight text-[#0F172A]">
            Common Questions
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 w-full max-w-4xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.id}
                layout
                className={`transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-white rounded-[24px] p-5 sm:p-7 shadow-xl shadow-indigo-100/40 border border-indigo-200/80 ring-1 ring-indigo-200/60'
                    : 'bg-[#e7e7eb] hover:bg-[#e1e1e5] rounded-[22px] p-4 sm:p-5'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1">
                    {/* Number Box */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-red-100 text-red-900 border border-red-300'
                          : 'bg-white/80 text-slate-600 shadow-2xs'
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* Question Text */}
                    <h3
                      className={`font-bold transition-colors ${
                        isOpen ? 'text-base sm:text-lg text-slate-900' : 'text-sm sm:text-base text-slate-800'
                      }`}
                    >
                      {faq.question}
                    </h3>
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenIndex(isOpen ? null : index);
                    }}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      isOpen
                        ? 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        : 'bg-slate-950 text-white hover:scale-105 shadow-md'
                    }`}
                    aria-label={isOpen ? 'Close answer' : 'Open answer'}
                  >
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                  </button>
                </div>

                {/* Body Answer Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="pl-10 sm:pl-12 pr-2 sm:pr-8 pt-3 space-y-2.5 text-slate-600 text-xs sm:text-sm leading-relaxed font-normal border-t border-slate-100 mt-4 overflow-hidden"
                    >
                      {Array.isArray(faq.answer) ? (
                        faq.answer.map((paragraph, pIdx) => <p key={pIdx}>{paragraph}</p>)
                      ) : (
                        <p>{faq.answer}</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Contact Callout */}
        <div className="pt-6 text-center space-y-2">
          <p className="text-xs sm:text-sm font-medium text-slate-500">
            Have any other questions?
          </p>
          <button
            onClick={onContactClick}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0F172A] hover:text-red-600 transition-colors group cursor-pointer"
          >
            <span className="underline underline-offset-4 decoration-slate-400 group-hover:decoration-red-600">
              Contact Us
            </span>
            <span className="w-5 h-5 rounded-full bg-slate-300/80 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center text-[10px] transition-colors ml-0.5">
              →
            </span>
          </button>
        </div>

      </motion.div>
    </section>
  );
};

export default FAQSection;

