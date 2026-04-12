'use client';

import { useEffect } from 'react';
import LoginBoundary from '@/feature/login/boundary/LoginBoundary';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

export default function LoginModal({ open, onClose, onLoginSuccess }: LoginModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <LoginBoundary onLoginSuccess={onLoginSuccess} />
      </div>
    </div>
  );
}
