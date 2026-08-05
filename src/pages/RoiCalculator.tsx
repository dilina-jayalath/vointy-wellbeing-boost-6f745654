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
import { TrendingUp, Euro, CalendarDays, Percent, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/lib/i18n';
import { toast } from '@/hooks/use-toast';

const EMPLOYER_PANEL_MONTHLY = 149;
const WORKING_DAYS_PER_YEAR = 220;
const EMPLOYER_COST_MULTIPLIER = 1.3; // salary + social costs, replacement work, lost output

const RoiCalculator = () => {
  const { language } = useTranslation();
  const [employees, setEmployees] = useState(200);
  const [monthlySalary, setMonthlySalary] = useState(3800);
  const [sickDaysPerEmployee, setSickDaysPerEmployee] = useState(9);
  const [reduction, setReduction] = useState(10);

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const result = useMemo(() => {
    const emp = Math.max(0, employees || 0);
    const days = Math.max(0, sickDaysPerEmployee || 0);
    const salary = Math.max(0, monthlySalary || 0);
    const costPerSickDay = ((salary * 12) / WORKING_DAYS_PER_YEAR) * EMPLOYER_COST_MULTIPLIER;
    const totalSickDays = emp * days;
    const currentCost = totalSickDays * costPerSickDay;
    const daysSaved = totalSickDays * (reduction / 100);
    const savings = daysSaved * costPerSickDay;
    // €149/month per 1,000 registered employees
    const licenseBlocks = Math.max(1, Math.ceil(emp / 1000));
    const annualLicense = licenseBlocks * EMPLOYER_PANEL_MONTHLY * 12;
    const net = savings - annualLicense;
    const roi = annualLicense > 0 ? (net / annualLicense) * 100 : 0;
    const breakEvenDays = costPerSickDay > 0 ? annualLicense / costPerSickDay : 0;
    const savingsPerEmployee = emp > 0 ? savings / emp : 0;
    return {
      costPerSickDay,
      totalSickDays,
      currentCost,
      daysSaved,
      savings,
      annualLicense,
      net,
      roi,
      breakEvenDays,
      savingsPerEmployee,
    };
  }, [employees, monthlySalary, sickDaysPerEmployee, reduction]);

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

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length > 255) {
      toast({ title: 'Please enter a valid email address.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: value, language }]);
      // A duplicate address is fine — the report still unlocks.
      if (error && !`${error.message}`.toLowerCase().includes('duplicate')) throw error;
      setUnlocked(true);
      toast({ title: 'Your full ROI report is unlocked below.' });
    } catch (err: any) {
      console.error('ROI lead error:', err);
      toast({ title: 'Something went wrong', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

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
                  <Label htmlFor="salary" className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-brand-purple" />
                    Average gross salary per month (€)
                  </Label>
                  <Input
                    id="salary"
                    type="number"
                    min={0}
                    step="50"
                    value={monthlySalary}
                    onChange={(e) => setMonthlySalary(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    We turn this into a cost per sick day: salary × 12 ÷ {WORKING_DAYS_PER_YEAR}{' '}
                    working days × {EMPLOYER_COST_MULTIPLIER} for social costs, replacement work and
                    lost output — currently {money(result.costPerSickDay)} per day.
                  </p>
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
                  <CardTitle className="text-xl">Estimated savings with Vointy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Annual savings</p>
                    <p className="text-4xl font-bold text-brand-purple">{money(result.savings)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Cost per sick day</p>
                      <p className="text-2xl font-bold">{money(result.costPerSickDay)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Savings per employee</p>
                      <p className="text-2xl font-bold">{money(result.savingsPerEmployee)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {unlocked ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-brand-purple" />
                      Your full report
                    </CardTitle>
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
                        <dt className="text-muted-foreground">Net benefit</dt>
                        <dd className="font-medium">{money(result.net)}</dd>
                      </div>
                      <div className="flex justify-between py-3">
                        <dt className="text-muted-foreground">Return on investment</dt>
                        <dd className="font-medium">{num(result.roi)}%</dd>
                      </div>
                      <div className="flex justify-between py-3">
                        <dt className="text-muted-foreground">Break-even</dt>
                        <dd className="font-medium">
                          {num(result.breakEvenDays, 1)} sick days avoided
                        </dd>
                      </div>
                    </dl>
                    <p className="text-xs text-muted-foreground mt-4">
                      Vointy is free for companies and employees. The Employer panel costs
                      €149/month per 1,000 registered employees. Estimates are indicative, not a
                      guarantee.
                    </p>
                    <Button asChild className="mt-6 w-full">
                      <Link to="/company-signup">Start free for your company</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-brand-purple/40">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Lock className="h-5 w-5 text-brand-purple" />
                      Get the full report
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Enter your email address to unlock the full report: total cost of absence,
                      days avoided, net benefit, ROI and your break-even point.
                    </p>
                    <form onSubmit={handleUnlock} className="space-y-3">
                      <Label htmlFor="leadEmail" className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-brand-purple" />
                        Work email
                      </Label>
                      <Input
                        id="leadEmail"
                        type="email"
                        required
                        maxLength={255}
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? 'Unlocking…' : 'Show my full report'}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        We only use your address to send the report and occasional wellbeing
                        insights. Unsubscribe any time — see our{' '}
                        <Link to="/privacy-policy" className="underline">
                          privacy policy
                        </Link>
                        .
                      </p>
                    </form>
                  </CardContent>
                </Card>
              )}
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
