
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      title: "Reduce Absenteeism",
      description: "Companies using Vointy report up to 32% reduction in sick days as employees adopt healthier lifestyles.",
      stats: "32% fewer sick days"
    },
    {
      title: "Increase Retention",
      description: "Improve employee retention by creating a workplace culture that values wellbeing and connection.",
      stats: "27% improved retention"
    },
    {
      title: "Boost Engagement",
      description: "Foster a more engaged workforce through social features that build community and shared purpose.",
      stats: "41% higher engagement"
    },
    {
      title: "Enhance Productivity",
      description: "More energized, healthier employees contribute to measurably improved workplace productivity.",
      stats: "23% productivity boost"
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-gradient-to-br from-white to-brand-blue-light/30">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">
          Business <span className="gradient-text">Benefits</span>
        </h2>
        <p className="section-subtitle text-center">
          Beyond improved employee wellbeing, Vointy delivers measurable business outcomes that impact your bottom line.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="overflow-hidden border-0 shadow-lg card-shadow">
              <div className="h-2 bg-brand-purple"></div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600 mb-4">{benefit.description}</p>
                <div className="bg-brand-purple-light/30 p-3 rounded-lg flex items-center">
                  <CheckCircle className="h-5 w-5 text-brand-purple mr-2" />
                  <span className="text-brand-purple-dark font-medium">{benefit.stats}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 bg-white rounded-xl p-8 shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold">How Vointy Works</h3>
            <p className="text-gray-600 mt-2">Simple implementation, powerful results</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Customize & Launch",
                description: "We'll help you set up Vointy with your branding and culture in mind."
              },
              {
                step: "2",
                title: "Employee Adoption",
                description: "Our proven onboarding process ensures high adoption rates from day one."
              },
              {
                step: "3",
                title: "Measure & Optimize",
                description: "Track results and refine your wellness strategy based on real data."
              }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-center text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
