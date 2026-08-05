import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/home/Hero';
import FreeTeam from '@/components/home/FreeTeam';
import Companies from '@/components/home/Companies';
import Challenges from '@/components/home/Challenges';

import WhyVointy from '@/components/home/WhyVointy';
import RoiCalculatorSection from '@/components/home/RoiCalculatorSection';
import VideoSection from '@/components/home/VideoSection';
import LicenseForm from '@/components/home/LicenseForm';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Seo title={"Vointy.life — Build healthier habits, together."} description={"Improve employee wellbeing and reduce sick leaves with shared activities, challenges and healthy habits. Free for companies."} path="/" />
      <Header />
      <main>
        <Hero />
        <FreeTeam />
        <Companies />
        <Challenges />
        <WhyVointy />
        <VideoSection />
        <LicenseForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
