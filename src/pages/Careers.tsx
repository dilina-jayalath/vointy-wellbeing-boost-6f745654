
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/lib/i18n';
import Seo from '@/components/Seo';

const renderWithEmail = (text: string) => {
  const email = 'contact@vointy.life';
  const parts = text.split(email);
  if (parts.length === 1) return text;
  return (
    <>
      {parts[0]}
      <a href={`mailto:${email}`} className="text-brand-purple hover:underline">
        {email}
      </a>
      {parts[1]}
    </>
  );
};

const Careers = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Seo title={"Careers — Vointy.life"} description={"Join Vointy.life: we are looking for sales representatives and partnership partners in workplace wellbeing."} path="/careers" />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-brand-purple to-brand-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              {t('careersPage.title')}
            </h1>
            <p className="text-xl opacity-90">
              {t('careersPage.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 flex-grow">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg mb-12">{t('careersPage.intro')}</p>
            
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold font-display mb-4">
                  {t('careersPage.salesTitle')}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {renderWithEmail(t('careersPage.salesText'))}
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold font-display mb-4">
                  {t('careersPage.partnerTitle')}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {renderWithEmail(t('careersPage.partnerText'))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Careers;
