
import React from 'react';
import { Heart, Users, Calendar, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Features = () => {
  const features = [
    {
      icon: <Heart className="w-10 h-10 text-brand-purple" />,
      title: "Wellness Challenges",
      description: "Create and participate in team wellness challenges that promote healthy habits and foster a social community."
    },
    {
      icon: <Users className="w-10 h-10 text-brand-purple" />,
      title: "Social Feed",
      description: "Share achievements, offer support, and celebrate wellness milestones on our engaging social media-style platform."
    },
    {
      icon: <Calendar className="w-10 h-10 text-brand-purple" />,
      title: "Wellness Events",
      description: "Schedule and track participation in company wellness events, from meditation to fitness classes."
    },
    {
      icon: <MessageSquare className="w-10 h-10 text-brand-purple" />,
      title: "Community Support",
      description: "Connect employees with wellness coaches and peers through comments, likes, and direct messaging."
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-white to-brand-purple-light/30">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">
          A Social Platform Employees Will <span className="gradient-text">Love</span>
        </h2>
        <p className="section-subtitle text-center">
          Vointy combines social media engagement with wellness initiatives to create a platform employees actively want to use daily.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 border border-gray-200 rounded-xl hover:border-brand-purple/30 transition-all card-shadow">
              <div className="mb-5">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-xl p-8 border border-gray-100 shadow-lg">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Track Health Metrics & Reduce Absences</h3>
              <p className="text-gray-600 mb-6">
                Get insightful analytics on engagement, wellbeing scores, and absence metrics. Identify trends and measure how your wellness programs directly impact sick leave reduction.
              </p>
              <ul className="space-y-3">
                {["32% average reduction in sick days", "Social engagement analytics", "Wellness score improvements", "Health challenge completion rates"].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-5 h-5 rounded-full bg-brand-purple-light flex items-center justify-center mr-3">
                      <span className="w-2 h-2 rounded-full bg-brand-purple"></span>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="bg-white rounded-xl overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop" 
                    alt="Analytics dashboard showing sick leave reduction" 
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
