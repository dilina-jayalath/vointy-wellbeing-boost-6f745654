import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { MessageCircle, Share2, Target, Heart } from 'lucide-react';
import socialImage from '@/assets/social.jpg';

const SocialPlatform = () => {
  const { t } = useTranslation();
  
  const iconMap: Record<number, React.ReactNode> = {
    0: <Target className="text-brand-purple" />,
    1: <MessageCircle className="text-brand-blue" />,
    2: <Share2 className="text-indigo-500" />,
    3: <Heart className="text-pink-500" />,
  };

  const features = t('social.features') || [];

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-dark mb-6">
            {t('social.title')}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="grid gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                  {iconMap[index] || <Target />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-dark mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-brand-purple/20 rounded-full blur-[100px] -z-10" />
            <div className="bg-white p-4 rounded-3xl shadow-2xl border border-gray-100 max-w-sm">
              <img 
                src={socialImage} 
                alt="Vointy social feed on a mobile phone" 
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialPlatform;
