'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { consumeFlashBanner, queueFlashBanner } from '@/lib/flashBanner';
import { logout } from '@/feature/Logout/boundary/LogoutPage';
import { hasRole } from '@/lib/auth';

type StoredUser = {
  email: string;
  username: string;
  role: string;
};

type SuccessBanner = {
  isOpen: boolean;
  message: string;
  durationMs: number;
};

const EMPTY_USER: StoredUser = { email: '', username: '', role: '' };
let cachedUserSnapshot = EMPTY_USER;
let cachedUserSnapshotKey = '';

function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getStoredUser(): StoredUser {
  const email = localStorage.getItem('userEmail') ?? '';
  const username = localStorage.getItem('userUsername') ?? '';
  const role = localStorage.getItem('userRole') ?? '';
  const nextSnapshotKey = `${email}\u0000${username}\u0000${role}`;

  if (nextSnapshotKey === cachedUserSnapshotKey) {
    return cachedUserSnapshot;
  }

  cachedUserSnapshotKey = nextSnapshotKey;
  cachedUserSnapshot = { email, username, role };
  return cachedUserSnapshot;
}

function getServerUser(): StoredUser {
  return EMPTY_USER;
}

const LOGOUT_SUCCESS_BANNER_MS = 3000;

function getInitialSuccessBanner(): SuccessBanner {
  if (typeof window === 'undefined') {
    return { isOpen: false, message: '', durationMs: LOGOUT_SUCCESS_BANNER_MS };
  }

  const pendingBanner = consumeFlashBanner();
  if (!pendingBanner) {
    return { isOpen: false, message: '', durationMs: LOGOUT_SUCCESS_BANNER_MS };
  }

  return {
    isOpen: true,
    message: pendingBanner.message,
    durationMs: pendingBanner.durationMs,
  };
}

export default function AdminNavbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storedUser = useSyncExternalStore(subscribeToStorage, getStoredUser, getServerUser);
  const activeTab = searchParams.get('tab') === 'profile' ? 'profile' : 'account';

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<SuccessBanner>(getInitialSuccessBanner);
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    if (!successBanner.isOpen) return;
    requestAnimationFrame(() => setBannerVisible(true));
    const timer = setTimeout(() => setBannerVisible(false), successBanner.durationMs);
    return () => clearTimeout(timer);
  }, [successBanner.durationMs, successBanner.isOpen]);

  const displayName = storedUser.username.trim() || storedUser.email.split('@')[0]?.trim() || '';
  const avatarLetter = (displayName[0] ?? storedUser.email[0] ?? '?').toUpperCase();

  async function handleLogout(): Promise<void> {
    await logout();
    setMenuOpen(false);
    setProfileMenuOpen(false);
    queueFlashBanner({
      message: 'You have successfully signed out of FundRaise.',
      durationMs: LOGOUT_SUCCESS_BANNER_MS,
    });
    router.push('/');
  }

  const isPlatformManager = hasRole(storedUser.role, 'Platform manager');
  const homeHref = isPlatformManager ? '/admin/platform-management' : '/admin/manage-users?tab=account';
  const tabs: Array<{ key: 'account' | 'profile'; label: string; href: string }> = isPlatformManager
    ? []
    : [
        { key: 'account', label: 'Account', href: '/admin/manage-users?tab=account' },
        { key: 'profile', label: 'Profile', href: '/admin/manage-users?tab=profile' },
      ];

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href={homeHref} className="text-2xl font-bold text-gray-900">
            Fund<span className="text-brand">Raise</span>
          </Link>

          <div className="hidden items-center gap-14 md:flex">
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                href={tab.href}
                className={`text-[15px] font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-current={activeTab === tab.key ? 'page' : undefined}
              >
                {tab.label}
              </Link>
            ))}
          </div>

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

        {menuOpen && (
          <div className="border-t border-gray-100 px-6 pb-4 md:hidden">
            <div className="flex flex-col gap-3 pt-3">
              {tabs.map((tab) => (
                <Link
                  key={tab.key}
                  href={tab.href}
                  className={`rounded-md px-3 py-1.5 text-left text-sm font-medium transition-colors hover:bg-gray-100 ${
                    activeTab === tab.key ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setMenuOpen(false)}
                  aria-current={activeTab === tab.key ? 'page' : undefined}
                >
                  {tab.label}
                </Link>
              ))}
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
    </>
  );
}
