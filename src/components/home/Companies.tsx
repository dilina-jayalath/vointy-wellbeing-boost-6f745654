import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { Link } from 'react-router-dom';
import { Building2, CheckCircle2 } from 'lucide-react';
import leadershipImage from '@/assets/leadership.jpg';

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
              Free for companies. <span className="text-brand-blue">Pay only</span> for the employer dashboard.
            </h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Join Vointy for free and share credentials with your employees across unlimited teams — no per-user fees.
              Upgrade to the employer dashboard when you want tracking, analytics, campaigns and events.
            </p>
            
            <div className="space-y-4 mb-10">
              {['Unlimited employees', 'Unlimited teams', 'All activities', 'Employer dashboard', 'Reporting & analytics', 'No per-user fees'].map((feat) => (
                <div key={feat} className="flex items-center gap-3">
                  <CheckCircle2 className="text-brand-purple" size={20} />
                  <span className="text-gray-200 font-medium">{feat}</span>
                </div>
              ))}
            </div>
            
            <Link to="/subscription">
              <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white px-10 py-6 h-auto text-lg rounded-full">
                See pricing
              </Button>
            </Link>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-brand-purple/20 rounded-3xl blur-[80px] -z-10" />
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
              <img 
                src={leadershipImage} 
                alt="Company leadership discussing employee wellbeing" 
                className="w-full h-auto rounded-2xl object-cover mb-6"
              />
              <div className="text-center">
                <div className="text-brand-blue text-sm font-bold uppercase tracking-tighter mb-2">Employer Dashboard</div>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-6xl md:text-7xl font-black">€149</span>
                  <span className="text-xl text-gray-400 font-medium">/month</span>
                </div>
                <div className="text-sm text-gray-400">per company · unlimited users</div>
              </div>
              <div className="h-px w-full bg-white/10 my-6" />
              <div className="grid grid-cols-2 gap-8">
                <div className="text-left">
                  <div className="text-brand-purple font-bold text-2xl mb-1">30 days</div>
                  <div className="text-sm text-gray-400 uppercase">Free trial</div>
                </div>
                <div className="text-left">
                  <div className="text-brand-purple font-bold text-2xl mb-1">€0</div>
                  <div className="text-sm text-gray-400 uppercase">Setup fee</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Companies;
