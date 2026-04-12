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

export default function LoginBoundary() {
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
      <div className="mx-auto mb-12 w-full max-w-lg rounded-2xl border border-white/30 bg-black/60 px-10 py-12 text-center shadow-2xl backdrop-blur-2xl">
        <p className="text-lg font-semibold text-white">Login successful.</p>
        <p className="mt-2 text-sm text-white/70">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mb-12 w-full max-w-lg rounded-2xl border border-white/30 bg-black/60 px-10 py-12 shadow-2xl backdrop-blur-2xl">
      <h2 className="mb-8 text-center text-3xl font-bold text-white">Log In</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/80">
            Email
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-5 py-4 text-lg text-white placeholder-white/40 focus:border-white/50 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-white/80">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-5 py-4 text-lg text-white placeholder-white/40 focus:border-white/50 focus:outline-none"
          />
        </div>

        {message ? <p className="text-sm text-red-400">{message}</p> : null}

        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-white py-4 text-lg font-semibold text-black transition-colors hover:bg-white/90"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
