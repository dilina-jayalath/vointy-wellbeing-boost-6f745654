import React from 'react';
import { Check, CheckCircle2, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useEmployerOrg } from '@/hooks/useEmployerOrg';
import { usePaddleCheckout } from '@/hooks/usePaddleCheckout';
import { EMPLOYER_PRICE_ID } from '@/lib/paddle';
import { useTranslation } from '@/lib/i18n';


const Subscription = () => {
  const { t } = useTranslation();
  const planFeatures = t('pricingPage.planFeatures') as string[];
  const highlights = t('pricingPage.highlights') as string[];
  const freeFeatures = t('pricingPage.freeFeatures') as string[];
  const { user } = useAuth();
  const { orgId } = useEmployerOrg();
  const { openCheckout, loading: checkoutLoading } = usePaddleCheckout();
  const navigate = useNavigate();

  // Signed-in companies go straight to checkout; new companies register first.
  const handleUpgrade = () => {
    if (!user) {
      navigate('/company-signup');
      return;
    }
    openCheckout({
      priceId: EMPLOYER_PRICE_ID,
      quantity: 1,
      customerEmail: user.email ?? undefined,
      customData: { userId: user.id, ...(orgId ? { organizationId: orgId } : {}) },
    });
  };

  return (

    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow pt-24">
        <section className="bg-gradient-to-b from-purple-50 to-white pt-16 pb-12">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 text-brand-dark leading-tight">
              {t('pricingPage.headingPrefix')}{' '}
              <span className="gradient-text">{t('pricingPage.headingPrice')}</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              {t('pricingPage.subheading')}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {highlights.map((h) => (
                <span
                  key={h}
                  className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-brand-dark shadow-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-brand-purple" />
                  {h}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-8 flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-2 text-brand-dark">{t('pricingPage.freeTitle')}</h3>
                  <div className="flex items-end mb-4">
                    <span className="text-5xl font-bold text-brand-dark">€0</span>
                    <span className="text-gray-500 ml-2 mb-1">{t('pricingPage.freeForever')}</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    {t('pricingPage.freeDescription')}
                  </p>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {freeFeatures.map((f) => (
                      <li key={f} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-12 text-lg font-semibold border-2 border-brand-purple text-brand-purple hover:bg-brand-purple/5"
                  >
                    <Link to="/company-signup">{t('pricingPage.getStartedFree')}</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-brand-purple relative shadow-xl">
                <div className="bg-brand-purple text-white py-1 px-4 text-sm font-medium absolute top-0 right-0 rounded-bl-lg">
                  {t('pricingPage.employerDashboardBadge')}
                </div>
                <CardContent className="p-8 flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-2 text-brand-dark">{t('pricingPage.companyPlanTitle')}</h3>
                  <div className="flex items-end mb-4">
                    <span className="text-5xl font-bold text-brand-dark">€149</span>
                    <span className="text-gray-500 ml-2 mb-1">{t('pricingPage.perMonthPerCompany')}</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    {t('pricingPage.companyPlanDescription')}
                  </p>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {planFeatures.map((f) => (
                      <li key={f} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={handleUpgrade}
                    disabled={checkoutLoading}
                    className="w-full h-12 text-lg font-semibold bg-brand-purple hover:bg-brand-purple-dark text-white"
                  >
                    {checkoutLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {t('pricingPage.startTrial')}
                  </Button>

                </CardContent>
              </Card>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Subscription;
