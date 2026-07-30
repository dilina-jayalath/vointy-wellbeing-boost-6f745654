import React, { useState } from 'react';
import { Check, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const planFeatures = [
  'Unlimited employees',
  'Unlimited teams',
  'All activities',
  'Employer dashboard',
  'Reporting & analytics',
  'No per-user fees',
];

const highlights = [
  'Free 30-day trial',
  '€149/month',
  'No setup fee',
  'Unlimited employees',
  'Cancel anytime',
];

const Subscription = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    message: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const scrollToForm = () => {
    document.getElementById('subscription-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('contact_submissions').insert([
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          company_name: formData.companyName,
          subject: 'Employer dashboard subscription — €149/month',
          message:
            `Plan: Employer Dashboard (€149/month)\n\n` +
            (formData.message ? `Message: ${formData.message}` : ''),
        },
      ]);
      if (error) throw error;
      toast({ title: 'Request received!' });
      setIsSuccess(true);
      setFormData({ firstName: '', lastName: '', email: '', companyName: '', message: '' });
    } catch (error: any) {
      toast({ title: 'Something went wrong', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow pt-24">
        <section className="bg-gradient-to-b from-purple-50 to-white pt-16 pb-12">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 text-brand-dark leading-tight">
              One simple price. Unlimited employees. Unlimited teams.{' '}
              <span className="gradient-text">€149/month.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Companies join Vointy for free and share credentials with employees across unlimited
              teams. Upgrade only when you want the employer dashboard with analytics, campaigns,
              and events.
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
                  <h3 className="text-2xl font-bold mb-2 text-brand-dark">Free</h3>
                  <div className="flex items-end mb-4">
                    <span className="text-5xl font-bold text-brand-dark">€0</span>
                    <span className="text-gray-500 ml-2 mb-1">forever</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Join as a company and share Vointy credentials with your employees across
                    unlimited teams.
                  </p>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {[
                      'Unlimited employees',
                      'Unlimited teams',
                      'All employee activities',
                      'Team-based access',
                    ].map((f) => (
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
                    <Link to="/company-signup">Get started free</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-brand-purple relative shadow-xl">
                <div className="bg-brand-purple text-white py-1 px-4 text-sm font-medium absolute top-0 right-0 rounded-bl-lg">
                  Employer Dashboard
                </div>
                <CardContent className="p-8 flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-2 text-brand-dark">Company Plan</h3>
                  <div className="flex items-end mb-4">
                    <span className="text-5xl font-bold text-brand-dark">€149</span>
                    <span className="text-gray-500 ml-2 mb-1">/month / company</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Everything in Free, plus the employer dashboard with tracking, analytics,
                    campaigns, events and invitations.
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
                    className="w-full h-12 text-lg font-semibold bg-brand-purple hover:bg-brand-purple-dark text-white"
                    onClick={scrollToForm}
                  >
                    Start free 30-day trial
                  </Button>
                </CardContent>
              </Card>
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
                    <h2 className="text-3xl font-bold text-brand-dark">Request received!</h2>
                    <p className="text-gray-600 text-lg">
                      We'll be in touch shortly to set up your Vointy account.
                    </p>
                    <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-4">
                      Send another request
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-2xl border-none overflow-hidden">
                  <CardHeader className="bg-brand-purple text-white p-8">
                    <CardTitle className="text-2xl">Get started with Vointy</CardTitle>
                    <p className="text-white/80 mt-2">
                      Fill out the form and we'll contact you to activate your company account.
                    </p>
                  </CardHeader>
                  <CardContent className="p-8 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="h-12" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="h-12" />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className="h-12" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name *</Label>
                          <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} required className="h-12" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message (optional)</Label>
                        <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} rows={4} placeholder="How can we help you?" className="resize-none" />
                      </div>
                      <Button type="submit" className="w-full btn-primary h-14 text-lg font-bold" disabled={isSubmitting}>
                        {isSubmitting ? 'Processing...' : 'Request access'}
                      </Button>
                      <p className="text-sm text-gray-500 text-center">
                        By submitting, you agree to our Terms of Service and Privacy Policy.
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
