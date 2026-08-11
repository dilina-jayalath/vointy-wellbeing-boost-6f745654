import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import RoiCalculatorWidget from '@/components/RoiCalculatorWidget';
import { useTranslation } from '@/lib/i18n';
import { Smartphone, Monitor } from 'lucide-react';

const RoiCalculator = () => {
  const { t } = useTranslation();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Vointy Wellbeing ROI Calculator',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://vointy.life/roi-calculator',
    description:
      'Enter your employee count and average salary to estimate the annual sick leave savings and ROI of the Vointy wellbeing platform.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Wellbeing ROI Calculator for Employers | Vointy"
        description="Enter employee count and average salary to estimate your sick leave costs, the savings Vointy can deliver and the payback on the €149/month Employer panel."
        path="/roi-calculator"
        jsonLd={jsonLd}
      />
      <Header />

      <main>
        <section className="bg-gradient-to-br from-brand-purple/10 via-background to-brand-blue/10 py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('roi.page.h1')}</h1>
            <p className="text-lg text-muted-foreground">{t('roi.home.desc')}</p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <RoiCalculatorWidget idPrefix="page-roi" />
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="bg-gradient-to-br from-brand-purple/10 via-background to-brand-blue/10 border-brand-purple/20">
              <CardContent className="p-8 md:p-12 text-center">
                <div className="flex justify-center gap-4 mb-6">
                  <div className="bg-brand-purple/10 p-3 rounded-full">
                    <Monitor className="h-6 w-6 text-brand-purple" />
                  </div>
                  <div className="bg-brand-blue/10 p-3 rounded-full">
                    <Smartphone className="h-6 w-6 text-brand-blue" />
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('roi.page.downloadTitle')}</h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">{t('roi.page.downloadDesc')}</p>
                <Button asChild size="lg" className="btn-primary">
                  <Link to="/download">{t('roi.page.downloadCta')}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-muted/40">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">{t('roi.page.h2')}</h2>
            <p className="text-muted-foreground mb-4">{t('roi.page.p')}</p>
            <ul className="space-y-2 text-muted-foreground mb-8 list-disc pl-5">
              <li>{t('roi.page.b1')}</li>
              <li>{t('roi.page.b2')}</li>
              <li>{t('roi.page.b3')}</li>
            </ul>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/company-signup">{t('roi.page.ctaStart')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/subscription">{t('roi.page.ctaPricing')}</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              {t('roi.page.morePre')}{' '}
              <Link to="/corporate-wellness-programs" className="underline">
                {t('roi.page.moreLink1')}
              </Link>{' '}
              {t('roi.page.moreMid')}{' '}
              <Link to="/wellness-challenges-for-employees" className="underline">
                {t('roi.page.moreLink2')}
              </Link>
              .
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RoiCalculator;
