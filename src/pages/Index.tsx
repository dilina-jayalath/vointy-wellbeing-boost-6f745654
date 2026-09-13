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
import InstallAppPrompt from '@/components/InstallAppPrompt';

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
        <RoiCalculatorSection />
        <VideoSection />
        <LicenseForm />
        <section className="container mx-auto px-4 pb-12">
          <InstallAppPrompt variant="card" storageKey="vointy-install-dismissed-home" className="mx-auto max-w-2xl" />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
