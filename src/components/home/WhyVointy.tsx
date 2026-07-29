import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { Activity, Brain, Users, TrendingUp } from 'lucide-react';

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
                <h4 className="text-lg font-bold mb-2">Track Progress</h4>
                <p className="text-gray-600">Personalized activity scores to monitor growth.</p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
                <Users className="text-brand-blue mb-4" size={32} />
                <h4 className="text-lg font-bold mb-2">Social Push</h4>
                <p className="text-gray-600">Invite friends and stay motivated together.</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full grid grid-cols-2 gap-4">
             <div className="space-y-4">
                <div className="aspect-square bg-brand-purple/10 rounded-3xl flex items-center justify-center">
                  <Activity size={64} className="text-brand-purple" />
                </div>
                <div className="aspect-video bg-gray-100 rounded-3xl" />
             </div>
             <div className="space-y-4 pt-8">
                <div className="aspect-video bg-brand-blue/10 rounded-3xl flex items-center justify-center">
                  <Brain size={48} className="text-brand-blue" />
                </div>
                <div className="aspect-square bg-gray-100 rounded-3xl" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyVointy;
