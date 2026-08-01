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
                    asChild
                    className="w-full h-12 text-lg font-semibold bg-brand-purple hover:bg-brand-purple-dark text-white"
                  >
                    <Link to="/company-signup">Start free 30-day trial</Link>
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
