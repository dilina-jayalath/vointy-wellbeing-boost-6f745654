import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { Activity, Brain, Users, TrendingUp } from 'lucide-react';
import mobileImage from '@/assets/mobile.jpg';

const WhyVointy = () => {
  const { t } = useTranslation();

  return (
    <section id="benefits" className="py-24 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-bold text-brand-dark mb-8">
              {t('why.title')}
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              {t('why.description')}
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
                <TrendingUp className="text-brand-purple mb-4" size={32} />
                <h3 className="text-lg font-bold mb-2">Track Progress</h3>
                <p className="text-gray-600">Personalized activity scores to monitor growth.</p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
                <Users className="text-brand-blue mb-4" size={32} />
                <h3 className="text-lg font-bold mb-2">Social Push</h3>
                <p className="text-gray-600">Invite friends and stay motivated together.</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full flex justify-center">
            <div className="relative max-w-sm">
              <div className="absolute inset-0 bg-brand-blue/20 rounded-3xl blur-[60px] -z-10" />
              <img 
                src={mobileImage} 
                alt={t('homeExtra.altWhy')} 
                className="w-full h-auto rounded-3xl shadow-2xl border-4 border-white"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyVointy;
