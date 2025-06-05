
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
                <h2 className="text-2xl font-bold mb-4">2. Eligibility</h2>
                <p className="text-gray-600">
                  You must be at least 18 years old and authorized by your employer or organization to use Vointy.io.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. Service Description</h2>
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
                <h2 className="text-2xl font-bold mb-4">4. Accounts</h2>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>You are responsible for safeguarding your login credentials</li>
                  <li>You agree to provide accurate, current information</li>
                  <li>You must notify us immediately of any unauthorized use of your account</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. License to Use</h2>
                <p className="text-gray-600">
                  We grant you a non-transferable, limited license to use Vointy.io in accordance with these Terms for your organization's wellness programs.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. User Responsibilities</h2>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Use the platform in compliance with applicable laws</li>
                  <li>Respect other users and maintain professional conduct</li>
                  <li>Not share personal health information of others without consent</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. Prohibited Conduct</h2>
                <p className="text-gray-600 mb-4">You agree not to:</p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Share harmful, illegal, or offensive content</li>
                  <li>Use the service to harass others</li>
                  <li>Reverse engineer or hack the platform</li>
                  <li>Use it for any commercial purpose without consent</li>
                  <li>Violate any international, federal, provincial, or state regulations</li>
                  <li>Submit false or misleading information</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Data & Privacy</h2>
                <p className="text-gray-600">
                  Your data is processed according to our Privacy Policy. We are committed to protecting your personal information and comply with applicable data protection laws.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">9. Intellectual Property</h2>
                <p className="text-gray-600">
                  The service and its original content, features, and functionality are and will remain the exclusive property of Vointy.io and its licensors. The service is protected by copyright, trademark, and other laws.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">10. Availability</h2>
                <p className="text-gray-600">
                  We strive to keep the service available but do not guarantee uninterrupted or error-free access. We may perform maintenance or updates that temporarily affect service availability.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">11. Limitation of Liability</h2>
                <p className="text-gray-600">
                  In no event shall Vointy.io, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">12. Termination</h2>
                <p className="text-gray-600">
                  We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">13. Changes to Terms</h2>
                <p className="text-gray-600">
                  We reserve the right, at our sole discretion, to modify or replace these terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">14. Contact Information</h2>
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
