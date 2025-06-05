
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-24 pb-16 bg-gradient-to-br from-brand-purple to-brand-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl opacity-90 mb-8">
              How we use cookies and similar technologies
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
                <h2 className="text-2xl font-bold mb-4">1. What Are Cookies</h2>
                <p className="text-gray-600">
                  Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide information to website owners about user behavior.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. How We Use Cookies</h2>
                <p className="text-gray-600 mb-4">
                  We use cookies to enhance your experience on our platform and to help us understand how our service is being used. Specifically, we use cookies to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Keep you signed in to your account</li>
                  <li>Remember your preferences and settings</li>
                  <li>Analyze how our platform is used to improve our services</li>
                  <li>Provide personalized wellness recommendations</li>
                  <li>Ensure platform security and prevent fraud</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. Types of Cookies We Use</h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Essential Cookies</h3>
                  <p className="text-gray-600">
                    These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and authentication. The website cannot function properly without these cookies.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Performance Cookies</h3>
                  <p className="text-gray-600">
                    These cookies collect information about how visitors use our website, such as which pages are visited most often and if users receive error messages. This helps us improve how our website works.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Functionality Cookies</h3>
                  <p className="text-gray-600">
                    These cookies allow our website to remember choices you make (such as your username, language preferences, or wellness goals) and provide enhanced, more personal features.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Analytics Cookies</h3>
                  <p className="text-gray-600">
                    We use analytics cookies to understand how users interact with our platform. This information helps us improve our services and user experience. These cookies are anonymized and do not identify individual users.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Third-Party Cookies</h2>
                <p className="text-gray-600 mb-4">
                  We may use third-party services that place cookies on your device. These services help us:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Analyze website traffic and user behavior (Google Analytics)</li>
                  <li>Provide customer support and live chat functionality</li>
                  <li>Deliver targeted wellness content and recommendations</li>
                  <li>Integrate with social media platforms for sharing wellness achievements</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Managing Your Cookie Preferences</h2>
                <p className="text-gray-600 mb-4">
                  You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Using our cookie preference center (when available)</li>
                  <li>Setting your browser to refuse all or some browser cookies</li>
                  <li>Deleting cookies that have already been set</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Please note that if you choose to reject cookies, you may not be able to use the full functionality of our website.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. Browser Settings</h2>
                <p className="text-gray-600 mb-4">
                  Most web browsers allow you to control cookies through their settings preferences. To find out more about cookies, including how to see what cookies have been set, visit:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Chrome: Settings > Privacy and security > Cookies and other site data</li>
                  <li>Firefox: Settings > Privacy & Security > Cookies and Site Data</li>
                  <li>Safari: Preferences > Privacy > Manage Website Data</li>
                  <li>Edge: Settings > Cookies and site permissions</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. Updates to This Policy</h2>
                <p className="text-gray-600">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new policy on this page.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
                <p className="text-gray-600">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
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

export default CookiePolicy;
