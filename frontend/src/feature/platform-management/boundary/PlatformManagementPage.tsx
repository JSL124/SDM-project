'use client';

import { useSyncExternalStore } from 'react';
import { hasRole } from '@/lib/auth';

type KpiCard = {
  label: string;
  value: string;
  subtitle: string;
};

// Placeholder mockup values — replace with live data in the backend iteration.
const KPI_CARDS: KpiCard[] = [
  { label: 'Total Accounts', value: '1,248', subtitle: 'across all roles' },
  { label: 'Active Fundraising Activities', value: '37', subtitle: 'currently running' },
  { label: 'Total Target Amount', value: '$2,450,000', subtitle: 'across all activities' },
  { label: 'Platform Categories', value: '8', subtitle: 'active categories' },
];

function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getIsAuthorized(): boolean {
  return hasRole(localStorage.getItem('userRole'), 'Platform manager');
}

export default function PlatformManagementPage() {
  const authorized = useSyncExternalStore(subscribeToStorage, getIsAuthorized, () => false);

  if (!authorized) {
    return (
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-8 py-10 text-center shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="mt-4 text-lg font-semibold text-gray-900">Access Denied</p>
        <p className="mt-2 text-sm text-gray-500">Only Platform Managers can view this page.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <nav
        aria-hidden="true"
        className="hidden border-b border-gray-200 bg-white md:block md:w-56 md:border-b-0 md:border-r md:shadow-sm"
      />

      <div className="relative flex-1 p-6 md:p-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Platform Management</h1>
          <p className="mt-1 text-sm text-gray-500">Overview of platform-wide activity and accounts.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {KPI_CARDS.map((card) => (
            <div key={card.label} className="rounded-2xl bg-white p-6 shadow-xl">
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
              <p className="mt-1 text-xs text-gray-400">{card.subtitle}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Recent Activity</h2>
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-gray-400">Activity feed will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
