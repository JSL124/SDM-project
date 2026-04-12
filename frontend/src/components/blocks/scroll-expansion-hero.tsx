'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';

interface ScrollExpandMediaProps {
  mediaType: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title: string;
  date: string;
  scrollToExpand: string;
  textBlend?: boolean;
  children?: ReactNode;
}

export default function ScrollExpandMedia({
  mediaType,
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend = false,
  children,
}: ScrollExpandMediaProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrolled = -rect.top;
      const totalScrollable = sectionHeight - viewportHeight;
      const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      setScrollProgress(progress);
    };

    const handleReset = () => {
      setScrollProgress(0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resetSection', handleReset);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resetSection', handleReset);
    };
  }, []);

  const expandPhase = Math.min(scrollProgress * 2.5, 1);
  const contentPhase = Math.max((scrollProgress - 0.4) / 0.6, 0);

  const borderRadius = `${Math.round((1 - expandPhase) * 24)}px`;
  const scale = 0.85 + expandPhase * 0.15;
  const mediaWidth = 70 + expandPhase * 30;
  const titleOpacity = 1 - expandPhase;
  const contentOpacity = contentPhase;

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{ height: '300vh' }}
    >
      {/* Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center transition-opacity duration-700"
        style={{
          backgroundImage: `url(${bgImageSrc})`,
          opacity: 1 - expandPhase * 0.3,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Sticky container */}
      <div className="sticky top-0 z-10 flex h-screen w-full flex-col items-center justify-center">
        {/* Title overlay */}
        <div
          className="absolute z-30 flex flex-col items-center gap-4 px-4 text-center"
          style={{
            opacity: titleOpacity,
            transform: `translateY(${-expandPhase * 60}px)`,
            pointerEvents: titleOpacity < 0.1 ? 'none' : 'auto',
          }}
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
            {date}
          </p>
          <h1
            className={`text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl ${
              textBlend ? 'mix-blend-difference' : ''
            }`}
          >
            {title}
          </h1>
          <p className="mt-4 animate-bounce text-sm text-white/60">
            {scrollToExpand}
          </p>
        </div>

        {/* Expanding media */}
        <div
          className="relative z-20 overflow-hidden shadow-2xl"
          style={{
            width: `${mediaWidth}%`,
            height: `${60 + expandPhase * 40}%`,
            borderRadius,
            transform: `scale(${scale})`,
            transition: 'border-radius 0.1s ease-out',
          }}
        >
          {mediaType === 'video' ? (
            <video
              src={mediaSrc}
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={mediaSrc}
              alt={title}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* Content below media */}
        <div
          className="absolute bottom-0 left-0 right-0 z-40 overflow-y-auto px-6 pb-12 pt-8"
          style={{
            opacity: contentOpacity,
            transform: `translateY(${(1 - contentPhase) * 40}px)`,
            maxHeight: '40vh',
            pointerEvents: contentOpacity < 0.1 ? 'none' : 'auto',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
