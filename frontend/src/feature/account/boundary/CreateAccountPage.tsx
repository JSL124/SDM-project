'use client';

import { useState, useEffect, useSyncExternalStore, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api';

const ROLES = ['Fundraiser', 'Donee', 'User admin', 'Platform manager'] as const;

type AccountResult = {
  success: boolean;
  message: string;
};

type AccountStatus = {
  submitted: boolean;
  result: AccountResult | null;
};

const initialStatus: AccountStatus = {
  submitted: false,
  result: null,
};

function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getIsAuthorized(): boolean {
  return localStorage.getItem('userRole') === 'User admin';
}

export default function CreateAccountPage() {
  const router = useRouter();
  const authorized = useSyncExternalStore(subscribeToStorage, getIsAuthorized, () => false);
  const [profileId, setProfileId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<AccountStatus>(initialStatus);
  const [successVisible, setSuccessVisible] = useState(false);

  const isSuccess = status.result?.success;

  useEffect(() => {
    if (!isSuccess) return;
    requestAnimationFrame(() => setSuccessVisible(true));
    const timer = setTimeout(() => setSuccessVisible(false), 2000);
    return () => clearTimeout(timer);
  }, [isSuccess]);

  function handleSuccessExit() {
    if (!successVisible && isSuccess) {
      router.push('/admin/manage-users');
    }
  }

  function validateInput(profileId: string, username: string, password: string, role: string): boolean {
    if (!profileId.trim()) {
      displayError('Please enter a profile ID.');
      return false;
    }

    if (!username.trim()) {
      displayError('Please enter a username.');
      return false;
    }

    if (!password.trim()) {
      displayError('Please enter a password.');
      return false;
    }

    if (!role) {
      displayError('Please select a role.');
      return false;
    }

    return true;
  }

  function displaySuccess(): void {
    setStatus({
      submitted: true,
      result: {
        success: true,
        message: 'Account created successfully.',
      },
    });
  }

  function displayError(message: string): void {
    setStatus({
      submitted: true,
      result: {
        success: false,
        message,
      },
    });
  }

  async function submitUserAccount(profileId: string, username: string, password: string, role: string): Promise<void> {
    if (!validateInput(profileId, username, password, role)) {
      return;
    }

    try {
      const response = await fetch(getApiUrl('/api/account'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, username, password, role }),
      });

      const data = (await response.json()) as AccountResult;
      if (response.ok && data.success) {
        displaySuccess();
        return;
      }

      displayError(data.message);
    } catch {
      displayError('Unable to connect to server.');
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void submitUserAccount(profileId, username, password, role);
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
        <p className="mt-2 text-sm text-gray-500">Only User Admins can create accounts.</p>
      </div>
    );
  }

  const message = status.submitted ? status.result?.message : '';

  if (isSuccess) {
    return (
      <div
        className="transition-all duration-700 ease-out"
        style={{
          opacity: successVisible ? 1 : 0,
          transform: successVisible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(16px)',
        }}
        onTransitionEnd={handleSuccessExit}
      >
        <div className="mx-auto w-full max-w-lg rounded-3xl bg-white px-10 py-14 text-center shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="mt-6 text-2xl font-bold text-gray-900">Account Created</p>
          <p className="mt-2 text-sm text-gray-500">Redirecting to management page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-xl">
      <h2 className="text-center text-2xl font-bold text-gray-900">Create User Account</h2>
      <p className="mt-2 text-center text-sm text-gray-500">
        Enter the new user&apos;s account details below
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="profileId" className="mb-1.5 block text-sm font-medium text-gray-700">
            Profile ID
          </label>
          <input
            id="profileId"
            type="text"
            value={profileId}
            onChange={(event) => setProfileId(event.target.value)}
            placeholder="Enter profile ID"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div>
          <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter username"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div>
          <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">Select a role</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
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
