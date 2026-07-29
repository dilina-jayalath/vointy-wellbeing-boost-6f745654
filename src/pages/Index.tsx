import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/home/Hero';
import FreeTeam from '@/components/home/FreeTeam';
import Companies from '@/components/home/Companies';
import Challenges from '@/components/home/Challenges';
import SocialPlatform from '@/components/home/SocialPlatform';
import WhyVointy from '@/components/home/WhyVointy';
import VideoSection from '@/components/home/VideoSection';
import LicenseForm from '@/components/home/LicenseForm';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <FreeTeam />
        <Companies />
        <Challenges />
        <SocialPlatform />
        <WhyVointy />
        <VideoSection />
        <LicenseForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
