import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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

const RoiCalculatorWidget = ({ idPrefix = 'roi' }: { idPrefix?: string }) => {
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

      // Also log the lead in the admin Messages view under its own category.
      const summary = [
        `Employees: ${num(employees)}`,
        `Monthly gross salary: ${money(monthlySalary)}`,
        `Sick days / employee / year: ${num(sickDaysPerEmployee)}`,
        `Assumed reduction: ${reduction}%`,
        '',
        `Cost per sick day: ${money(result.costPerSickDay)}`,
        `Current annual sick-leave cost: ${money(result.currentCost)}`,
        `Estimated annual savings: ${money(result.savings)}`,
        `Vointy annual licence: ${money(result.annualLicense)}`,
        `Net benefit: ${money(result.net)}`,
        `ROI: ${num(result.roi)}%`,
        `Language: ${language}`,
      ].join('\n');

      const { error: leadError } = await supabase.from('contact_submissions').insert([
        {
          first_name: 'ROI',
          last_name: 'Calculator lead',
          email: value,
          subject: `ROI report request — ${num(employees)} employees`,
          message: summary,
          category: 'roi_lead',
        },
      ]);
      if (leadError) console.error('ROI lead log error:', leadError);

      setUnlocked(true);
      toast({ title: 'Your full ROI report is unlocked below.' });
    } catch (err: any) {
      console.error('ROI lead error:', err);
      toast({ title: 'Something went wrong', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Your numbers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-employees`} className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-purple" />
              Number of employees
            </Label>
            <Input
              id={`${idPrefix}-employees`}
              type="number"
              min={1}
              value={employees}
              onChange={(e) => setEmployees(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-salary`} className="flex items-center gap-2">
              <Euro className="h-4 w-4 text-brand-purple" />
              Average gross salary per month (€)
            </Label>
            <Input
              id={`${idPrefix}-salary`}
              type="number"
              min={0}
              step="50"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              We turn this into a cost per sick day: salary × 12 ÷ {WORKING_DAYS_PER_YEAR} working
              days × {EMPLOYER_COST_MULTIPLIER} for social costs, replacement work and lost output —
              currently {money(result.costPerSickDay)} per day.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-sickDays`} className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-brand-purple" />
              Sick leave days per employee per year
            </Label>
            <Input
              id={`${idPrefix}-sickDays`}
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
              Workplace wellbeing programmes typically report a 5–15% reduction in short absences.
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
                  <dd className="font-medium">{num(result.breakEvenDays, 1)} sick days avoided</dd>
                </div>
              </dl>
              <p className="text-xs text-muted-foreground mt-4">
                Vointy is free for companies and employees. The Employer panel costs €149/month per
                1,000 registered employees. Estimates are indicative, not a guarantee.
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
                Enter your email address to unlock the full report: total cost of absence, days
                avoided, net benefit, ROI and your break-even point.
              </p>
              <form onSubmit={handleUnlock} className="space-y-3">
                <Label htmlFor={`${idPrefix}-leadEmail`} className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-brand-purple" />
                  Work email
                </Label>
                <Input
                  id={`${idPrefix}-leadEmail`}
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
                  We only use your address to send the report and occasional wellbeing insights.
                  Unsubscribe any time — see our{' '}
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
  );
};

export default RoiCalculatorWidget;
