
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
              How we collect, use, and protect your information
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
                <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                <p className="text-gray-600 mb-4">
                  We collect information you provide directly to us, such as when you create an account, participate in wellness activities, or contact us for support.
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Personal information (name, email address, phone number)</li>
                  <li>Health and wellness data (activity levels, wellness goals, participation metrics)</li>
                  <li>Usage information (how you interact with our platform)</li>
                  <li>Device information (IP address, browser type, operating system)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Provide and improve our workplace wellness services</li>
                  <li>Generate wellness insights and analytics for your organization</li>
                  <li>Send you notifications about wellness programs and activities</li>
                  <li>Respond to your questions and provide customer support</li>
                  <li>Ensure platform security and prevent fraud</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
                <p className="text-gray-600 mb-4">
                  We do not sell your personal information. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>With your employer (aggregated, anonymized wellness metrics only)</li>
                  <li>With service providers who assist in operating our platform</li>
                  <li>When required by law or to protect our rights</li>
                  <li>With your explicit consent</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                <p className="text-gray-600">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security assessments.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your personal data</li>
                  <li>Opt-out of certain communications</li>
                  <li>Data portability (receive your data in a structured format)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. Cookies and Tracking</h2>
                <p className="text-gray-600">
                  We use cookies and similar technologies to enhance your experience, analyze usage patterns, and improve our services. You can control cookie settings through your browser preferences.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
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
