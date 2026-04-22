'use client';

import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api';
import { hasRole } from '@/lib/auth';

type UserProfileResponse = {
  role: string;
  description: string;
};

type ProfileStatus = {
  submitted: boolean;
  profile: UserProfileResponse | null;
  errorMessage: string;
};

export default function CreateProfilePage() {
  const router = useRouter();
  const authorized = useSyncExternalStore(
    (callback) => {
      window.addEventListener('storage', callback);
      return () => window.removeEventListener('storage', callback);
    },
    () => hasRole(localStorage.getItem('userRole'), 'User admin'),
    () => false
  );
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProfileStatus>({
    submitted: false,
    profile: null,
    errorMessage: '',
  });
  const [successVisible, setSuccessVisible] = useState(false);
  const errorMessageRef = useRef('Failed to create profile.');

  const isSuccess = status.profile !== null;
  const message = status.submitted
    ? isSuccess
      ? 'Profile created successfully.'
      : status.errorMessage
    : '';

  useEffect(() => {
    if (!isSuccess) return;
    requestAnimationFrame(() => setSuccessVisible(true));
    const timer = setTimeout(() => setSuccessVisible(false), 2000);
    return () => clearTimeout(timer);
  }, [isSuccess]);

  function displaySuccess(): void {
    setStatus({
      submitted: true,
      profile: { role, description },
      errorMessage: '',
    });
  }

  function displayError(): void {
    setStatus({
      submitted: true,
      profile: null,
      errorMessage: errorMessageRef.current,
    });
  }

  if (!authorized) {
    return (
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-8 py-10 text-center shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="mt-4 text-lg font-semibold text-gray-900">Access Denied</p>
        <p className="mt-2 text-sm text-gray-500">Only User Admins can create profiles.</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div
        className="transition-all duration-700 ease-out"
        style={{
          opacity: successVisible ? 1 : 0,
          transform: successVisible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(16px)',
        }}
        onTransitionEnd={() => {
          if (!successVisible && isSuccess) {
            router.push('/admin/create-account');
          }
        }}
      >
        <div className="mx-auto w-full max-w-lg rounded-3xl bg-white px-10 py-14 text-center shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="mt-6 text-2xl font-bold text-gray-900">{message}</p>
          <p className="mt-2 text-sm text-gray-500">Redirecting to account creation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-xl">
      <h2 className="text-center text-2xl font-bold text-gray-900">Create User Profile</h2>
      <p className="mt-2 text-center text-sm text-gray-500">
        Enter the new profile details below
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();

          if (!role.trim()) {
            errorMessageRef.current = 'Please enter a role.';
            displayError();
            return;
          }

          if (!description.trim()) {
            errorMessageRef.current = 'Please enter a description.';
            displayError();
            return;
          }

          void (async () => {
            try {
              const response = await fetch(getApiUrl('/api/profile'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role, description }),
              });

              const data = (await response.json()) as UserProfileResponse | null;
              if (response.ok && data !== null) {
                displaySuccess();
                return;
              }

              errorMessageRef.current = 'Failed to create profile.';
              displayError();
            } catch {
              errorMessageRef.current = 'Unable to connect to server.';
              displayError();
            }
          })();
        }}
        className="mt-6 flex flex-col gap-4"
      >
        <div>
          <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-gray-700">
            Role
          </label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            placeholder="Enter role"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Enter description"
            rows={4}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {message ? (
          <div className="rounded-lg bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">{message}</p>
          </div>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-lg bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          Create
        </button>
      </form>
    </div>
  );
}
