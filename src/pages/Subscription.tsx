import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle2 } from 'lucide-react';

type PlanKey = 'basic' | 'pro' | 'enterprise';

interface Plan {
  key: PlanKey;
  mostPopular: boolean;
}

const teamSizeOptions = ['1-10', '11-50', '51-200', '201-500', '501+'];

const Subscription = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null);
  const [submittedPlan, setSubmittedPlan] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    teamSize: '',
    message: ''
  });

  const plans: Plan[] = [
    { key: 'basic', mostPopular: false },
    { key: 'pro', mostPopular: true },
    { key: 'enterprise', mostPopular: false }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectPlan = (planKey: PlanKey) => {
    setSelectedPlan(planKey);
    const formElement = document.getElementById('subscription-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlan) {
      toast({
        title: t('errors.generic', 'Please select a plan'),
        description: t('pricing.selectPlanHint', 'You need to select a subscription plan before proceeding.'),
      });
      return;
    }

    setIsSubmitting(true);

    const planName = t(`pricing.${selectedPlan}.name`);
    const subject = `Subscription interest: ${planName}`;
    const messageBody = [
      `Plan: ${planName}`,
      `Team size: ${formData.teamSize}`,
      formData.message ? `Message: ${formData.message}` : ''
    ].filter(Boolean).join('\n\n');

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          company_name: formData.companyName,
          subject,
          message: messageBody
        }]);

      if (error) throw error;

      toast({
        title: t('pricing.successTitle'),
      });
      setSubmittedPlan(planName);
      setIsSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        companyName: '',
        teamSize: '',
        message: ''
      });
      setSelectedPlan(null);
    } catch (error: any) {
      console.error('Subscription submission error:', error);
      toast({
        title: t('errors.generic'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow pt-24">
        <section className="bg-gradient-to-b from-purple-50 to-white pt-16 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 text-brand-dark">
              {t('pricing.title').split(' ').slice(0, -1).join(' ')} <span className="gradient-text">{t('pricing.title').split(' ').pop()}</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              {t('pricing.subtitle')}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => {
                const planData = t(`pricing.${plan.key}`);
                const isSelected = selectedPlan === plan.key;
                return (
                  <Card
                    key={plan.key}
                    className={`overflow-hidden transition-all duration-200 ${
                      plan.mostPopular
                        ? 'border-2 border-brand-purple relative shadow-xl'
                        : 'border border-gray-200 shadow-sm'
                    } ${isSelected ? 'ring-2 ring-brand-purple ring-offset-2' : ''}`}
                  >
                    {plan.mostPopular && (
                      <div className="bg-brand-purple text-white py-1 px-4 text-sm font-medium absolute top-0 right-0 rounded-bl-lg">
                        {t('pricing.mostPopular')}
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-2 text-brand-dark">{planData.name}</h3>
                      <div className="flex items-end mb-4">
                        <span className="text-4xl font-bold text-brand-dark">{planData.price}</span>
                        <span className="text-gray-500 ml-1">{t('pricing.perMonth')}</span>
                      </div>
                      <p className="text-gray-600 mb-6">{planData.description}</p>
                      <Button
                        className={`w-full mb-6 h-12 text-lg font-semibold ${
                          plan.mostPopular
                            ? 'bg-brand-purple hover:bg-brand-purple-dark text-white'
                            : 'bg-white text-brand-purple border-2 border-brand-purple hover:bg-brand-purple/5'
                        }`}
                        onClick={() => handleSelectPlan(plan.key)}
                      >
                        {planData.cta}
                      </Button>
                      <ul className="space-y-3">
                        {(planData.features as string[]).map((feature: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="subscription-form" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              {isSuccess ? (
                <Card className="text-center p-12 shadow-xl border-none">
                  <CardContent className="space-y-6">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-bold text-brand-dark">{t('pricing.successTitle')}</h2>
                    <p className="text-gray-600 text-lg">
                      {t('pricing.successMessage').replace('{plan}', submittedPlan || '')}
                    </p>
                    <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-4">
                      {t('pricing.submit')}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-2xl border-none overflow-hidden">
                  <CardHeader className="bg-brand-purple text-white p-8">
                    <CardTitle className="text-2xl">
                      {selectedPlan ? `${t('pricing.formTitle')} — ${t(`pricing.${selectedPlan}.name`)}` : t('pricing.formTitle')}
                    </CardTitle>
                    <p className="text-white/80 mt-2">{t('pricing.formSubtitle')}</p>
                  </CardHeader>
                  <CardContent className="p-8 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
                            {t('pricing.firstName')} *
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="John"
                            required
                            className="h-12 border-gray-200 focus:border-brand-purple focus:ring-brand-purple"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
                            {t('pricing.lastName')} *
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Doe"
                            required
                            className="h-12 border-gray-200 focus:border-brand-purple focus:ring-brand-purple"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                            {t('pricing.email')} *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            required
                            className="h-12 border-gray-200 focus:border-brand-purple focus:ring-brand-purple"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companyName" className="text-sm font-semibold text-gray-700">
                            {t('pricing.companyName')} *
                          </Label>
                          <Input
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            placeholder="Your Company"
                            required
                            className="h-12 border-gray-200 focus:border-brand-purple focus:ring-brand-purple"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="teamSize" className="text-sm font-semibold text-gray-700">
                          {t('pricing.teamSize')} *
                        </Label>
                        <select
                          id="teamSize"
                          name="teamSize"
                          value={formData.teamSize}
                          onChange={handleInputChange}
                          required
                          className="w-full h-12 px-4 border border-gray-200 rounded-md focus:ring-brand-purple focus:border-brand-purple bg-white"
                        >
                          <option value="">{t('pricing.teamSize')}</option>
                          {teamSizeOptions.map((size) => (
                            <option key={size} value={size}>
                              {t(`pricing.teamSizeOptions.${size}`)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-semibold text-gray-700">
                          {t('pricing.message')}
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="How can we help you?"
                          className="border-gray-200 focus:border-brand-purple focus:ring-brand-purple resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full btn-primary h-14 text-lg font-bold shadow-lg shadow-brand-purple/20 transition-all hover:-translate-y-0.5"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Processing...' : t('pricing.submit')}
                      </Button>

                      <p className="text-sm text-gray-500 text-center">
                        By subscribing, you agree to our Terms of Service and Privacy Policy.
                        We'll contact you to complete the setup of your subscription.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Subscription;
