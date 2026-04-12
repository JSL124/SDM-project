'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import LoginModal from '@/components/ui/LoginModal';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  function handleLoginSuccess(email: string): void {
    setUserEmail(email);
    setLoginOpen(false);
  }

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <a href="/" className="text-2xl font-bold text-gray-900">
            Fund<span className="text-brand">Raise</span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="#categories" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Discover
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              How It Works
            </a>
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-4 md:flex">
            {userEmail ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                {userEmail[0].toUpperCase()}
              </div>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Sign In
              </button>
            )}
            <Button size="sm">Start a Fundraiser</Button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-gray-100 px-6 pb-4 md:hidden">
            <div className="flex flex-col gap-3 pt-3">
              <a href="#categories" className="text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>
                Discover
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>
                How It Works
              </a>
              {userEmail ? (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                  {userEmail[0].toUpperCase()}
                </div>
              ) : (
                <button
                  onClick={() => { setLoginOpen(true); setMenuOpen(false); }}
                  className="text-left text-sm font-medium text-gray-600"
                >
                  Sign In
                </button>
              )}
              <Button size="sm" className="w-full">Start a Fundraiser</Button>
            </div>
          </div>
        )}
      </nav>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />
    </>
  );
}
