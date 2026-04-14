'use client';

import { useSyncExternalStore } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { hasRole } from '@/lib/auth';

type ActiveTab = 'account' | 'profile';

const TAB_CONFIG = {
  account: { label: 'Account', heading: 'Accounts', createRoute: '/admin/create-account' },
  profile: { label: 'Profile', heading: 'Profiles', createRoute: '/admin/create-profile' },
} as const;

function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getIsAuthorized(): boolean {
  return hasRole(localStorage.getItem('userRole'), 'User admin');
}

export default function ManageUsersPage() {
  const authorized = useSyncExternalStore(subscribeToStorage, getIsAuthorized, () => false);
  const searchParams = useSearchParams();
  const activeTab: ActiveTab = searchParams.get('tab') === 'profile' ? 'profile' : 'account';

  if (!authorized) {
    return (
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-8 py-10 text-center shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="mt-4 text-lg font-semibold text-gray-900">Access Denied</p>
        <p className="mt-2 text-sm text-gray-500">Only User Admins can manage users.</p>
      </div>
    );
  }

  const { heading, createRoute } = TAB_CONFIG[activeTab];

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Placeholder sidebar column — tab selection moved to top navbar */}
      <nav
        aria-hidden="true"
        className="hidden border-b border-gray-200 bg-white md:block md:w-56 md:border-b-0 md:border-r md:shadow-sm"
      />

      {/* Main content */}
      <div className="relative flex-1 p-6 md:p-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{heading}</h1>
          <Link
            href={createRoute}
            aria-label={`Create ${TAB_CONFIG[activeTab].label}`}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-colors hover:bg-brand-hover"
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>

        {/* Placeholder for list - to be implemented next sprint */}
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-gray-400">No {heading.toLowerCase()} to display yet.</p>
        </div>
      </div>
    </div>
  );
}
