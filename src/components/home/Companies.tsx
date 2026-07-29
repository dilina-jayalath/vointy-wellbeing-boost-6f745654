import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { Link } from 'react-router-dom';
import { Building2, CheckCircle2 } from 'lucide-react';

const Companies = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-brand-dark text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-purple/10 rounded-full blur-3xl -ml-32 -mb-32" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-blue font-semibold mb-6">
              <Building2 size={24} />
              <span className="uppercase tracking-widest">{t('companies.title')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              Scale wellness across your <span className="text-brand-blue">entire organization</span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              {t('companies.description')}
            </p>
            
            <div className="space-y-4 mb-10">
              {['Unlimited teams', 'HR Dashboard', 'Employee engagement analytics', 'Custom challenges'].map((feat) => (
                <div key={feat} className="flex items-center gap-3">
                  <CheckCircle2 className="text-brand-purple" size={20} />
                  <span className="text-gray-200 font-medium">{feat}</span>
                </div>
              ))}
            </div>
            
            <Link to="/contact-form">
              <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white px-10 py-6 h-auto text-lg rounded-full">
                {t('companies.cta')}
              </Button>
            </Link>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10 text-center">
            <div className="text-brand-blue text-sm font-bold uppercase tracking-tighter mb-2">Special Enterprise Pricing</div>
            <div className="flex items-baseline justify-center gap-1 mb-4">
              <span className="text-6xl md:text-8xl font-black">{t('companies.price')}</span>
              <span className="text-xl text-gray-400 font-medium">{t('companies.priceUnit')}</span>
            </div>
            <div className="h-px w-full bg-white/10 my-8" />
            <div className="grid grid-cols-2 gap-8">
              <div className="text-left">
                <div className="text-brand-purple font-bold text-2xl mb-1">24/7</div>
                <div className="text-sm text-gray-400 uppercase">Support</div>
              </div>
              <div className="text-left">
                <div className="text-brand-purple font-bold text-2xl mb-1">Easy</div>
                <div className="text-sm text-gray-400 uppercase">Setup</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Companies;
