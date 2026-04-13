'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import LoginModal from '@/components/ui/LoginModal';
import { logout, displayLoginPage } from '@/feature/logout/boundary/LogoutBoundary';

const profileMenuItems = ['Profile', 'Your impact', 'Account settings'] as const;

type LoggedInUser = {
  email: string;
  username?: string;
  role?: string;
};

type SuccessBanner = {
  isOpen: boolean;
  message: string;
  durationMs: number;
};

const LOGIN_SUCCESS_BANNER_MS = 4500;
const LOGOUT_SUCCESS_BANNER_MS = 3000;

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
  const [successBanner, setSuccessBanner] = useState<SuccessBanner>({ isOpen: false, message: '', durationMs: LOGOUT_SUCCESS_BANNER_MS });
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    if (!successBanner.isOpen) return;
    // Trigger slide-down on next frame
    requestAnimationFrame(() => setBannerVisible(true));
    // Start slide-up after the configured duration
    const timer = setTimeout(() => setBannerVisible(false), successBanner.durationMs);
    return () => clearTimeout(timer);
  }, [successBanner.durationMs, successBanner.isOpen]);

  const displayName = loggedInUser?.username?.trim() || loggedInUser?.email.split('@')[0]?.trim() || '';
  const avatarLetter = (displayName[0] ?? loggedInUser?.email[0] ?? '?').toUpperCase();

  function showSuccessBanner(message: string, durationMs: number): void {
    setBannerVisible(false);
    setSuccessBanner({
      isOpen: true,
      message,
      durationMs,
    });
  }

  function handleLoginSuccess(user: LoggedInUser): void {
    setLoggedInUser(user);
    setLoginOpen(false);
    showSuccessBanner('You have successfully signed in to FundRaise.', LOGIN_SUCCESS_BANNER_MS);
  }

  async function handleLogout(): Promise<void> {
    const didLogout = await logout();
    if (didLogout) {
      setMenuOpen(false);
      setProfileMenuOpen(false);
      displayLoginPage(() => setLoggedInUser(null));
      showSuccessBanner('You have successfully signed out of FundRaise.', LOGOUT_SUCCESS_BANNER_MS);
      router.push('/');
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Fund<span className="text-brand">Raise</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-14 md:flex">
            <button type="button" className="flex items-center gap-1.5 text-[15px] font-medium text-gray-600 hover:text-gray-900">
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <span>Search</span>
            </button>
            <button type="button" className="flex items-center gap-1 text-[15px] font-medium text-gray-600 hover:text-gray-900">
              <span>Donate</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button type="button" className="flex items-center gap-1 text-[15px] font-medium text-gray-600 hover:text-gray-900">
              <span>Fundraise</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-6 md:flex">
            {loggedInUser ? (
              <>
                <button
                  type="button"
                  className="flex items-center gap-1 text-[17px] font-medium text-gray-700 transition-colors hover:text-gray-900 focus:outline-none"
                >
                  <span>About</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className="relative pb-3"
                  onMouseEnter={() => setProfileMenuOpen(true)}
                  onMouseLeave={() => setProfileMenuOpen(false)}
                  onFocus={() => setProfileMenuOpen(true)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setProfileMenuOpen(false);
                    }
                  }}
                >
                  <button
                    type="button"
                    className="flex h-12 items-center gap-2 rounded-full bg-[#f2f2f5] px-2 pr-3 text-sm text-gray-900 transition-colors hover:bg-[#ebebf0] focus:bg-[#ebebf0] focus:outline-none"
                    aria-haspopup="menu"
                    aria-expanded={profileMenuOpen}
                    aria-label={`Open profile menu for ${displayName || 'user'}`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#168fe3] text-[15px] font-semibold text-white">
                      {avatarLetter}
                    </div>
                    {displayName ? (
                      <span className="max-w-28 truncate text-[17px] font-normal tracking-tight text-gray-800">{displayName}</span>
                    ) : null}
                    <svg
                      className={`h-4 w-4 text-gray-700 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div
                    className={`absolute right-0 top-full z-50 pt-3 transition-all duration-200 ease-out ${
                      profileMenuOpen
                        ? 'pointer-events-auto translate-y-0 opacity-100'
                        : 'pointer-events-none -translate-y-2 opacity-0'
                    }`}
                  >
                    <div className="absolute inset-x-0 -top-3 h-3" aria-hidden="true" />
                    <div
                      className="w-[250px] rounded-[30px] border border-gray-100 bg-white px-4 py-5 shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
                      role="menu"
                      aria-label="Profile menu"
                    >
                      <div className="flex flex-col">
                        {profileMenuItems.map((item) => (
                          <button
                            key={item}
                            type="button"
                            className="rounded-2xl px-3 py-5 text-left text-[17px] font-medium text-gray-900 transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                            role="menuitem"
                          >
                            {item}
                          </button>
                        ))}
                        {loggedInUser.role === 'User admin' ? (
                          <Link
                            href="/admin/manage-users"
                            className="rounded-2xl px-3 py-5 text-left text-[17px] font-medium text-gray-900 transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                            role="menuitem"
                          >
                            Admin
                          </Link>
                        ) : null}
                        <button
                          type="button"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            void handleLogout();
                          }}
                          className="rounded-2xl px-3 py-5 text-left text-[17px] font-medium text-gray-900 transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                          role="menuitem"
                        >
                          Sign out
                        </button>
                        </div>
                      </div>
                    </div>
                </div>
              </>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Sign In
              </button>
            )}
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
              <button type="button" className="flex items-center gap-1 text-left text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <span>Search</span>
              </button>
              <button type="button" className="flex items-center gap-1 text-left text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>
                <span>Donate</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button type="button" className="flex items-center gap-1 text-left text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>
                <span>Fundraise</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {loggedInUser ? (
                <>
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-md py-1 text-left text-sm font-medium text-gray-700"
                  >
                    <span>About</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-3 py-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#168fe3] text-sm font-semibold text-white">
                      {avatarLetter}
                    </div>
                    {displayName ? (
                      <span className="text-base font-normal text-gray-900">{displayName}</span>
                    ) : null}
                  </div>
                  {profileMenuItems.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="rounded-md px-3 py-1.5 text-left text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    >
                      {item}
                    </button>
                  ))}
                  {loggedInUser.role === 'User admin' ? (
                    <Link
                      href="/admin/manage-users"
                      className="rounded-md px-3 py-1.5 text-left text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => setMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  ) : null}
                </>
              ) : (
                <button
                  onClick={() => { setLoginOpen(true); setMenuOpen(false); }}
                  className="text-left text-sm font-medium text-gray-600"
                >
                  Sign In
                </button>
              )}
              {loggedInUser && (
                <button
                  onClick={async () => { await handleLogout(); setMenuOpen(false); }}
                  className="rounded-md px-3 py-1.5 text-left text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  Sign out
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {successBanner.isOpen && (
        <div
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{
            maxHeight: bannerVisible ? '60px' : '0px',
            opacity: bannerVisible ? 1 : 0,
          }}
          onTransitionEnd={() => {
            if (!bannerVisible) {
              setSuccessBanner({ isOpen: false, message: '', durationMs: LOGOUT_SUCCESS_BANNER_MS });
            }
          }}
        >
          <div className="border-b border-green-200 bg-brand-light px-6 py-3 text-center text-sm text-gray-700">
            <span className="mr-2">✓</span>
            {successBanner.message}
          </div>
        </div>
      )}

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />
    </>
  );
}
