
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Shield, Users, Lock, AlertTriangle, Scale, Clock, Mail, Phone } from 'lucide-react';

const TermsOfService = () => {
  const sections = [
    {
      id: 1,
      title: "Acceptance of Terms",
      icon: <FileText className="w-6 h-6 text-brand-purple" />,
      content: (
        <p className="text-gray-700 leading-relaxed">
          By accessing and using Vointy.io's workplace wellness platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
        </p>
      )
    },
    {
      id: 2,
      title: "Eligibility",
      icon: <Users className="w-6 h-6 text-brand-blue" />,
      content: (
        <div className="bg-blue-50 border-l-4 border-brand-blue p-4 rounded-r-lg">
          <p className="text-gray-700 leading-relaxed">
            You must be at least <strong>18 years old</strong> and authorized by your employer or organization to use Vointy.io.
          </p>
        </div>
      )
    },
    {
      id: 3,
      title: "Service Description",
      icon: <Shield className="w-6 h-6 text-brand-purple" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Vointy.io provides a workplace wellness platform that helps organizations improve employee wellbeing through social engagement, wellness tracking, and data-driven insights.
          </p>
          <div className="grid gap-3">
            {[
              "Wellness program management and tracking",
              "Social engagement features for employees",
              "Analytics and reporting for employers",
              "Health and wellness content and resources"
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
      id: 4,
      title: "Accounts",
      icon: <Lock className="w-6 h-6 text-brand-blue" />,
      content: (
        <div className="grid gap-3">
          {[
            "You are responsible for safeguarding your login credentials",
            "You agree to provide accurate, current information",
            "You must notify us immediately of any unauthorized use of your account"
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
      title: "License to Use",
      icon: <Scale className="w-6 h-6 text-brand-purple" />,
      content: (
        <div className="bg-purple-50 border-l-4 border-brand-purple p-4 rounded-r-lg">
          <p className="text-gray-700 leading-relaxed">
            We grant you a <strong>non-transferable, limited license</strong> to use Vointy.io in accordance with these Terms for your organization's wellness programs.
          </p>
        </div>
      )
    },
    {
      id: 6,
      title: "User Responsibilities",
      icon: <Users className="w-6 h-6 text-brand-blue" />,
      content: (
        <div className="grid gap-3">
          {[
            "Provide accurate and complete information",
            "Maintain the confidentiality of your account credentials",
            "Use the platform in compliance with applicable laws",
            "Respect other users and maintain professional conduct",
            "Not share personal health information of others without consent"
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
      id: 7,
      title: "Prohibited Conduct",
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">You agree not to:</p>
          <div className="grid gap-3">
            {[
              "Share harmful, illegal, or offensive content",
              "Use the service to harass others",
              "Reverse engineer or hack the platform",
              "Use it for any commercial purpose without consent",
              "Violate any international, federal, provincial, or state regulations",
              "Submit false or misleading information"
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
      id: 8,
      title: "Data & Privacy",
      icon: <Lock className="w-6 h-6 text-brand-purple" />,
      content: (
        <div className="bg-purple-50 border-l-4 border-brand-purple p-4 rounded-r-lg">
          <p className="text-gray-700 leading-relaxed">
            Your data is processed according to our <strong>Privacy Policy</strong>. We are committed to protecting your personal information and comply with applicable data protection laws.
          </p>
        </div>
      )
    },
    {
      id: 9,
      title: "Intellectual Property",
      icon: <Shield className="w-6 h-6 text-brand-blue" />,
      content: (
        <p className="text-gray-700 leading-relaxed">
          The service and its original content, features, and functionality are and will remain the exclusive property of Vointy.io and its licensors. The service is protected by copyright, trademark, and other laws.
        </p>
      )
    },
    {
      id: 10,
      title: "Availability",
      icon: <Clock className="w-6 h-6 text-brand-purple" />,
      content: (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <p className="text-gray-700 leading-relaxed">
            We strive to keep the service available but do not guarantee uninterrupted or error-free access. We may perform maintenance or updates that temporarily affect service availability.
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
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
              Terms and conditions for using Vointy.io
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

            {/* Additional Important Sections */}
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <Card className="bg-red-50 border-red-200 border-2">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <h3 className="text-xl font-bold text-red-800">Limitation of Liability</h3>
                  </div>
                  <p className="text-red-700 text-sm leading-relaxed">
                    In no event shall Vointy.io be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 border-orange-200 border-2">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Scale className="w-6 h-6 text-orange-600" />
                    <h3 className="text-xl font-bold text-orange-800">Termination</h3>
                  </div>
                  <p className="text-orange-700 text-sm leading-relaxed">
                    We may terminate or suspend your account immediately, without prior notice, for any reason including breach of these Terms.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Section */}
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
                    <div className="text-white/80">legal@vointy.io</div>
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

export default TermsOfService;
