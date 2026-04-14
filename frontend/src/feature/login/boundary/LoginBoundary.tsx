'use client';

import { useState, type FormEvent } from 'react';
import { getApiUrl } from '@/lib/api';

type LoginBoundaryResult = {
  success: boolean;
  message: string;
  role?: string;
  username?: string;
};

type LoginStatus = {
  submitted: boolean;
  result: LoginBoundaryResult | null;
};

const initialStatus: LoginStatus = {
  submitted: false,
  result: null,
};

interface LoginBoundaryProps {
  onLoginSuccess?: (user: { email: string; username?: string; role?: string }) => void;
}

export default function LoginBoundary({ onLoginSuccess }: LoginBoundaryProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<LoginStatus>(initialStatus);

  function validateInput(email: string, password: string): boolean {
    if (!email.trim()) {
      displayError('Please enter your email.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      displayError('Please enter a valid email address.');
      return false;
    }

    if (!password.trim()) {
      displayError('Please enter your password.');
      return false;
    }

    return true;
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

  function displayLoginSuccess(username?: string, role?: string): void {
    setStatus({
      submitted: true,
      result: {
        success: true,
        message: 'Login successful.',
      },
    });
    onLoginSuccess?.({ email, username, role });
  }

  async function submitLogin(email: string, password: string): Promise<void> {
    setStatus((currentStatus) => ({
      ...currentStatus,
      submitted: true,
    }));

    if (!validateInput(email, password)) {
      return;
    }

    try {
      const response = await fetch(getApiUrl('/api/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as LoginBoundaryResult;
      if (response.ok && data.success) {
        if (data.role) {
          localStorage.setItem('userRole', data.role);
        }
        localStorage.setItem('userEmail', email);
        if (data.username) {
          localStorage.setItem('userUsername', data.username);
        }
        displayLoginSuccess(data.username, data.role);
        return;
      }

      displayError(data.message);
    } catch {
      displayError('Unable to connect to server.');
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void submitLogin(email, password);
  }

  const message = status.submitted && !status.result?.success ? status.result?.message : '';

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-xl">
      {/* Header */}
      <h2 className="text-center text-2xl font-bold text-gray-900">Sign in</h2>
      <p className="mt-2 text-center text-sm text-gray-500">
        Welcome back to FundRaise
      </p>

      {/* Login form */}
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
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
            placeholder="Enter your password"
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
          Log In
        </button>
      </form>

    </div>
  );
}
