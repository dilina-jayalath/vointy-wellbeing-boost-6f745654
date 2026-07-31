import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Moon, Zap, Dumbbell, Users2, Apple, PlusCircle } from 'lucide-react';
import recoveryImg from '@/assets/challenge-recovery.jpg';
import moveImg from '@/assets/challenge-move.jpg';
import ergoImg from '@/assets/challenge-ergonomics.jpg';
import teamImg from '@/assets/challenge-team.jpg';
import routinesImg from '@/assets/challenge-routines.jpg';
import customImg from '@/assets/challenge-custom.jpg';

const Challenges = () => {
  const { t } = useTranslation();
  
  const iconMap: Record<number, any> = {
    0: <Moon className="text-blue-500" />,
    1: <Zap className="text-yellow-500" />,
    2: <Dumbbell className="text-red-500" />,
    3: <Users2 className="text-green-500" />,
    4: <Apple className="text-orange-500" />,
    5: <PlusCircle className="text-brand-purple" />,
  };

  const imageMap: Record<number, string> = {
    0: recoveryImg,
    1: moveImg,
    2: ergoImg,
    3: teamImg,
    4: routinesImg,
    5: customImg,
  };

  const challenges = t('challenges.items') || [];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block p-3 rounded-2xl bg-brand-purple/10 text-brand-purple mb-4">
            <Trophy size={32} />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-brand-dark mb-6">
            {t('challenges.title')}
          </h2>
          <p className="text-xl text-gray-600">
            Keep your team engaged with a variety of fun and impactful wellness challenges.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {challenges.map((challenge, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-gray-100 overflow-hidden">
              <img
                src={imageMap[index] ?? customImg}
                alt={challenge.title}
                loading="lazy"
                width={800}
                height={600}
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {iconMap[index] || <Zap />}
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">
                  {challenge.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {challenge.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};



export default Challenges;
