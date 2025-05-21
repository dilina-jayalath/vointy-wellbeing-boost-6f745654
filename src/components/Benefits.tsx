
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      title: "Reduce Absenteeism",
      description: "Companies using Vointy report up to 32% reduction in sick days as employees adopt healthier lifestyles through social engagement.",
      stats: "32% fewer sick days"
    },
    {
      title: "Boost Social Engagement",
      description: "Create a vibrant social wellness community where employees connect, support each other, and build healthier habits together.",
      stats: "78% daily platform engagement"
    },
    {
      title: "Improve Team Morale",
      description: "Foster a more positive workplace culture through social features that build community and shared wellness goals.",
      stats: "41% higher team satisfaction"
    },
    {
      title: "Enhance Productivity",
      description: "More energized, healthier employees with fewer sick days contribute to measurably improved workplace productivity.",
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
          Beyond improved employee wellbeing, Vointy delivers measurable outcomes that reduce sick leaves and boost social engagement.
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
            <h3 className="text-2xl md:text-3xl font-bold">The Vointy Social Wellness Approach</h3>
            <p className="text-gray-600 mt-2">Creating healthier teams through social connection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Social Platform Launch",
                description: "Deploy your branded social wellness platform with customized challenges and content."
              },
              {
                step: "2",
                title: "Community Building",
                description: "Employees connect, share achievements, and support each other's wellness journeys."
              },
              {
                step: "3",
                title: "Measure Sick Leave Impact",
                description: "Track absence reduction and wellness metrics through our comprehensive dashboard."
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
