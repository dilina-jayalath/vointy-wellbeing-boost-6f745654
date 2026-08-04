
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import Seo from '@/components/Seo';

interface Reason {
  title: string;
  description: string;
}

const Contact = () => {
  const { t } = useTranslation();
  const reasons = t('contactPage.reasons') as Reason[];
  return (
    <div className="min-h-screen">
      <Seo
        title={"Contact — Vointy.life"}
        description={"Get in touch with the Vointy.life team in Oulu, Finland. Email contact@vointy.life or request a demo."}
        path="/contact"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact Vointy.life',
          url: 'https://vointy.life/contact',
          mainEntity: {
            '@type': 'Organization',
            name: 'Vointy.life',
            legalName: 'Wellthyforce Oy',
            url: 'https://vointy.life/',
            email: 'contact@vointy.life',
            vatID: 'FI32544184',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Vasantie 43',
              postalCode: '90310',
              addressLocality: 'Oulu',
              addressCountry: 'FI',
            },
            contactPoint: [
              {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                email: 'contact@vointy.life',
                availableLanguage: ['en', 'fi'],
              },
              {
                '@type': 'ContactPoint',
                contactType: 'sales',
                email: 'contact@vointy.life',
                availableLanguage: ['en', 'fi'],
              },
            ],
          },
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-brand-purple to-brand-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              {t('contactPage.title')}
            </h1>
            <p className="text-xl opacity-90 mb-8">
              {t('contactPage.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold font-display mb-8">{t('contactPage.conversationTitle')}</h2>
                <p className="text-lg text-gray-600 mb-8">
                  {t('contactPage.conversationDescription')}
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-brand-purple/10 rounded-lg flex items-center justify-center mr-4">
                      <Mail className="h-6 w-6 text-brand-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t('contactPage.emailUsLabel')}</h3>
                      <p className="text-gray-600">contact@vointy.life</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-brand-purple/10 rounded-lg flex items-center justify-center mr-4">
                      <MapPin className="h-6 w-6 text-brand-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t('contactPage.visitUsLabel')}</h3>
                      <p className="text-gray-600">{t('contactPage.addressLine1')}<br />{t('contactPage.addressLine2')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center mr-4">
                      <Clock className="h-6 w-6 text-brand-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t('contactPage.hoursLabel')}</h3>
                      <p className="text-gray-600">{t('contactPage.hoursValue')}</p>
                    </div>
                  </div>
                </div>

                <Link to="/contact-form">
                  <Button className="btn-primary">
                    {t('contactPage.requestDemo')}
                  </Button>
                </Link>
              </div>
              
              {/* Additional Information Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{t('contactPage.whyChooseTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {reasons.map((reason) => (
                    <div key={reason.title}>
                      <h3 className="font-semibold mb-2">{reason.title}</h3>
                      <p className="text-gray-600">{reason.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
