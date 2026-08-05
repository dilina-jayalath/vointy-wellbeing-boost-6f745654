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
  const { language, t } = useTranslation();
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

  const locale =
    ({ en: 'en-IE', de: 'de-DE', fr: 'fr-FR', es: 'es-ES', it: 'it-IT', fi: 'fi-FI', sv: 'sv-SE', nl: 'nl-NL', da: 'da-DK' } as Record<string, string>)[language] ?? 'en-IE';

  const money = (v: number) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(Number.isFinite(v) ? v : 0);

  const num = (v: number, digits = 0) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(
      Number.isFinite(v) ? v : 0,
    );

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length > 255) {
      toast({ title: t('roi.toast.invalidEmail'), variant: 'destructive' });
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
      toast({ title: t('roi.toast.unlocked') });
    } catch (err: any) {
      console.error('ROI lead error:', err);
      toast({ title: t('roi.toast.error'), description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{t('roi.form.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-employees`} className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-purple" />
              {t('roi.form.employees')}
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
              {t('roi.form.salary')}
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
              {t('roi.form.salaryHelp', {
                days: WORKING_DAYS_PER_YEAR,
                mult: EMPLOYER_COST_MULTIPLIER,
                cost: money(result.costPerSickDay),
              })}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-sickDays`} className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-brand-purple" />
              {t('roi.form.sickDays')}
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
              {t('roi.form.reduction', { n: reduction })}
            </Label>
            <Slider
              value={[reduction]}
              onValueChange={(v) => setReduction(v[0])}
              min={1}
              max={30}
              step={1}
              aria-label={t('roi.form.reductionAria')}
            />
            <p className="text-xs text-muted-foreground">
              {t('roi.form.reductionHelp')}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-brand-purple/10 to-brand-blue/10">
          <CardHeader>
            <CardTitle className="text-xl">{t('roi.result.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('roi.result.annualSavings')}</p>
              <p className="text-4xl font-bold text-brand-purple">{money(result.savings)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('roi.result.costPerSickDay')}</p>
                <p className="text-2xl font-bold">{money(result.costPerSickDay)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('roi.result.savingsPerEmployee')}</p>
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
                {t('roi.report.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y">
                <div className="flex justify-between py-3">
                  <dt className="text-muted-foreground">{t('roi.report.sickDays')}</dt>
                  <dd className="font-medium">
                    {num(result.totalSickDays)} {t('roi.report.daysUnit')}
                  </dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-muted-foreground">{t('roi.report.currentCost')}</dt>
                  <dd className="font-medium">{money(result.currentCost)}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-muted-foreground">{t('roi.report.daysAvoided', { n: reduction })}</dt>
                  <dd className="font-medium">
                    {num(result.daysSaved, 1)} {t('roi.report.daysUnit')}
                  </dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-muted-foreground">{t('roi.report.license')}</dt>
                  <dd className="font-medium">{money(result.annualLicense)}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-muted-foreground">{t('roi.report.net')}</dt>
                  <dd className="font-medium">{money(result.net)}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-muted-foreground">{t('roi.report.roi')}</dt>
                  <dd className="font-medium">{num(result.roi)}%</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-muted-foreground">{t('roi.report.breakEven')}</dt>
                  <dd className="font-medium">
                    {t('roi.report.breakEvenValue', { n: num(result.breakEvenDays, 1) })}
                  </dd>
                </div>
              </dl>
              <p className="text-xs text-muted-foreground mt-4">
                {t('roi.report.note')}
              </p>
              <Button asChild className="mt-6 w-full">
                <Link to="/company-signup">{t('roi.report.cta')}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-brand-purple/40">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Lock className="h-5 w-5 text-brand-purple" />
                {t('roi.lead.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t('roi.lead.desc')}
              </p>
              <form onSubmit={handleUnlock} className="space-y-3">
                <Label htmlFor={`${idPrefix}-leadEmail`} className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-brand-purple" />
                  {t('roi.lead.emailLabel')}
                </Label>
                <Input
                  id={`${idPrefix}-leadEmail`}
                  type="email"
                  required
                  maxLength={255}
                  placeholder={t('roi.lead.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? t('roi.lead.submitting') : t('roi.lead.submit')}
                </Button>
                <p className="text-xs text-muted-foreground">
                  {t('roi.lead.privacyPre')}{' '}
                  <Link to="/privacy-policy" className="underline">
                    {t('roi.lead.privacyLink')}
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
