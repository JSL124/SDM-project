'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { getApiUrl } from '@/lib/api';
import { hasRole } from '@/lib/auth';

function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getIsAuthorized(): boolean {
  return hasRole(localStorage.getItem('userRole'), 'Fundraiser');
}

type Activity = {
  activityID: string;
  title: string;
  description: string;
  targetAmount: number;
  category: string;
  startDate: string;
  endDate: string;
  status: string;
};

type ViewState = 'list' | 'detail';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ViewFundraisingActivitiesPage() {
  const authorized = useSyncExternalStore(subscribeToStorage, getIsAuthorized, () => false);

  const [viewState, setViewState] = useState<ViewState>('list');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadActivities(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(getApiUrl('/api/fundraising-activity'));
      const data = (await response.json()) as { success: boolean; activities?: Activity[]; message?: string };
      if (response.ok && data.success && data.activities) {
        if (data.activities.length === 0) {
          displayNoFundraisingActivitiesMessage();
        } else {
          displayFundraisingActivities(data.activities);
        }
      } else {
        setError(data.message ?? 'Failed to load activities.');
      }
    } catch {
      setError('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  }

  function displayFundraisingActivities(list: Activity[]): void {
    setActivities(list);
    setViewState('list');
  }

  function displayNoFundraisingActivitiesMessage(): void {
    setActivities([]);
  }

  async function selectFundraisingActivity(activityID: string): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(getApiUrl(`/api/fundraising-activity/${activityID}`));
      const data = (await response.json()) as { success: boolean; activity?: Activity; message?: string };
      if (response.ok && data.success && data.activity) {
        setSelectedActivity(data.activity);
        displayFundraisingActivityDetails();
      } else {
        setError(data.message ?? 'Failed to load activity details.');
      }
    } catch {
      setError('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  }

  function displayFundraisingActivityDetails(): void {
    setViewState('detail');
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <nav className="flex flex-row gap-2 border-b border-gray-200 bg-white p-4 md:w-56 md:flex-col md:border-b-0 md:border-r md:shadow-sm">
        <h2 className="hidden text-sm font-semibold uppercase tracking-wider text-gray-400 md:mb-4 md:block">
          Management
        </h2>
        <button className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors">
          Fundraising
        </button>
      </nav>

      {/* Main content */}
      <div className="flex-1 p-6 md:p-10">
        {viewState === 'list' ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Fundraising Activities</h1>
              {authorized ? (
                <Link
                  href="/fundraiser/create-fundraising-activity"
                  aria-label="Create Fundraising Activity"
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-colors hover:bg-brand-hover"
                >
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </Link>
              ) : null}
            </div>

            {error ? (
              <div className="rounded-lg bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
              </div>
            ) : activities.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
                <p className="text-gray-400">No fundraising activities to display yet.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activities.map((activity) => (
                  <button
                    key={activity.activityID}
                    onClick={() => void selectFundraisingActivity(activity.activityID)}
                    className="rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="text-base font-semibold text-gray-900 leading-snug">{activity.title}</h3>
                      <span className="shrink-0 rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
                        {activity.category}
                      </span>
                    </div>
                    <p className="mb-3 text-sm text-gray-500 line-clamp-2">{activity.description}</p>
                    <p className="text-lg font-bold text-gray-900">${Number(activity.targetAmount).toLocaleString()}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {formatDate(activity.startDate)} — {formatDate(activity.endDate)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-4">
              <button
                onClick={() => { setViewState('list'); setSelectedActivity(null); }}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Activity Details</h1>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : selectedActivity ? (
              <div className="max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-900">{selectedActivity.title}</h2>
                  <span className="shrink-0 rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">
                    {selectedActivity.category}
                  </span>
                </div>
                <p className="mb-6 text-sm text-gray-600 leading-relaxed">{selectedActivity.description}</p>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="font-medium text-gray-500">Target Amount</dt>
                    <dd className="mt-1 text-lg font-bold text-gray-900">${Number(selectedActivity.targetAmount).toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 font-semibold text-gray-900">{selectedActivity.status}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">Start Date</dt>
                    <dd className="mt-1 text-gray-900">{formatDate(selectedActivity.startDate)}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">End Date</dt>
                    <dd className="mt-1 text-gray-900">{formatDate(selectedActivity.endDate)}</dd>
                  </div>
                </dl>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
