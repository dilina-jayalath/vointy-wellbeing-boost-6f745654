
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-24 pb-16 bg-gradient-to-br from-brand-purple to-brand-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              Terms of Service
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Terms and conditions for using Vointy.io
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <p className="text-gray-600 mb-8">
              <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600">
                  By accessing and using Vointy.io's workplace wellness platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. Service Description</h2>
                <p className="text-gray-600 mb-4">
                  Vointy.io provides a workplace wellness platform that helps organizations improve employee wellbeing through social engagement, wellness tracking, and data-driven insights.
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Wellness program management and tracking</li>
                  <li>Social engagement features for employees</li>
                  <li>Analytics and reporting for employers</li>
                  <li>Health and wellness content and resources</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. User Responsibilities</h2>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Use the platform in compliance with applicable laws</li>
                  <li>Respect other users and maintain professional conduct</li>
                  <li>Not share personal health information of others without consent</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Prohibited Uses</h2>
                <p className="text-gray-600 mb-4">You may not use our service:</p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
                <p className="text-gray-600">
                  The service and its original content, features, and functionality are and will remain the exclusive property of Vointy.io and its licensors. The service is protected by copyright, trademark, and other laws.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
                <p className="text-gray-600">
                  In no event shall Vointy.io, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. Termination</h2>
                <p className="text-gray-600">
                  We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Changes to Terms</h2>
                <p className="text-gray-600">
                  We reserve the right, at our sole discretion, to modify or replace these terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">9. Contact Information</h2>
                <p className="text-gray-600">
                  If you have any questions about these Terms of Service, please contact us at:
                  <br />
                  Email: legal@vointy.io
                  <br />
                  Address: [Your Company Address]
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfService;
