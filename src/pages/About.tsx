import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/lib/i18n';
import { Heart, Users, Building2 } from 'lucide-react';

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-brand-purple to-brand-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              {t('aboutPage.title')}
            </h1>
            <p className="text-xl opacity-90">
              {t('aboutPage.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-lg text-muted-foreground">{t('aboutPage.p1')}</p>
            <p className="text-lg text-muted-foreground">{t('aboutPage.p2')}</p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Heart className="h-12 w-12 text-brand-purple mx-auto mb-4" />
              <h2 className="text-lg font-bold mb-2">{t('aboutPage.value1Title')}</h2>
              <p className="text-muted-foreground">{t('aboutPage.value1Description')}</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-brand-blue mx-auto mb-4" />
              <h2 className="text-lg font-bold mb-2">{t('aboutPage.value2Title')}</h2>
              <p className="text-muted-foreground">{t('aboutPage.value2Description')}</p>
            </div>
            <div className="text-center">
              <Building2 className="h-12 w-12 text-brand-purple mx-auto mb-4" />
              <h2 className="text-lg font-bold mb-2">{t('aboutPage.value3Title')}</h2>
              <p className="text-muted-foreground">{t('aboutPage.value3Description')}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
