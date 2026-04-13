'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';

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
  return localStorage.getItem('userRole') === 'User admin';
}

export default function ManageUsersPage() {
  const authorized = useSyncExternalStore(subscribeToStorage, getIsAuthorized, () => false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('account');

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
      {/* Sidebar - horizontal on mobile, vertical on desktop */}
      <nav className="flex flex-row gap-2 border-b border-gray-200 bg-white p-4 md:w-56 md:flex-col md:border-b-0 md:border-r md:shadow-sm">
        <h2 className="hidden text-sm font-semibold uppercase tracking-wider text-gray-400 md:mb-4 md:block">
          Management
        </h2>
        {(Object.keys(TAB_CONFIG) as ActiveTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-brand text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {TAB_CONFIG[tab].label}
          </button>
        ))}
      </nav>

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
