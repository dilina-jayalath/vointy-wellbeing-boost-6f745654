
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Briefcase } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface Position {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

const Careers = () => {
  const { t } = useTranslation();
  const openPositions = t('careersPage.positions') as Position[];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-brand-purple to-brand-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              {t('careersPage.title')}
            </h1>
            <p className="text-xl opacity-90 mb-8">
              {t('careersPage.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-display text-center mb-12">{t('careersPage.whyWorkTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-brand-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏠</span>
                </div>
                <h3 className="text-xl font-bold mb-4">{t('careersPage.benefit1Title')}</h3>
                <p className="text-gray-600">{t('careersPage.benefit1Description')}</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-xl font-bold mb-4">{t('careersPage.benefit2Title')}</h3>
                <p className="text-gray-600">{t('careersPage.benefit2Description')}</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-brand-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="text-xl font-bold mb-4">{t('careersPage.benefit3Title')}</h3>
                <p className="text-gray-600">{t('careersPage.benefit3Description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-display text-center mb-12">{t('careersPage.openPositionsTitle')}</h2>
            <div className="grid grid-cols-1 gap-6">
              {openPositions.map((position, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{position.title}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {position.department}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {position.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {position.type}
                          </div>
                        </div>
                      </div>
                      <Button className="btn-primary">{t('careersPage.applyNow')}</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{position.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">{t('careersPage.noRoleText')}</p>
              <Button variant="outline" className="btn-secondary">{t('careersPage.sendResume')}</Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Careers;
