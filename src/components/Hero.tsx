
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Hero = () => {
  return (
    <section className="pt-24 pb-20 md:pt-32 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-12 md:mb-0 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight mb-6">
              Boost Employee <span className="gradient-text">Wellbeing</span> and Increase Engagement
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Vointy helps companies improve workplace wellness, reduce sick leaves by up to 32%, and boost employee engagement through our social wellness platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-primary text-lg">Request Demo</Button>
              <Button className="btn-secondary text-lg">Learn More</Button>
            </div>
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center text-white text-xs">JD</div>
                <div className="w-10 h-10 rounded-full bg-green-400 border-2 border-white flex items-center justify-center text-white text-xs">MK</div>
                <div className="w-10 h-10 rounded-full bg-purple-400 border-2 border-white flex items-center justify-center text-white text-xs">AL</div>
              </div>
              <p className="ml-4 text-sm text-gray-600">Trusted by 200+ forward-thinking companies</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 animate-scale-in">
            <div className="relative">
              <div className="absolute -z-10 w-72 h-72 bg-brand-purple-light rounded-full -top-10 -right-10 blur-3xl opacity-60"></div>
              <div className="absolute -z-10 w-72 h-72 bg-brand-blue-light rounded-full -bottom-10 -left-10 blur-3xl opacity-60"></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg transform rotate-1">
                  <img 
                    src="https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=400&h=300&fit=crop" 
                    alt="Office worker doing desk stretching exercises" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="bg-white rounded-xl overflow-hidden shadow-lg transform -rotate-1">
                  <img 
                    src="https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?w=400&h=300&fit=crop" 
                    alt="Person doing yoga break at workplace" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="col-span-2 bg-white rounded-xl overflow-hidden shadow-lg transform rotate-1 mt-3">
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop" 
                    alt="Group exercise break in office setting" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg -rotate-3">
                <p className="text-sm font-medium text-brand-dark">
                  "Transforming workplace wellness culture"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
