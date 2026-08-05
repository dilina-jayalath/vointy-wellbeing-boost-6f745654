import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import RoiCalculatorWidget from '@/components/RoiCalculatorWidget';

const RoiCalculator = () => {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Wellbeing ROI calculator</h1>
            <p className="text-lg text-muted-foreground">
              Enter your number of employees and average salary. The calculator shows the estimated
              savings your company can reach on the vointy.life platform.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <RoiCalculatorWidget idPrefix="page-roi" />
          </div>
        </section>

        <section className="py-12 md:py-16 bg-muted/40">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">From estimate to measured ROI</h2>
            <p className="text-muted-foreground mb-4">
              This calculator gives you a first estimate. Inside the Employer panel you can upload
              your real monthly sick leave data as a CSV and compare it against the Activity Index,
              so savings are measured from your own numbers instead of assumptions.
            </p>
            <ul className="space-y-2 text-muted-foreground mb-8 list-disc pl-5">
              <li>Monthly sick leave trend against activity participation</li>
              <li>Cost per sick day and subscription cost in one ROI view</li>
              <li>Team-level engagement, challenges and survey results</li>
            </ul>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/company-signup">Start free for your company</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/subscription">See Employer panel pricing</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Read more about{' '}
              <Link to="/corporate-wellness-programs" className="underline">
                how Vointy corporate wellness programs work
              </Link>{' '}
              or browse{' '}
              <Link to="/wellness-challenges-for-employees" className="underline">
                wellness challenges for employees
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
