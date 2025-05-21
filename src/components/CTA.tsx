
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto gradient-bg rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-8 md:p-12 lg:p-16 text-white">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6 text-center">
              Ready to Transform Your Workplace Wellbeing?
            </h2>
            <p className="text-xl opacity-90 text-center max-w-3xl mx-auto mb-8">
              Join hundreds of forward-thinking companies that use Vointy's social wellness platform to reduce sick leaves and create healthier, happier teams.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Button className="bg-white text-brand-purple hover:bg-gray-100 transition-colors px-8 py-6 text-lg font-medium">
                Request Demo
              </Button>
              <Button className="bg-transparent border-2 border-white text-white hover:bg-white/10 transition-colors px-8 py-6 text-lg font-medium">
                View Pricing
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                "Reduce sick leaves by up to 32%", 
                "Social wellness platform", 
                "30-day satisfaction guarantee"
              ].map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-white/90" />
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
