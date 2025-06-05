
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Eye, UserCheck, Globe, Clock, Phone, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      id: 1,
      title: "Who We Are",
      icon: <UserCheck className="w-6 h-6 text-brand-purple" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Vointy.io is a corporate wellbeing platform that helps organizations improve employee wellness through social engagement and data-driven insights. You can contact our Data Protection Officer at:
          </p>
          <div className="bg-brand-purple-light p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-brand-purple" />
              <span className="font-medium text-brand-purple">Email:</span>
              <span className="text-gray-700">privacy@vointy.io</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-purple" />
              <span className="font-medium text-brand-purple">Address:</span>
              <span className="text-gray-700">[Company Address]</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Data We Collect",
      icon: <Eye className="w-6 h-6 text-brand-blue" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We collect the following categories of personal data:
          </p>
          <div className="grid gap-3">
            {[
              "Identification Data: name, email address, phone number",
              "Employment Information: company name, job title (if applicable)",
              "Usage Data: device info, IP address, browser type, log files",
              "Wellness Activity Data: participation in challenges, feedback, interactions within the app"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-brand-blue rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Legal Basis for Processing",
      icon: <Shield className="w-6 h-6 text-brand-purple" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We process personal data under the following legal grounds:
          </p>
          <div className="grid gap-3">
            {[
              { title: "Contractual Necessity", desc: "To provide our services" },
              { title: "Legitimate Interests", desc: "To improve our services and ensure platform security" },
              { title: "Consent", desc: "For optional features and marketing" },
              { title: "Legal Obligation", desc: "To comply with applicable laws" }
            ].map((item, index) => (
              <div key={index} className="p-4 border-l-4 border-brand-purple bg-gray-50 rounded-r-lg">
                <div className="font-semibold text-brand-purple mb-1">{item.title}:</div>
                <div className="text-gray-700">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "How We Use Your Data",
      icon: <Lock className="w-6 h-6 text-brand-blue" />,
      content: (
        <div className="grid gap-3">
          {[
            "To provide access to the Vointy.io platform",
            "To analyze usage and improve performance",
            "To personalize user experiences",
            "To send important service updates",
            "To comply with legal obligations"
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-brand-blue rounded-full flex-shrink-0"></div>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 5,
      title: "Sharing Your Data",
      icon: <Globe className="w-6 h-6 text-brand-purple" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We only share your data with:
          </p>
          <div className="grid gap-3 mb-4">
            {[
              "Authorized service providers (e.g., hosting, analytics, payment processors)",
              "Legal authorities, when required by law",
              "Your employer (only anonymized or aggregated usage data)"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-brand-purple rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
            <p className="text-green-800 font-medium">
              We <strong>do not sell</strong> your personal data.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "International Data Transfers",
      icon: <Globe className="w-6 h-6 text-brand-blue" />,
      content: (
        <p className="text-gray-700 leading-relaxed">
          If we transfer data outside the EU/EEA, we use appropriate safeguards such as Standard Contractual Clauses to ensure your data remains protected.
        </p>
      )
    },
    {
      id: 7,
      title: "Data Retention",
      icon: <Clock className="w-6 h-6 text-brand-purple" />,
      content: (
        <p className="text-gray-700 leading-relaxed">
          We retain personal data only for as long as necessary for service provision, legitimate business needs, and as required by legal or regulatory obligations.
        </p>
      )
    },
    {
      id: 8,
      title: "Your Rights (Under GDPR)",
      icon: <UserCheck className="w-6 h-6 text-brand-blue" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            You have the right to:
          </p>
          <div className="grid md:grid-cols-2 gap-3 mb-4">
            {[
              "Access your data",
              "Correct inaccurate data",
              "Request deletion (right to be forgotten)",
              "Restrict or object to processing",
              "Data portability",
              "Withdraw consent at any time"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-brand-blue rounded-full flex-shrink-0"></div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <div className="bg-brand-blue-light p-4 rounded-lg">
            <p className="text-gray-700">
              To exercise your rights, email us at: <strong className="text-brand-blue">privacy@vointy.io</strong>
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="pt-24 pb-16 bg-gradient-to-br from-brand-purple to-brand-blue text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
              How we collect, use, and protect your information (GDPR Compliant)
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
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-brand-purple text-white text-sm font-bold rounded-full">
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

            {/* Contact Section */}
            <Card className="mt-12 bg-gradient-to-r from-brand-purple to-brand-blue text-white border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Questions About This Policy?</h3>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  If you have questions about this Privacy Policy, please don't hesitate to contact us.
                </p>
                <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <Mail className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">Email</div>
                    <div className="text-white/80">privacy@vointy.io</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <Phone className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">Address</div>
                    <div className="text-white/80">[Your Company Address]</div>
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

export default PrivacyPolicy;
