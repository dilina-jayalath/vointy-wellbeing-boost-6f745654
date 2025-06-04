
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Users, Target, Award, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-brand-purple to-brand-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              About Vointy.io
            </h1>
            <p className="text-xl opacity-90 mb-8">
              We're on a mission to transform workplace wellbeing through social engagement and data-driven insights.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold font-display mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-6">
                  At Vointy.io, we believe that healthy, engaged employees are the foundation of successful organizations. 
                  Our social wellness platform helps companies reduce sick leaves by up to 32% while fostering a culture 
                  of connection and wellbeing.
                </p>
                <p className="text-lg text-gray-600">
                  We combine cutting-edge technology with human-centered design to create solutions that make workplace 
                  wellness accessible, engaging, and effective for teams of all sizes.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <Users className="h-12 w-12 text-brand-purple mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-brand-purple">500+</h3>
                  <p className="text-gray-600">Companies Served</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <Target className="h-12 w-12 text-brand-blue mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-brand-blue">32%</h3>
                  <p className="text-gray-600">Sick Leave Reduction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-display text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Heart className="h-16 w-16 text-brand-purple mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">Wellbeing First</h3>
                <p className="text-gray-600">
                  We put employee wellbeing at the center of everything we do, believing that healthy teams create successful businesses.
                </p>
              </div>
              <div className="text-center">
                <Users className="h-16 w-16 text-brand-blue mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">Social Connection</h3>
                <p className="text-gray-600">
                  We foster meaningful connections between colleagues, creating supportive communities within organizations.
                </p>
              </div>
              <div className="text-center">
                <Award className="h-16 w-16 text-brand-purple mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">Data-Driven Results</h3>
                <p className="text-gray-600">
                  We use analytics and insights to measure impact and continuously improve our platform's effectiveness.
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

export default About;
