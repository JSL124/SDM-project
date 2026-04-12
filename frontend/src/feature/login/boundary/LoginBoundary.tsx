'use client';

import { useState, type FormEvent } from 'react';

type LoginBoundaryResult = {
  success: boolean;
  message: string;
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
  onLoginSuccess?: (email: string) => void;
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

  function displayDashboard(): void {
    setStatus({
      submitted: true,
      result: {
        success: true,
        message: 'Login successful.',
      },
    });
    onLoginSuccess?.(email);
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
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as LoginBoundaryResult;
      if (response.ok && data.success) {
        displayDashboard();
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

  const message = status.submitted ? status.result?.message : '';

  if (status.result?.success) {
    return (
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-8 py-10 text-center shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="mt-4 text-lg font-semibold text-gray-900">Login successful.</p>
        <p className="mt-2 text-sm text-gray-500">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-xl">
      {/* Header */}
      <h2 className="text-center text-2xl font-bold text-gray-900">Sign in</h2>
      <p className="mt-2 text-center text-sm text-gray-500">
        Welcome back to FundRaise
      </p>

      {/* Social login buttons */}
      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Continue with Facebook
        </button>
      </div>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs font-medium uppercase text-gray-400">or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Login form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        <div className="text-right">
          <a href="#" className="text-sm font-medium text-brand hover:text-brand-hover">
            Forgot password?
          </a>
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

      {/* Sign up link */}
      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <a href="#" className="font-medium text-brand hover:text-brand-hover">
          Sign up
        </a>
      </p>
    </div>
  );
}
