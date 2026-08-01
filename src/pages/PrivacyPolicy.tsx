import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Eye, UserCheck, Globe, Clock, Phone, Mail, Building, FileText, Users, Stethoscope } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      id: 1,
      title: "Data Controller",
      icon: <Building className="w-6 h-6 text-brand-purple" />,
      content: (
        <div>
          <div className="bg-brand-purple-light p-6 rounded-lg">
            <h3 className="font-bold text-brand-purple text-lg mb-4">Wellthyforce Oy</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Building className="w-5 h-5 text-brand-purple mt-1 flex-shrink-0" />
                <div>
                  <span className="font-medium text-brand-purple">Address:</span>
                  <p className="text-gray-700">Vasantie 43, 90310 Oulu, Finland</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-brand-purple flex-shrink-0" />
                <span className="font-medium text-brand-purple">Business ID:</span>
                <span className="text-gray-700">3254418-4</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-purple flex-shrink-0" />
                <span className="font-medium text-brand-purple">Email:</span>
                <a href="mailto:contact@vointy.life" className="text-gray-700 hover:text-brand-purple hover:underline">contact@vointy.life</a>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Contact Person Responsible for the Register",
      icon: <UserCheck className="w-6 h-6 text-brand-blue" />,
      content: (
        <div className="bg-brand-blue-light p-6 rounded-lg">
          <h3 className="font-bold text-brand-blue text-lg mb-4">Paavo Vasala</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-brand-blue flex-shrink-0" />
              <span className="font-medium text-brand-blue">Email:</span>
              <a href="mailto:contact@vointy.life" className="text-gray-700 hover:text-brand-blue hover:underline">contact@vointy.life</a>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Name of the Register",
      icon: <FileText className="w-6 h-6 text-brand-purple" />,
      content: (
        <div className="bg-purple-50 border-l-4 border-brand-purple p-4 rounded-r-lg">
          <p className="text-gray-700 font-medium">
            Wellthyforce Oy's customer, user, and marketing register
          </p>
        </div>
      )
    },
    {
      id: 4,
      title: "Legal Basis and Purpose of Processing Personal Data",
      icon: <Shield className="w-6 h-6 text-brand-blue" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            The legal basis for processing personal data under the EU General Data Protection Regulation is:
          </p>
          <div className="grid gap-3 mb-6">
            {[
              "The person's consent",
              "A contract to which the data subject is a party",
              "Legal obligation of the controller",
              "Legitimate interest of the controller"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-brand-blue rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Purpose of Processing:</h4>
            <p className="text-gray-700">
              The purpose of processing personal data is to provide and maintain the Vointy.life service, communicate with customers and users, manage customer relationships, process subscriptions and payments, and carry out marketing where permitted by law.
            </p>
          </div>
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
            <p className="text-green-800">
              <strong>Note:</strong> The data is not used for automated decision-making or profiling.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Data Content of the Register",
      icon: <Eye className="w-6 h-6 text-brand-purple" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            The information stored in the register includes:
          </p>
          <div className="grid gap-3 mb-4">
            {[
              "Person's name, position, company/organization",
              "Contact information (telephone number, email address, address)",
              "User account information such as username and activity data",
              "IP address of the network connection",
              "Information about ordered services and their changes",
              "Billing information",
              "Other information related to customer relationship and ordered services"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-brand-purple rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 border-l-4 border-brand-blue p-4 rounded-r-lg">
            <p className="text-gray-700">
              <strong>IP addresses and cookies:</strong> Website visitors' IP addresses and cookies necessary for service operation are processed based on legitimate interest, including for data security and statistical purposes. Separate consent is requested for third-party cookies when necessary.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Regular Sources of Information",
      icon: <Users className="w-6 h-6 text-brand-blue" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Information stored in the register is obtained from:
          </p>
          <div className="grid gap-3 mb-4">
            {[
              "Customer and user communications (web forms, email, telephone, social media)",
              "Website analysis tools",
              "Contracts and customer meetings",
              "Other customer and user interaction situations"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-brand-blue rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              Contact information for companies may also be collected from public sources such as websites, directory services, and other companies.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Regular Data Transfers and Transfers Outside EU/EEA",
      icon: <Globe className="w-6 h-6 text-brand-purple" />,
      content: (
        <div>
          <div className="grid gap-4">
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
              <p className="text-green-800">
                <strong>Information is not routinely disclosed to other parties.</strong> Information may be published only to the extent agreed with the customer.
              </p>
            </div>
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
              <p className="text-orange-800">
                Data may be transferred by the controller outside the EU or EEA only when adequate safeguards, such as standard contractual clauses approved by the European Commission, are in place. <strong>Data will not be transferred to the United States without express consent of the data subjects.</strong>
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "Principles of Register Protection",
      icon: <Lock className="w-6 h-6 text-brand-blue" />,
      content: (
        <div>
          <div className="grid gap-3">
            {[
              "Register handled with care and appropriate protection of data in information systems",
              "Physical and digital security of Internet servers appropriately ensured",
              "Data, access rights, and security-critical information handled confidentially",
              "Access limited to employees and subcontractors whose job description requires it"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Lock className="w-4 h-4 text-brand-blue mt-1 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: "Right to Inspect and Request Correction",
      icon: <Eye className="w-6 h-6 text-brand-purple" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Every person in the register has the right to:
          </p>
          <div className="grid gap-3 mb-4">
            {[
              "Check their data stored in the register",
              "Demand correction of incorrect data",
              "Request completion of incomplete data"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-brand-purple rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <div className="bg-brand-purple-light p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>Process:</strong> Requests must be sent in writing to the controller. Identity verification may be required. Response within EU Data Protection Regulation timeframe (generally within one month).
            </p>
          </div>
        </div>
      )
    },
    {
      id: 10,
      title: "Other Rights Related to Processing Personal Data",
      icon: <UserCheck className="w-6 h-6 text-brand-blue" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Persons in the register have additional rights under EU GDPR:
          </p>
          <div className="grid gap-3 mb-4">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <h4 className="font-semibold text-red-800 mb-2">Right to be Forgotten</h4>
              <p className="text-red-700">Request deletion of personal data from the register</p>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Processing Restrictions</h4>
              <p className="text-yellow-700">Restrict processing of personal data in certain situations</p>
            </div>
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
              <h4 className="font-semibold text-green-800 mb-2">Right to Object</h4>
              <p className="text-green-700">Object to direct marketing and processing based on legitimate interest</p>
            </div>
          </div>
          <div className="bg-brand-blue-light p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>Request Process:</strong> All requests must be sent in writing to the controller. Identity verification may be required. Response within EU Data Protection Regulation timeframe (generally within one month).
            </p>
          </div>
        </div>
      )
    },
    {
      id: 11,
      title: "Health and Medical Data",
      icon: <Stethoscope className="w-6 h-6 text-red-500" />,
      content: (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Vointy.life does not process health or medical data.</strong> The platform is an information service and does not provide healthcare, medical advice, diagnoses, or treatments.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Activity data collected through the service (such as completed activities or participation in challenges) is used solely for informational and engagement purposes within the platform. Users are responsible for assessing their own health and ability before participating in any activity.
          </p>
        </div>
      )
    },
    {
      id: 12,
      title: "Cookies and Analytics",
      icon: <Clock className="w-6 h-6 text-brand-purple" />,
      content: (
        <div className="bg-purple-50 border-l-4 border-brand-purple p-4 rounded-r-lg">
          <p className="text-gray-700 leading-relaxed">
            Vointy.life uses cookies and similar technologies that are necessary for the operation of the service, as well as analytics tools to understand how the service is used. For non-essential cookies, we will request your consent where required by applicable law. You can manage your cookie preferences through your browser settings.
          </p>
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
              Wellthyforce Oy's Privacy Statement for Vointy.life (GDPR Compliant)
            </p>
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-white/90 text-sm">
                  <strong>Prepared:</strong> 14.04.2022
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-white/90 text-sm">
                  <strong>Last Modified:</strong> {new Date().toLocaleDateString()}
                </p>
              </div>
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

            <Card className="mt-12 bg-gradient-to-r from-brand-purple to-brand-blue text-white border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Questions About This Policy?</h3>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  If you have questions about this Privacy Policy or wish to exercise your data protection rights, please contact us.
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

export default PrivacyPolicy;
