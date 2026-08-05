import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, Euro, CalendarDays, Percent } from 'lucide-react';

const EMPLOYER_PANEL_MONTHLY = 149;

const RoiCalculator = () => {
  const [employees, setEmployees] = useState(200);
  const [sickDaysPerEmployee, setSickDaysPerEmployee] = useState(9);
  const [costPerSickDay, setCostPerSickDay] = useState(350);
  const [reduction, setReduction] = useState(10);

  const result = useMemo(() => {
    const emp = Math.max(0, employees || 0);
    const days = Math.max(0, sickDaysPerEmployee || 0);
    const cost = Math.max(0, costPerSickDay || 0);
    const totalSickDays = emp * days;
    const currentCost = totalSickDays * cost;
    const daysSaved = totalSickDays * (reduction / 100);
    const savings = daysSaved * cost;
    // €149/month per 1000 registered employees
    const licenseBlocks = Math.max(1, Math.ceil(emp / 1000));
    const annualLicense = licenseBlocks * EMPLOYER_PANEL_MONTHLY * 12;
    const net = savings - annualLicense;
    const roi = annualLicense > 0 ? (net / annualLicense) * 100 : 0;
    const breakEvenDays = cost > 0 ? annualLicense / cost : 0;
    return { totalSickDays, currentCost, daysSaved, savings, annualLicense, net, roi, breakEvenDays };
  }, [employees, sickDaysPerEmployee, costPerSickDay, reduction]);

  const money = (v: number) =>
    new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(Number.isFinite(v) ? v : 0);

  const num = (v: number, digits = 0) =>
    new Intl.NumberFormat('en-IE', { maximumFractionDigits: digits }).format(
      Number.isFinite(v) ? v : 0,
    );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Vointy Wellbeing ROI Calculator',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://vointy.life/roi-calculator',
    description:
      'Estimate the annual savings and ROI of a corporate wellbeing programme by comparing sick leave costs with the €149/month Vointy Employer panel.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Wellbeing ROI Calculator for Employers | Vointy"
        description="Calculate the ROI of your corporate wellbeing programme: estimate sick leave costs, savings from reduced absence and payback on the €149/month Employer panel."
        path="/roi-calculator"
        jsonLd={jsonLd}
      />
      <Header />

      <main>
        <section className="bg-gradient-to-br from-brand-purple/10 via-background to-brand-blue/10 py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Wellbeing ROI calculator
            </h1>
            <p className="text-lg text-muted-foreground">
              See what sick leave costs your company today, and what even a small reduction in
              absence is worth compared to the €149/month Employer panel.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 grid gap-8 lg:grid-cols-2 max-w-6xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Your numbers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="employees" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-brand-purple" />
                    Number of employees
                  </Label>
                  <Input
                    id="employees"
                    type="number"
                    min={1}
                    value={employees}
                    onChange={(e) => setEmployees(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sickDays" className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-brand-purple" />
                    Sick leave days per employee per year
                  </Label>
                  <Input
                    id="sickDays"
                    type="number"
                    min={0}
                    step="0.1"
                    value={sickDaysPerEmployee}
                    onChange={(e) => setSickDaysPerEmployee(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costPerDay" className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-brand-purple" />
                    Cost of one sick leave day (€)
                  </Label>
                  <Input
                    id="costPerDay"
                    type="number"
                    min={0}
                    value={costPerSickDay}
                    onChange={(e) => setCostPerSickDay(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Includes salary, replacement work and lost productivity. A common European
                    estimate is €300–400 per day.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-brand-purple" />
                    Expected reduction in sick leave: {reduction}%
                  </Label>
                  <Slider
                    value={[reduction]}
                    onValueChange={(v) => setReduction(v[0])}
                    min={1}
                    max={30}
                    step={1}
                    aria-label="Expected reduction in sick leave"
                  />
                  <p className="text-xs text-muted-foreground">
                    Workplace wellbeing programmes typically report a 5–15% reduction in short
                    absences.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-brand-purple/10 to-brand-blue/10">
                <CardHeader>
                  <CardTitle className="text-xl">Your estimated result</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Annual savings</p>
                    <p className="text-4xl font-bold text-brand-purple">
                      {money(result.savings)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Return on investment</p>
                      <p className="text-2xl font-bold">{num(result.roi)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Net benefit</p>
                      <p className="text-2xl font-bold">{money(result.net)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">How it adds up</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="divide-y">
                    <div className="flex justify-between py-3">
                      <dt className="text-muted-foreground">Sick leave days per year</dt>
                      <dd className="font-medium">{num(result.totalSickDays)} days</dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-muted-foreground">Current cost of absence</dt>
                      <dd className="font-medium">{money(result.currentCost)}</dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-muted-foreground">Days avoided ({reduction}%)</dt>
                      <dd className="font-medium">{num(result.daysSaved, 1)} days</dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-muted-foreground">Employer panel (12 months)</dt>
                      <dd className="font-medium">{money(result.annualLicense)}</dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-muted-foreground">Break-even</dt>
                      <dd className="font-medium">
                        {num(result.breakEvenDays, 1)} sick days avoided
                      </dd>
                    </div>
                  </dl>
                  <p className="text-xs text-muted-foreground mt-4">
                    Vointy is free for companies and employees. The Employer panel costs €149/month
                    per 1,000 registered employees. Estimates are indicative, not a guarantee.
                  </p>
                </CardContent>
              </Card>
            </div>
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
