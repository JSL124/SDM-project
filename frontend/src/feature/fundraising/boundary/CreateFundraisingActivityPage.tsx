'use client';

import { useState, useEffect, useSyncExternalStore, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api';

function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getIsAuthorized(): boolean {
  return localStorage.getItem('userRole') === 'Fundraiser';
}

type ActivityResult = {
  success: boolean;
  message: string;
};

type ActivityStatus = {
  submitted: boolean;
  result: ActivityResult | null;
};

export default function CreateFundraisingActivityPage() {
  const router = useRouter();
  const authorized = useSyncExternalStore(subscribeToStorage, getIsAuthorized, () => false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<ActivityStatus>({
    submitted: false,
    result: null,
  });
  const [successVisible, setSuccessVisible] = useState(false);

  const isSuccess = status.result?.success;
  const message = status.submitted ? status.result?.message : '';

  useEffect(() => {
    if (!isSuccess) return;
    requestAnimationFrame(() => setSuccessVisible(true));
    const timer = setTimeout(() => setSuccessVisible(false), 2000);
    return () => clearTimeout(timer);
  }, [isSuccess]);

  function handleSuccessExit() {
    if (!successVisible && isSuccess) {
      router.push('/fundraiser/manage-activities');
    }
  }

  function displayFundraisingActivityConfirmation(): void {
    setStatus({
      submitted: true,
      result: {
        success: true,
        message: 'Fundraising activity created successfully.',
      },
    });
  }

  function displayFundraisingActivityValidationError(errorMessage: string): void {
    setStatus({
      submitted: true,
      result: {
        success: false,
        message: errorMessage,
      },
    });
  }

  function validateFundraisingActivity(
    title: string,
    description: string,
    targetAmount: string,
    category: string,
    startDate: string,
    endDate: string,
  ): boolean {
    if (!title.trim()) {
      displayFundraisingActivityValidationError('Please enter a title.');
      return false;
    }
    if (!description.trim()) {
      displayFundraisingActivityValidationError('Please enter a description.');
      return false;
    }
    if (!targetAmount.trim() || Number(targetAmount) <= 0) {
      displayFundraisingActivityValidationError('Please enter a target amount greater than zero.');
      return false;
    }
    if (!category.trim()) {
      displayFundraisingActivityValidationError('Please enter a category.');
      return false;
    }
    if (!startDate.trim()) {
      displayFundraisingActivityValidationError('Please enter a start date.');
      return false;
    }
    if (!endDate.trim()) {
      displayFundraisingActivityValidationError('Please enter an end date.');
      return false;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      displayFundraisingActivityValidationError('End date must be after start date.');
      return false;
    }
    return true;
  }

  async function submitFundraisingActivityForm(
    title: string,
    description: string,
    targetAmount: string,
    category: string,
    startDate: string,
    endDate: string,
  ): Promise<void> {
    if (!validateFundraisingActivity(title, description, targetAmount, category, startDate, endDate)) {
      return;
    }

    try {
      const response = await fetch(getApiUrl('/api/fundraising-activity'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          targetAmount: Number(targetAmount),
          category,
          startDate,
          endDate,
        }),
      });

      const data = (await response.json()) as ActivityResult;
      if (response.ok && data.success) {
        displayFundraisingActivityConfirmation();
        return;
      }

      displayFundraisingActivityValidationError(data.message);
    } catch {
      displayFundraisingActivityValidationError('Unable to connect to server.');
    }
  }

  function closeFundraisingActivityForm(): void {
    router.push('/fundraiser/manage-activities');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void submitFundraisingActivityForm(title, description, targetAmount, category, startDate, endDate);
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
        <p className="mt-2 text-sm text-gray-500">Only Fundraisers can create fundraising activities.</p>
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
        onTransitionEnd={handleSuccessExit}
      >
        <div className="mx-auto w-full max-w-lg rounded-3xl bg-white px-10 py-14 text-center shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="mt-6 text-2xl font-bold text-gray-900">{message}</p>
          <p className="mt-2 text-sm text-gray-500">Redirecting to management page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl bg-white px-8 py-10 shadow-xl">
      <h2 className="text-center text-2xl font-bold text-gray-900">Create Fundraising Activity</h2>
      <p className="mt-2 text-center text-sm text-gray-500">Fill in the details for the new fundraising activity</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter title"
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
            rows={3}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div>
          <label htmlFor="targetAmount" className="mb-1.5 block text-sm font-medium text-gray-700">
            Target Amount ($)
          </label>
          <input
            id="targetAmount"
            type="number"
            min="0"
            step="0.01"
            value={targetAmount}
            onChange={(event) => setTargetAmount(event.target.value)}
            placeholder="Enter target amount"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Enter category"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div>
          <label htmlFor="startDate" className="mb-1.5 block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="mb-1.5 block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {message ? (
          <div className="rounded-lg bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">{message}</p>
          </div>
        ) : null}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={closeFundraisingActivityForm}
            className="w-full rounded-lg border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full rounded-lg bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
