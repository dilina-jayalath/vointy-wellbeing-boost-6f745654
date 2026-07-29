
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-brand-purple to-brand-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              Contact Us
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Get in touch with our team. We're here to help you transform your workplace wellness.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold font-display mb-8">Let's Start a Conversation</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Ready to see Vointy in action? We're here to answer your questions and show you 
                  how our platform can reduce sick leaves and boost employee wellness at your company.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-brand-purple/10 rounded-lg flex items-center justify-center mr-4">
                      <Mail className="h-6 w-6 text-brand-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email Us</h3>
                      <p className="text-gray-600">hello@vointy.life</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center mr-4">
                      <Phone className="h-6 w-6 text-brand-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Call Us</h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-brand-purple/10 rounded-lg flex items-center justify-center mr-4">
                      <MapPin className="h-6 w-6 text-brand-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Visit Us</h3>
                      <p className="text-gray-600">123 Wellness Street<br />San Francisco, CA 94105</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center mr-4">
                      <Clock className="h-6 w-6 text-brand-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Business Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                    </div>
                  </div>
                </div>

                <Link to="/contact-form">
                  <Button className="btn-primary">
                    Request a Demo
                  </Button>
                </Link>
              </div>
              
              {/* Additional Information Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Why Choose Vointy?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Proven Results</h3>
                    <p className="text-gray-600">Companies using Vointy see an average 30% reduction in sick leaves within the first 6 months.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Easy Implementation</h3>
                    <p className="text-gray-600">Get started in just 24 hours with our simple onboarding process and dedicated support team.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Personalized Support</h3>
                    <p className="text-gray-600">Our wellness experts work with you to create a customized program that fits your company culture.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Data-Driven Insights</h3>
                    <p className="text-gray-600">Track progress with comprehensive analytics and reporting to measure your wellness program's impact.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
