
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Cookie, Settings, BarChart3, Zap, Users, Globe, Shield, Mail, Building } from 'lucide-react';

const CookiePolicy = () => {
  const sections = [
    {
      id: 1,
      title: "What Are Cookies",
      icon: <Cookie className="w-6 h-6 text-brand-purple" />,
      content: (
        <div className="bg-purple-50 border-l-4 border-brand-purple p-4 rounded-r-lg">
          <p className="text-gray-700 leading-relaxed">
            Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide information to website owners about user behavior.
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: "How We Use Cookies",
      icon: <Settings className="w-6 h-6 text-brand-blue" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We use cookies to enhance your experience on our platform and to help us understand how our service is being used. Specifically, we use cookies to:
          </p>
          <div className="grid gap-3">
            {[
              "Keep you signed in to your account",
              "Remember your preferences and settings",
              "Analyze how our platform is used to improve our services",
              "Provide personalized wellness recommendations",
              "Ensure platform security and prevent fraud"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-brand-blue rounded-full flex-shrink-0"></div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Types of Cookies We Use",
      icon: <BarChart3 className="w-6 h-6 text-brand-purple" />,
      content: (
        <div className="grid gap-6">
          {[
            {
              title: "Essential Cookies",
              icon: <Zap className="w-5 h-5 text-green-600" />,
              desc: "These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and authentication.",
              color: "green"
            },
            {
              title: "Performance Cookies",
              icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
              desc: "These cookies collect information about how visitors use our website, such as which pages are visited most often and if users receive error messages.",
              color: "blue"
            },
            {
              title: "Functionality Cookies",
              icon: <Settings className="w-5 h-5 text-purple-600" />,
              desc: "These cookies allow our website to remember choices you make and provide enhanced, more personal features.",
              color: "purple"
            },
            {
              title: "Analytics Cookies",
              icon: <BarChart3 className="w-5 h-5 text-orange-600" />,
              desc: "We use analytics cookies to understand how users interact with our platform. This information helps us improve our services and user experience.",
              color: "orange"
            }
          ].map((type, index) => (
            <div key={index} className={`p-4 bg-${type.color}-50 border-l-4 border-${type.color}-400 rounded-r-lg`}>
              <div className="flex items-center gap-3 mb-2">
                {type.icon}
                <h3 className="text-lg font-semibold text-gray-900">{type.title}</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{type.desc}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 4,
      title: "Third-Party Cookies",
      icon: <Users className="w-6 h-6 text-brand-blue" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We may use third-party services that place cookies on your device. These services help us:
          </p>
          <div className="grid gap-3">
            {[
              "Analyze website traffic and user behavior (Google Analytics)",
              "Provide customer support and live chat functionality",
              "Deliver targeted wellness content and recommendations",
              "Integrate with social media platforms for sharing wellness achievements"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Users className="w-4 h-4 text-brand-blue mt-1 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Managing Your Cookie Preferences",
      icon: <Shield className="w-6 h-6 text-brand-purple" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by:
          </p>
          <div className="grid gap-3 mb-4">
            {[
              "Using our cookie preference center (when available)",
              "Setting your browser to refuse all or some browser cookies",
              "Deleting cookies that have already been set"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-brand-purple rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <p className="text-yellow-800">
              <strong>Please note:</strong> If you choose to reject cookies, you may not be able to use the full functionality of our website.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Browser Settings",
      icon: <Globe className="w-6 h-6 text-brand-blue" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Most web browsers allow you to control cookies through their settings preferences. To find out more about cookies:
          </p>
          <div className="grid gap-3">
            {[
              { browser: "Chrome", path: "Settings > Privacy and security > Cookies and other site data" },
              { browser: "Firefox", path: "Settings > Privacy & Security > Cookies and Site Data" },
              { browser: "Safari", path: "Preferences > Privacy > Manage Website Data" },
              { browser: "Edge", path: "Settings > Cookies and site permissions" }
            ].map((item, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                <div className="font-medium text-gray-900 mb-1">{item.browser}:</div>
                <div className="text-gray-600 text-sm">{item.path}</div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Updates to This Policy",
      icon: <Settings className="w-6 h-6 text-brand-purple" />,
      content: (
        <div className="bg-purple-50 border-l-4 border-brand-purple p-4 rounded-r-lg">
          <p className="text-gray-700 leading-relaxed">
            We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new policy on this page.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="pt-24 pb-16 bg-gradient-to-br from-orange-500 to-brand-purple text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6">
              <Cookie className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
              How we use cookies and similar technologies
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
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-orange-500 text-white text-sm font-bold rounded-full">
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
            <Card className="mt-12 bg-gradient-to-r from-orange-500 to-brand-purple text-white border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Questions About Our Cookie Policy?</h3>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us.
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

export default CookiePolicy;
