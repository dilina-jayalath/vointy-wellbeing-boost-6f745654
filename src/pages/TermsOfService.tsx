import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Shield, Users, Lock, AlertTriangle, Scale, Clock, Mail, Building, Stethoscope, Info, CreditCard } from 'lucide-react';

const TermsOfService = () => {
  const sections = [
    {
      id: 1,
      title: "Acceptance of Terms",
      icon: <FileText className="w-6 h-6 text-brand-purple" />,
      content: (
        <p className="text-gray-700 leading-relaxed">
          By accessing and using Vointy.life, you accept and agree to be bound by these Terms of Service. If you do not agree to all of these terms, please do not use the service.
        </p>
      )
    },
    {
      id: 2,
      title: "Company Information",
      icon: <Building className="w-6 h-6 text-brand-blue" />,
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
    },
    {
      id: 3,
      title: "Important Notice: Not a Healthcare Service",
      icon: <Stethoscope className="w-6 h-6 text-red-500" />,
      content: (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Vointy.life is not a healthcare service.</strong> The platform does not provide medical advice, diagnoses, treatments, or other health-related guidance.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Vointy.life is an <strong>information service</strong> that enables workplace teams and individuals to discover, organize, and track wellbeing-related activities and challenges.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong>Each user is solely responsible</strong> for the activities they choose to perform and for any consequences resulting from those activities. Always consult a qualified healthcare professional before beginning any new physical activity or wellness program, especially if you have any medical condition or concern.
          </p>
        </div>
      )
    },
    {
      id: 4,
      title: "Eligibility",
      icon: <Users className="w-6 h-6 text-brand-blue" />,
      content: (
        <div className="grid gap-3">
          {[
            "You must be at least 18 years old to use Vointy.life.",
            "If you use Vointy.life through your employer or organization, you must be authorized to participate.",
            "By using the service, you represent that you meet these eligibility requirements."
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-brand-blue rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 5,
      title: "Service Description",
      icon: <Shield className="w-6 h-6 text-brand-purple" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Vointy.life provides an online platform that helps organizations and teams support employee wellbeing through social engagement, activity tracking, and employer-facing analytics.
          </p>
          <div className="grid gap-3">
            {[
              "Activity and challenge management",
              "Social engagement features for employees",
              "Analytics and reporting for paying employer accounts",
              "Informational content related to wellbeing activities"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-brand-purple rounded-full flex-shrink-0"></div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Free Use and Paid Subscription",
      icon: <CreditCard className="w-6 h-6 text-brand-purple" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Companies and their employees can use Vointy.life free of charge, with unlimited teams and unlimited employees. The optional <strong>Employer panel</strong> (tracking, analytics, reporting, campaigns, events and invitations) is a paid subscription sold by Wellthyforce Oy.
          </p>
          <div className="grid gap-3">
            {[
              "Price: EUR 149 per month per company, with no setup fee and no per-user fees. Applicable taxes (such as VAT) are added at checkout and shown before you confirm your order.",
              "Free trial: new subscriptions include a 30-day free trial. A valid payment method is required to start the trial.",
              "Trial-to-paid conversion: unless you cancel before the trial ends, the subscription automatically converts to a paid subscription and the first monthly charge is made at the end of the trial.",
              "Billing cycle: the subscription is billed monthly in advance and renews automatically each month until cancelled.",
              "Cancellation: you may cancel at any time. Cancellation stops future renewals, and access to the Employer panel continues until the end of the billing period already paid for.",
              "Price changes: we may change subscription pricing with at least 30 days' prior notice before the change applies to your next renewal.",
              "Non-payment: if a payment fails and is not resolved after retries, access to the Employer panel may be suspended or the subscription terminated."
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-brand-purple rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Order Process and Merchant of Record",
      icon: <Building className="w-6 h-6 text-brand-blue" />,
      content: (
        <div className="bg-blue-50 border-l-4 border-brand-blue p-4 rounded-r-lg">
          <p className="text-gray-700 leading-relaxed mb-4">
            Our order process is conducted by our online reseller <strong>Paddle.com</strong>. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            This means that when you purchase a subscription, your contract for the purchase, payment, invoicing and taxes is with Paddle, while the Vointy.life service itself is provided by Wellthyforce Oy under these Terms.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Payment, billing, tax, cancellation and refund mechanics are additionally governed by{' '}
            <a href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
              Paddle's Buyer Terms
            </a>. You can manage your subscription, payment method and invoices, and request a refund, via Paddle at{' '}
            <a href="https://paddle.net" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">paddle.net</a>{' '}
            or by contacting{' '}
            <a href="mailto:contact@vointy.life" className="text-brand-blue hover:underline">contact@vointy.life</a>.
          </p>
        </div>
      )
    },
    {
      id: 8,
      title: "Refunds",
      icon: <Info className="w-6 h-6 text-brand-purple" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We offer a <strong>30-day money-back guarantee</strong> on paid subscriptions. If you are not satisfied, you can request a full refund of your subscription payment within 30 days of the order date.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Refunds are processed by our payment provider and Merchant of Record, Paddle. Full details are described in our{' '}
            <a href="/refund-policy" className="text-brand-blue hover:underline">Refund Policy</a>.
          </p>
        </div>
      )
    },
    {

      id: 9,
      title: "Accounts",
      icon: <Lock className="w-6 h-6 text-brand-blue" />,
      content: (
        <div className="grid gap-3">
          {[
            "You are responsible for safeguarding your login credentials.",
            "You agree to provide accurate and current information.",
            "You must notify us immediately of any unauthorized use of your account."
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-brand-blue rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 10,
      title: "License to Use",
      icon: <Scale className="w-6 h-6 text-brand-purple" />,
      content: (
        <div className="bg-purple-50 border-l-4 border-brand-purple p-4 rounded-r-lg">
          <p className="text-gray-700 leading-relaxed">
            We grant you a <strong>non-transferable, limited, non-exclusive license</strong> to use Vointy.life in accordance with these Terms for your organization's wellbeing activities.
          </p>
        </div>
      )
    },
    {
      id: 11,
      title: "User Responsibilities",
      icon: <Users className="w-6 h-6 text-brand-blue" />,
      content: (
        <div className="grid gap-3">
          {[
            "Provide accurate and complete information.",
            "Maintain the confidentiality of your account credentials.",
            "Use the platform in compliance with applicable laws.",
            "Respect other users and maintain professional conduct.",
            "Choose activities responsibly and assess your own ability and safety before participating."
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-brand-blue rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 12,
      title: "Prohibited Conduct",
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">You agree not to:</p>
          <div className="grid gap-3">
            {[
              "Share harmful, illegal, or offensive content.",
              "Use the service to harass, discriminate against, or harm others.",
              "Reverse engineer, hack, or attempt to gain unauthorized access to the platform.",
              "Use the service for any commercial purpose without our written consent.",
              "Submit false, misleading, or impersonating information.",
              "Violate any applicable local, national, or international law or regulation."
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-200">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 13,
      title: "Data & Privacy",
      icon: <Lock className="w-6 h-6 text-brand-purple" />,
      content: (
        <div className="bg-purple-50 border-l-4 border-brand-purple p-4 rounded-r-lg">
          <p className="text-gray-700 leading-relaxed">
            Your data is processed according to our <strong>Privacy Policy</strong>. We are committed to protecting your personal information and comply with applicable data protection laws, including the EU General Data Protection Regulation.
          </p>
        </div>
      )
    },
    {
      id: 14,
      title: "Intellectual Property",
      icon: <Shield className="w-6 h-6 text-brand-blue" />,
      content: (
        <p className="text-gray-700 leading-relaxed">
          The service and its original content, features, and functionality are and will remain the exclusive property of Wellthyforce Oy and its licensors. The service is protected by copyright, trademark, and other applicable laws.
        </p>
      )
    },
    {
      id: 15,
      title: "Availability and Changes",
      icon: <Clock className="w-6 h-6 text-brand-purple" />,
      content: (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <p className="text-gray-700 leading-relaxed">
            We strive to keep the service available but do not guarantee uninterrupted or error-free access. We may update, modify, or discontinue features at any time. We may also update these Terms from time to time; continued use of the service after changes constitutes acceptance of the revised Terms.
          </p>
        </div>
      )
    },
    {
      id: 16,
      title: "Limitation of Liability",
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      content: (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
          <p className="text-gray-700 leading-relaxed mb-4">
            To the fullest extent permitted by law, Wellthyforce Oy shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation loss of profits, data, use, goodwill, or other intangible losses.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Because Vointy.life is an information service and not a healthcare service, Wellthyforce Oy is not responsible for any injury, health condition, or other consequence arising from activities performed by users.
          </p>
        </div>
      )
    },
    {
      id: 17,
      title: "Applicable Law",
      icon: <Scale className="w-6 h-6 text-brand-purple" />,
      content: (
        <div className="bg-purple-50 border-l-4 border-brand-purple p-4 rounded-r-lg">
          <p className="text-gray-700 leading-relaxed mb-4">
            These terms are governed by Finnish law. Disputes shall be resolved primarily by negotiation, and secondarily settled finally by arbitration under the Arbitration Rules of the Finland Chamber of Commerce.
          </p>
          <div className="grid gap-2">
            <p className="text-gray-700 leading-relaxed">
              (a) The arbitral tribunal consists of one member
            </p>
            <p className="text-gray-700 leading-relaxed">
              (b) The seat of arbitration is Helsinki, Finland
            </p>
            <p className="text-gray-700 leading-relaxed">
              (c) The language of the arbitration is English.
            </p>
          </div>
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
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
              Terms and conditions for using Vointy.life
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
                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            {section.title}
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="ml-16">
                      {section.content}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <Card className="bg-orange-50 border-orange-200 border-2">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Scale className="w-6 h-6 text-orange-600" />
                    <h3 className="text-xl font-bold text-orange-800">Termination</h3>
                  </div>
                  <p className="text-orange-700 text-sm leading-relaxed">
                    We may terminate or suspend your account immediately, without prior notice, for any reason including breach of these Terms. You may also close your account at any time by contacting us.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200 border-2">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Info className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-blue-800">Information Service</h3>
                  </div>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    Vointy.life is an information service only. It is not a healthcare service and does not provide health advice. Users are responsible for their own activities.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-12 bg-gradient-to-r from-brand-blue to-brand-purple text-white border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Questions About These Terms?</h3>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  If you have any questions about these Terms of Service, please contact us.
                </p>
                <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <Mail className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">Email</div>
                    <div className="text-white/80">contact@vointy.life</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <Building className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">Address</div>
                    <div className="text-white/80">Vasantie 43, 90310 Oulu, Finland</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfService;
