import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { Link } from 'react-router-dom';
import { Sparkles, Activity } from 'lucide-react';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-brand-purple/5 to-transparent rounded-l-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-1/2 bg-gradient-to-tr from-brand-blue/5 to-transparent rounded-r-full blur-3xl" />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-sm font-semibold mb-6 animate-fade-in">
              <Sparkles size={16} />
              <span>{t('hero.ctaFree')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-brand-dark mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/signup">
                <Button className="btn-primary text-lg px-8 py-6 h-auto">
                  {t('hero.ctaFree')}
                </Button>
              </Link>
              <Link to="/contact-form">
                <Button variant="outline" className="text-lg px-8 py-6 h-auto">
                  {t('hero.ctaDemo')}
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex-1 relative w-full max-w-xl">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 flex items-center justify-center p-8 relative animate-float">
              <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-3xl -m-4 -z-10 border border-white/50" />
              <div className="w-full h-full bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-4 text-brand-purple">
                <Activity size={80} className="animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-purple w-2/3 animate-progress-flow" />
                </div>
                <div className="h-4 w-1/2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-blue w-1/2 animate-progress-flow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
