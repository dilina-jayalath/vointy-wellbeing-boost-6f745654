import React, { useRef, useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Play } from 'lucide-react';
import challengeImage from '@/assets/challenge.jpg';
import introVideo from '@/assets/vointy-intro.mp4.asset.json';

const VideoSection = () => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    setPlaying(true);
    videoRef.current?.play();
  };

  return (
    <section id="testimonials" className="py-24 bg-brand-dark">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          {t('video.title')}
        </h2>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          {t('video.description')}
        </p>

        <div className="max-w-4xl mx-auto aspect-video rounded-3xl border border-white/10 relative overflow-hidden bg-brand-dark">
          <video
            ref={videoRef}
            src={introVideo.url}
            poster={challengeImage}
            playsInline
            controls={playing}
            onEnded={() => setPlaying(false)}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {!playing && (
            <button
              type="button"
              onClick={handlePlay}
              aria-label="Play Vointy intro video"
              className="absolute inset-0 flex items-center justify-center group cursor-pointer"
            >
              <span className="absolute inset-0 bg-gradient-to-tr from-brand-purple/40 to-brand-blue/40" />
              <span className="relative z-10 w-24 h-24 rounded-full bg-white flex items-center justify-center text-brand-purple shadow-2xl group-hover:scale-110 transition-transform">
                <Play size={40} fill="currentColor" />
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
