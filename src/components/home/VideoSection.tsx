import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { Play } from 'lucide-react';
import challengeImage from '@/assets/challenge.jpg';

const VideoSection = () => {
  const { t } = useTranslation();

  return (
    <section id="testimonials" className="py-24 bg-brand-dark">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          {t('video.title')}
        </h2>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          {t('video.description')}
        </p>
        
        <div className="max-w-4xl mx-auto aspect-video rounded-3xl border border-white/10 flex items-center justify-center group cursor-pointer hover:bg-white/10 transition-colors relative overflow-hidden">
          <img 
            src={challengeImage} 
            alt="Team taking a wellbeing walk outdoors" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple/40 to-brand-blue/40" />
          <div className="relative z-10 w-24 h-24 rounded-full bg-white flex items-center justify-center text-brand-purple shadow-2xl group-hover:scale-110 transition-transform">
            <Play size={40} fill="currentColor" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
