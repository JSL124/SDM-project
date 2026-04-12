'use client';

import { useEffect } from 'react';
import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero';
import LoginSection from '@/components/blocks/login-section';

const platformContent = {
  mediaSrc:
    'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1920&auto=format&fit=crop',
  bgImageSrc:
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1920&auto=format&fit=crop',
  title: 'Online Fundraiser Platform',
  date: 'CSIT314 Software Development',
  scrollToExpand: 'Scroll to explore',
};

function PlatformDescription() {
  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-6 text-3xl font-bold text-white">
        About Our Platform
      </h2>
      <p className="mb-8 text-lg leading-relaxed text-white/90">
        Our platform helps individuals and organizations create fundraising
        campaigns, share their stories, and connect with supporters through a
        simple and trustworthy online experience.
      </p>
      <p className="text-lg leading-relaxed text-white/90">
        Users can discover meaningful causes, contribute securely, and track
        campaign progress in one place, making fundraising more transparent,
        accessible, and efficient.
      </p>
    </div>
  );
}

function scrollToLogin() {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth',
  });
}

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Top-right Login button */}
      <button
        onClick={scrollToLogin}
        className="fixed right-6 top-6 z-50 rounded-full border border-white/30 bg-white/10 px-6 py-2 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
      >
        Log In
      </button>

      <ScrollExpandMedia
        mediaType="image"
        mediaSrc={platformContent.mediaSrc}
        bgImageSrc={platformContent.bgImageSrc}
        title={platformContent.title}
        date={platformContent.date}
        scrollToExpand={platformContent.scrollToExpand}
        textBlend
      >
        <LoginSection />
        <PlatformDescription />
      </ScrollExpandMedia>
    </div>
  );
}
