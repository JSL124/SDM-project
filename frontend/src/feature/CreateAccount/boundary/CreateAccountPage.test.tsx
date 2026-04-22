import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateAccountPage from './CreateAccountPage';
import { getApiUrl } from '@/lib/api';

type MockAccountResponse = {
  success: boolean;
  message: string;
};

type MockProfileResponse = {
  profileId: string;
  role: string;
  description: string;
};

type MockFetchResponse = {
  ok: boolean;
  json: () => Promise<MockAccountResponse | MockProfileResponse[]>;
};

describe('CreateAccountPage', () => {
  const profiles: MockProfileResponse[] = [
    { profileId: '1', role: 'Donee', description: 'Receives donations' },
    { profileId: '2', role: 'Fundraiser', description: 'Creates fundraising activities' },
    { profileId: '3', role: 'User admin', description: 'Manages user accounts' },
    { profileId: '4', role: 'Platform manager', description: 'Manages platform operations' },
  ];
  const fetchMock = jest.fn<Promise<MockFetchResponse>, [RequestInfo | URL, RequestInit?]>();

  beforeEach(() => {
    fetchMock.mockReset();
    mockFetchResponses();
    global.fetch = fetchMock as unknown as typeof fetch;
    localStorage.clear();
  });

  function mockFetchResponses({
    profileOk = true,
    profileResponse = profiles,
    accountOk = true,
    accountResponse = {
      success: true,
      message: 'Account created successfully.',
    },
    rejectAccount = false,
  }: {
    profileOk?: boolean;
    profileResponse?: MockProfileResponse[];
    accountOk?: boolean;
    accountResponse?: MockAccountResponse;
    rejectAccount?: boolean;
  } = {}) {
    fetchMock.mockImplementation(async (input) => {
      if (String(input) === getApiUrl('/api/profile')) {
        return {
          ok: profileOk,
          json: async () => profileResponse,
        };
      }

      if (rejectAccount) {
        throw new Error('Network failure');
      }

      return {
        ok: accountOk,
        json: async () => accountResponse,
      };
    });
  }

  function getAccountRequests() {
    return fetchMock.mock.calls.filter(([input]) => String(input) === getApiUrl('/api/account'));
  }

  function formatDateInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getTodayDateString(): string {
    return formatDateInputValue(new Date());
  }

  function getLatestAllowedDobDateString(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return formatDateInputValue(yesterday);
  }

  async function fillValidForm(user: ReturnType<typeof userEvent.setup>, DOB = '1998-01-01') {
    await user.type(screen.getByLabelText('Email'), 'new.user@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.type(screen.getByLabelText('Name'), 'New User');
    fireEvent.change(screen.getByLabelText('DOB'), { target: { value: DOB } });
    await user.type(screen.getByLabelText('Phone Number'), '0498765432');
    await screen.findByRole('option', { name: 'Donee' });
    await user.selectOptions(screen.getByLabelText('Profile'), '1');
  }

  it('shows no status message before submit', async () => {
    render(<CreateAccountPage />);

    await screen.findByRole('option', { name: 'Donee' });

    expect(screen.queryByText('Please enter an email.')).not.toBeInTheDocument();
    expect(screen.queryByText('User Account exists.')).not.toBeInTheDocument();
    expect(screen.queryByText('Account Created')).not.toBeInTheDocument();
  });

  it('shows the create account form', async () => {
    render(<CreateAccountPage />);

    await screen.findByRole('option', { name: 'Donee' });

    expect(screen.getByText('Create User Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('DOB')).toBeInTheDocument();
    expect(screen.getByLabelText('DOB')).toHaveAttribute('type', 'date');
    expect(screen.getByLabelText('DOB')).toHaveAttribute('max', getLatestAllowedDobDateString());
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Profile')).toBeInTheDocument();
  });

  it('blocks submission when email format is invalid', async () => {
    const user = userEvent.setup();
    render(<CreateAccountPage />);

    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(getAccountRequests()).toHaveLength(0);
  });

  it('blocks submission when required fields are empty', async () => {
    const user = userEvent.setup();
    render(<CreateAccountPage />);

    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please enter an email.')).toBeInTheDocument();
    expect(getAccountRequests()).toHaveLength(0);
  });

  it('blocks submission when DOB is empty', async () => {
    const user = userEvent.setup();
    render(<CreateAccountPage />);

    await user.type(screen.getByLabelText('Email'), 'new.user@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.type(screen.getByLabelText('Name'), 'New User');
    await user.type(screen.getByLabelText('Phone Number'), '0498765432');
    await screen.findByRole('option', { name: 'Donee' });
    await user.selectOptions(screen.getByLabelText('Profile'), '1');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please enter a DOB.')).toBeInTheDocument();
    expect(getAccountRequests()).toHaveLength(0);
  });

  it('blocks submission when DOB is today', async () => {
    const user = userEvent.setup();
    render(<CreateAccountPage />);

    await fillValidForm(user, getTodayDateString());
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please select a DOB before today.')).toBeInTheDocument();
    expect(getAccountRequests()).toHaveLength(0);
  });

  it('blocks submission when profile is not selected', async () => {
    const user = userEvent.setup();
    render(<CreateAccountPage />);

    await user.type(screen.getByLabelText('Email'), 'new.user@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.type(screen.getByLabelText('Name'), 'New User');
    fireEvent.change(screen.getByLabelText('DOB'), { target: { value: '1998-01-01' } });
    await user.type(screen.getByLabelText('Phone Number'), '0498765432');
    await screen.findByRole('option', { name: 'Donee' });
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please select a profile.')).toBeInTheDocument();
    expect(getAccountRequests()).toHaveLength(0);
  });

  it('loads profile options for the dropdown', async () => {
    render(<CreateAccountPage />);

    expect(fetchMock).toHaveBeenCalledWith(getApiUrl('/api/profile'));
    expect(await screen.findByRole('option', { name: 'Donee' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Fundraiser' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'User admin' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Platform manager' })).toBeInTheDocument();
  });

  it('shows a loading profile placeholder while profiles load', () => {
    fetchMock.mockImplementation(
      () =>
        new Promise<MockFetchResponse>(() => {
          // Keep the request pending so the loading state remains visible.
        })
    );

    render(<CreateAccountPage />);

    expect(screen.getByRole('option', { name: 'Loading profiles...' })).toBeInTheDocument();
    expect(screen.getByLabelText('Profile')).toBeDisabled();
  });

  it('shows success message on successful account creation', async () => {
    const user = userEvent.setup();
    mockFetchResponses({
      accountOk: true,
      accountResponse: {
        success: true,
        message: 'Account created successfully.',
      },
    });

    render(<CreateAccountPage />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('Account Created')).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(getApiUrl('/api/account'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'new.user@example.com',
          password: 'Password123!',
          name: 'New User',
          DOB: '1998-01-01',
          phoneNum: '0498765432',
          profileId: '1',
        }),
      });
    });
  });

  it('shows error message when user account exists', async () => {
    const user = userEvent.setup();
    mockFetchResponses({
      accountOk: false,
      accountResponse: {
        success: false,
        message: 'User Account exists.',
      },
    });

    render(<CreateAccountPage />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('User Account exists.')).toBeInTheDocument();
  });

  it('shows network error when server is unavailable', async () => {
    const user = userEvent.setup();
    mockFetchResponses({ rejectAccount: true });

    render(<CreateAccountPage />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('Unable to connect to server.')).toBeInTheDocument();
  });

  it('shows profile loading error when profiles cannot be loaded', async () => {
    mockFetchResponses({ profileOk: false });

    render(<CreateAccountPage />);

    expect(await screen.findByText('Unable to load profiles.')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Select profile' })).toBeInTheDocument();
  });
});
