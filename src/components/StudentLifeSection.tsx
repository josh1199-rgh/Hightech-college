import React from 'react';
import { useCMS } from '../context/CMSContext';
import { Users, HeartHandshake } from 'lucide-react';

export const StudentLifeSection: React.FC = () => {
  const { campusLife } = useCMS();

  return (
    <section id="student-life" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Campus & Community</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-playfair">
            Vibrant <span className="text-red-500">Student Life</span> & Culture
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Education expands far beyond the classroom. Experience state-of-the-art campus lounges, competitive hackathons, active esports leagues, and international tech exchange cohorts.
          </p>
        </div>

        {/* Student Life Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {campusLife.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-slate-950 border border-white/15 overflow-hidden flex flex-col justify-between group hover:border-red-500/40 transition-all hover:-translate-y-1 shadow-2xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-xs font-bold text-red-300">
                  {item.tag}
                </span>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-red-400">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-red-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-red-400" /> Active Community
                  </span>
                  <span className="font-semibold text-red-400 group-hover:translate-x-1 transition-transform">
                    Learn More →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
