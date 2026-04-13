'use client';

import { useState, type FormEvent } from 'react';

type ProfileResult = {
  success: boolean;
  message: string;
};

type ProfileStatus = {
  submitted: boolean;
  result: ProfileResult | null;
};

const initialStatus: ProfileStatus = {
  submitted: false,
  result: null,
};

export default function CreateProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<ProfileStatus>(initialStatus);

  function validateInput(name: string, email: string, phoneNum: string, address: string): boolean {
    if (!name.trim()) {
      displayError('Please enter a name.');
      return false;
    }

    if (!email.trim()) {
      displayError('Please enter an email.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      displayError('Please enter a valid email address.');
      return false;
    }

    if (!phoneNum.trim()) {
      displayError('Please enter a phone number.');
      return false;
    }

    if (!address.trim()) {
      displayError('Please enter an address.');
      return false;
    }

    return true;
  }

  function displaySuccess(): void {
    setStatus({
      submitted: true,
      result: {
        success: true,
        message: 'Profile created successfully.',
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

  async function submitProfile(name: string, email: string, phoneNum: string, address: string): Promise<void> {
    if (!validateInput(name, email, phoneNum, address)) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phoneNum, address }),
      });

      const data = (await response.json()) as ProfileResult;
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
    void submitProfile(name, email, phoneNum, address);
  }

  const message = status.submitted ? status.result?.message : '';
  const isSuccess = status.result?.success;

  if (isSuccess) {
    return (
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-8 py-10 text-center shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="mt-4 text-lg font-semibold text-gray-900">Profile created successfully.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-xl">
      <h2 className="text-center text-2xl font-bold text-gray-900">Create User Profile</h2>
      <p className="mt-2 text-center text-sm text-gray-500">
        Enter the new user&apos;s details below
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

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
          <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Enter address"
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
