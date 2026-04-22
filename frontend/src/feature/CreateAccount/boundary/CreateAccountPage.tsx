'use client';

import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';

type AccountResult = {
  success: boolean;
  message: string;
};

type AccountStatus = {
  submitted: boolean;
  result: AccountResult | null;
};

type ProfileOption = {
  profileId: string;
  role: string;
  description: string;
};

const initialStatus: AccountStatus = {
  submitted: false,
  result: null,
};

export default function CreateAccountPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [DOB, setDOB] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [profileId, setProfileId] = useState('');
  const [profiles, setProfiles] = useState<ProfileOption[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [profilesError, setProfilesError] = useState('');
  const [status, setStatus] = useState<AccountStatus>(initialStatus);

  const isSuccess = status.result?.success;

  useEffect(() => {
    let isMounted = true;

    async function loadProfiles() {
      try {
        const response = await fetch(getApiUrl('/api/profile'));
        if (!response.ok) {
          throw new Error('Unable to load profiles');
        }

        const data = (await response.json()) as ProfileOption[];
        if (isMounted) {
          setProfiles(data);
          setProfilesError('');
        }
      } catch {
        if (isMounted) {
          setProfilesError('Unable to load profiles.');
        }
      } finally {
        if (isMounted) {
          setProfilesLoading(false);
        }
      }
    }

    void loadProfiles();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const message = status.submitted ? status.result?.message : '';

  if (isSuccess) {
    return (
      <div>
        <div className="mx-auto w-full max-w-lg rounded-3xl bg-white px-10 py-14 text-center shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="mt-6 text-2xl font-bold text-gray-900">Account Created</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-xl">
      <h2 className="text-center text-2xl font-bold text-gray-900">Create User Account</h2>
      <p className="mt-2 text-center text-sm text-gray-500">
        Enter the new user account details below
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void (async () => {
            try {
              const response = await fetch(getApiUrl('/api/account'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name, DOB, phoneNum, profileId }),
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
          })();
        }}
        className="mt-6 flex flex-col gap-4"
      >
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter email"
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
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter name"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div>
          <label htmlFor="DOB" className="mb-1.5 block text-sm font-medium text-gray-700">
            DOB
          </label>
          <input
            id="DOB"
            type="text"
            value={DOB}
            onChange={(event) => setDOB(event.target.value)}
            placeholder="Enter DOB"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div>
          <label htmlFor="phoneNum" className="mb-1.5 block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            id="phoneNum"
            type="text"
            value={phoneNum}
            onChange={(event) => setPhoneNum(event.target.value)}
            placeholder="Enter phone number"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div>
          <label htmlFor="profileId" className="mb-1.5 block text-sm font-medium text-gray-700">
            Profile
          </label>
          <select
            id="profileId"
            value={profileId}
            onChange={(event) => setProfileId(event.target.value)}
            disabled={profilesLoading}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">
              {profilesLoading ? 'Loading profiles...' : 'Select profile'}
            </option>
            {profiles.map((profile) => (
              <option key={profile.profileId} value={profile.profileId}>
                {profile.role}
              </option>
            ))}
          </select>
          {profilesError ? (
            <p className="mt-2 text-sm text-red-600">{profilesError}</p>
          ) : null}
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
