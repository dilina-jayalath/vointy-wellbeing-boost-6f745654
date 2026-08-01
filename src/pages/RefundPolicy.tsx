import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCcw, Clock, CreditCard, Building, Mail, Info } from 'lucide-react';

const RefundPolicy = () => {
  const sections = [
    {
      id: 1,
      title: "30-Day Money-Back Guarantee",
      icon: <RefreshCcw className="w-6 h-6 text-brand-purple" />,
      content: (
        <div className="bg-purple-50 border-l-4 border-brand-purple p-4 rounded-r-lg">
          <p className="text-gray-700 leading-relaxed mb-4">
            We offer a <strong>30-day money-back guarantee</strong> on paid Vointy.life subscriptions. If you are not satisfied with your purchase, you can request a <strong>full refund within 30 days of your order date</strong> — no explanation required.
          </p>
          <p className="text-gray-700 leading-relaxed">
            This applies to the Employer panel subscription (EUR 149 per month per company). Use of Vointy.life by companies and their employees is free of charge, so there is nothing to refund for free accounts.
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: "How to Request a Refund",
      icon: <Mail className="w-6 h-6 text-brand-blue" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Refunds are processed by our payment provider and Merchant of Record, Paddle. You can request a refund in either of the following ways:
          </p>
          <div className="grid gap-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-brand-blue rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">
                Visit{' '}
                <a href="https://paddle.net" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">paddle.net</a>{' '}
                and look up your order using the email address you used at checkout.
              </span>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-brand-blue rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">
                Email us at{' '}
                <a href="mailto:contact@vointy.life" className="text-brand-blue hover:underline">contact@vointy.life</a>{' '}
                with your company name and order details, and we will arrange the refund with Paddle.
              </span>
            </div>
          </div>
          <p className="text-gray-700 mt-4 leading-relaxed">
            Approved refunds are returned to the original payment method. Processing times depend on your bank or card issuer, typically within 5–10 business days.
          </p>
        </div>
      )
    },
    {
      id: 3,
      title: "Free Trial and Cancellation",
      icon: <Clock className="w-6 h-6 text-brand-purple" />,
      content: (
        <div className="grid gap-3">
          {[
            "Every new Employer panel subscription starts with a 30-day free trial. A valid payment method is required to start the trial, and no charge is made during the trial.",
            "If you cancel before the trial ends, you are not charged at all.",
            "You can cancel your subscription at any time. Cancellation stops future renewals, and access to the Employer panel continues until the end of the billing period you have already paid for.",
            "You can cancel from the Employer panel billing page or through the Paddle billing portal."
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-brand-purple rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 4,
      title: "Merchant of Record",
      icon: <Building className="w-6 h-6 text-brand-blue" />,
      content: (
        <div className="bg-blue-50 border-l-4 border-brand-blue p-4 rounded-r-lg">
          <p className="text-gray-700 leading-relaxed mb-4">
            Our order process is conducted by our online reseller <strong>Paddle.com</strong>. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Refunds are additionally governed by{' '}
            <a href="https://www.paddle.com/legal/refund-policy" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
              Paddle's Refund Policy
            </a>{' '}
            and{' '}
            <a href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
              Paddle's Buyer Terms
            </a>.
          </p>
        </div>
      )
    },
    {
      id: 5,
      title: "Statutory Rights",
      icon: <Info className="w-6 h-6 text-brand-purple" />,
      content: (
        <p className="text-gray-700 leading-relaxed">
          This policy is offered in addition to, and does not limit, any rights you may have under applicable consumer protection law. Nothing in this policy affects your statutory rights.
        </p>
      )
    },
    {
      id: 6,
      title: "Contact",
      icon: <CreditCard className="w-6 h-6 text-brand-blue" />,
      content: (
        <div className="bg-blue-50 border-l-4 border-brand-blue p-4 rounded-r-lg">
          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Wellthyforce Oy</strong> (Business ID 3254418-4)
          </p>
          <p className="text-gray-700 leading-relaxed mb-2">
            Vasantie 43, 90310 Oulu, Finland
          </p>
          <p className="text-gray-700 leading-relaxed">
            Email: <a href="mailto:contact@vointy.life" className="text-brand-blue hover:underline">contact@vointy.life</a>
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="pt-24 pb-16 bg-gradient-to-br from-brand-blue to-brand-purple text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6">
              <RefreshCcw className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6">
              Refund Policy
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
              30-day money-back guarantee on Vointy.life subscriptions
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
              <p className="text-white/90">
                <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8">
              {sections.map((section) => (
                <Card key={section.id} className="card-shadow hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full flex-shrink-0">
                        {section.icon}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-brand-blue text-white text-sm font-bold rounded-full">
                            {section.id}
                          </span>
                          <h2 className="text-2xl font-bold text-brand-dark">{section.title}</h2>
                        </div>
                      </div>
                    </div>
                    <div className="ml-16">{section.content}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RefundPolicy;
