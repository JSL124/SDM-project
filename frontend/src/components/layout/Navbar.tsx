'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import LoginModal from '@/components/ui/LoginModal';
import { logout, displayLoginPage } from '@/feature/logout/boundary/LogoutBoundary';
import {
  consumeFlashBanner,
  queueFlashBanner,
  FLASH_BANNER_EVENT,
  type FlashBannerPayload,
  type FlashBannerVariant,
} from '@/lib/flashBanner';

type LoggedInUser = {
  email: string;
  username?: string;
  role?: string;
};

function getInitialLoggedInUser(): LoggedInUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const email = localStorage.getItem('userEmail')?.trim() ?? '';
  const username = localStorage.getItem('userUsername')?.trim() ?? '';
  const role = localStorage.getItem('userRole')?.trim() ?? '';

  if (!email) {
    return null;
  }

  return {
    email,
    username: username || undefined,
    role: role || undefined,
  };
}

type FlashBannerState = {
  isOpen: boolean;
  message: string;
  durationMs: number;
  variant: FlashBannerVariant;
};

const LOGOUT_SUCCESS_BANNER_MS = 3000;
const LOGIN_SUCCESS_BANNER_MS = 4500;

function getInitialFlashBanner(): FlashBannerState {
  if (typeof window === 'undefined') {
    return { isOpen: false, message: '', durationMs: LOGOUT_SUCCESS_BANNER_MS, variant: 'success' };
  }

  const pendingBanner = consumeFlashBanner();
  if (!pendingBanner) {
    return { isOpen: false, message: '', durationMs: LOGOUT_SUCCESS_BANNER_MS, variant: 'success' };
  }

  return {
    isOpen: true,
    message: pendingBanner.message,
    durationMs: pendingBanner.durationMs,
    variant: pendingBanner.variant ?? 'success',
  };
}

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(getInitialLoggedInUser);
  const [flashBanner, setFlashBanner] = useState<FlashBannerState>(getInitialFlashBanner);
  const [bannerVisible, setBannerVisible] = useState(false);

  function showFlashBanner(message: string, durationMs: number, variant: FlashBannerVariant = 'success'): void {
    setBannerVisible(false);
    setFlashBanner({
      isOpen: true,
      message,
      durationMs,
      variant,
    });
  }

  useEffect(() => {
    if (!flashBanner.isOpen) return;
    // Trigger slide-down on next frame
    requestAnimationFrame(() => setBannerVisible(true));
    // Start slide-up after the configured duration
    const timer = setTimeout(() => setBannerVisible(false), flashBanner.durationMs);
    return () => clearTimeout(timer);
  }, [flashBanner.durationMs, flashBanner.isOpen]);

  useEffect(() => {
    function handleBroadcast(event: Event): void {
      const detail = (event as CustomEvent<FlashBannerPayload>).detail;
      if (!detail || typeof detail.message !== 'string' || typeof detail.durationMs !== 'number') return;
      showFlashBanner(detail.message, detail.durationMs, detail.variant ?? 'success');
    }
    window.addEventListener(FLASH_BANNER_EVENT, handleBroadcast);
    return () => window.removeEventListener(FLASH_BANNER_EVENT, handleBroadcast);
  }, []);

  useEffect(() => {
    function syncLoggedInUser(): void {
      setLoggedInUser(getInitialLoggedInUser());
    }

    window.addEventListener('storage', syncLoggedInUser);
    syncLoggedInUser();

    return () => window.removeEventListener('storage', syncLoggedInUser);
  }, []);

  const displayName = loggedInUser?.username?.trim() || loggedInUser?.email.split('@')[0]?.trim() || '';
  const avatarLetter = (displayName[0] ?? loggedInUser?.email[0] ?? '?').toUpperCase();

  function handleLoginSuccess(user: LoggedInUser): void {
    setLoggedInUser(user);
    setLoginOpen(false);
    const loginSuccessMessage = 'You have successfully signed in to FundRaise.';
    showFlashBanner(loginSuccessMessage, LOGIN_SUCCESS_BANNER_MS, 'success');
    if (user.role?.trim() === 'User admin') {
      queueFlashBanner({ message: loginSuccessMessage, durationMs: LOGIN_SUCCESS_BANNER_MS, variant: 'success' });
      router.push('/admin/manage-users');
    }
  }

  async function handleLogout(): Promise<void> {
    const didLogout = await logout();
    if (didLogout) {
      setMenuOpen(false);
      setProfileMenuOpen(false);
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userUsername');
      displayLoginPage(() => setLoggedInUser(null));
      showFlashBanner('You have successfully signed out of FundRaise.', LOGOUT_SUCCESS_BANNER_MS, 'success');
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
          {loggedInUser ? (
            <div className="hidden items-center gap-14 md:flex">
              <Link href="/fundraiser/manage-activities" className="flex items-center gap-1 text-[15px] font-medium text-gray-600 hover:text-gray-900">
                <span>Fundraising Activities</span>
              </Link>
            </div>
          ) : null}

          {/* Desktop actions */}
          {loggedInUser ? (
            <div className="hidden items-center gap-6 md:flex">
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
            </div>
          ) : (
            <div className="hidden items-center gap-6 md:flex">
              <button
                onClick={() => setLoginOpen(true)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          {loggedInUser ? (
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
          ) : null}
        </div>

        {/* Mobile menu */}
        {loggedInUser && menuOpen && (
          <div className="border-t border-gray-100 px-6 pb-4 md:hidden">
            <div className="flex flex-col gap-3 pt-3">
              <Link
                href="/fundraiser/manage-activities"
                className="flex items-center gap-1 text-left text-sm font-medium text-gray-600"
                onClick={() => setMenuOpen(false)}
              >
                <span>Fundraising Activities</span>
              </Link>
              <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-3 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#168fe3] text-sm font-semibold text-white">
                  {avatarLetter}
                </div>
                {displayName ? (
                  <span className="text-base font-normal text-gray-900">{displayName}</span>
                ) : null}
              </div>
              <button
                onClick={async () => { await handleLogout(); setMenuOpen(false); }}
                className="rounded-md px-3 py-1.5 text-left text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </nav>

      {flashBanner.isOpen && (
        <div
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{
            maxHeight: bannerVisible ? '60px' : '0px',
            opacity: bannerVisible ? 1 : 0,
          }}
          onTransitionEnd={() => {
            if (!bannerVisible) {
              setFlashBanner({ isOpen: false, message: '', durationMs: LOGOUT_SUCCESS_BANNER_MS, variant: 'success' });
            }
          }}
          role={flashBanner.variant === 'error' ? 'alert' : 'status'}
        >
          <div
            className={`border-b px-6 py-3 text-center text-sm ${
              flashBanner.variant === 'error'
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-green-200 bg-brand-light text-gray-700'
            }`}
          >
            <span className="mr-2">{flashBanner.variant === 'error' ? '⚠' : '✓'}</span>
            {flashBanner.message}
          </div>
        </div>
      )}

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />
    </>
  );
}
