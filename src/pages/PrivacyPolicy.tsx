
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-24 pb-16 bg-gradient-to-br from-brand-purple to-brand-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl opacity-90 mb-8">
              How we collect, use, and protect your information (GDPR Compliant)
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
                <h2 className="text-2xl font-bold mb-4">1. Who We Are</h2>
                <p className="text-gray-600 mb-4">
                  Vointy.io is a corporate wellbeing platform that helps organizations improve employee wellness through social engagement and data-driven insights. You can contact our Data Protection Officer at:
                </p>
                <p className="text-gray-600">
                  📧 Email: privacy@vointy.io
                  <br />
                  📍 Address: [Company Address]
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. Data We Collect</h2>
                <p className="text-gray-600 mb-4">
                  We collect the following categories of personal data:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Identification Data: name, email address, phone number</li>
                  <li>Employment Information: company name, job title (if applicable)</li>
                  <li>Usage Data: device info, IP address, browser type, log files</li>
                  <li>Wellness Activity Data: participation in challenges, feedback, interactions within the app</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. Legal Basis for Processing</h2>
                <p className="text-gray-600 mb-4">
                  We process personal data under the following legal grounds:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li><strong>Contractual Necessity:</strong> To provide our services</li>
                  <li><strong>Legitimate Interests:</strong> To improve our services and ensure platform security</li>
                  <li><strong>Consent:</strong> For optional features and marketing</li>
                  <li><strong>Legal Obligation:</strong> To comply with applicable laws</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. How We Use Your Data</h2>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>To provide access to the Vointy.io platform</li>
                  <li>To analyze usage and improve performance</li>
                  <li>To personalize user experiences</li>
                  <li>To send important service updates</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Sharing Your Data</h2>
                <p className="text-gray-600 mb-4">
                  We only share your data with:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Authorized service providers (e.g., hosting, analytics, payment processors)</li>
                  <li>Legal authorities, when required by law</li>
                  <li>Your employer (only anonymized or aggregated usage data)</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  We <strong>do not sell</strong> your personal data.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. International Data Transfers</h2>
                <p className="text-gray-600">
                  If we transfer data outside the EU/EEA, we use appropriate safeguards such as Standard Contractual Clauses to ensure your data remains protected.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
                <p className="text-gray-600">
                  We retain personal data only for as long as necessary for service provision, legitimate business needs, and as required by legal or regulatory obligations.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Your Rights (Under GDPR)</h2>
                <p className="text-gray-600 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Access your data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion (right to be forgotten)</li>
                  <li>Restrict or object to processing</li>
                  <li>Data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  To exercise your rights, email us at: <strong>privacy@vointy.io</strong>
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">9. Cookies</h2>
                <p className="text-gray-600">
                  We use cookies to enhance functionality and measure engagement. See our Cookie Policy for more information.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">10. Contacting Supervisory Authority</h2>
                <p className="text-gray-600">
                  If you believe we have violated your rights, you have the right to lodge a complaint with your local data protection authority.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
                <p className="text-gray-600">
                  If you have questions about this Privacy Policy, please contact us at:
                  <br />
                  Email: privacy@vointy.io
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

export default PrivacyPolicy;
