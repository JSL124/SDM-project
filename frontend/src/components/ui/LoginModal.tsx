'use client';

import { useEffect, useState } from 'react';
import LoginBoundary from '@/feature/Login/boundary/LoginBoundary';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { email: string; role?: string }) => void;
}

const ENTER_ANIMATION_DELAY_MS = 20;
const EXIT_ANIMATION_MS = 250;

export default function LoginModal({ open, onClose, onLoginSuccess }: LoginModalProps) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let mountTimer: number | undefined;
    let enterTimer: number | undefined;
    let exitTimer: number | undefined;
    let unmountTimer: number | undefined;

    if (open) {
      mountTimer = window.setTimeout(() => {
        setMounted(true);
        setVisible(false);
        enterTimer = window.setTimeout(() => setVisible(true), ENTER_ANIMATION_DELAY_MS);
      }, 0);
    } else {
      exitTimer = window.setTimeout(() => setVisible(false), 0);
      unmountTimer = window.setTimeout(() => setMounted(false), EXIT_ANIMATION_MS);
    }

    return () => {
      if (mountTimer) window.clearTimeout(mountTimer);
      if (enterTimer) window.clearTimeout(enterTimer);
      if (exitTimer) window.clearTimeout(exitTimer);
      if (unmountTimer) window.clearTimeout(unmountTimer);
    };
  }, [open]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (mounted) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ease-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 backdrop-blur-sm transition-colors duration-300 ease-out ${
          visible ? 'bg-black/60' : 'bg-black/0'
        }`}
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className={`relative z-10 w-full max-w-md px-4 transition-all duration-300 ease-out ${
          visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-[0.98] opacity-0'
        }`}
      >
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <LoginBoundary onLoginSuccess={onLoginSuccess} />
        </div>
      </div>
    </div>
  );
}
