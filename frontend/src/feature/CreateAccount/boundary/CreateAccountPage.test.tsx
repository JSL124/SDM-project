import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateAccountPage from './CreateAccountPage';
import { getApiUrl } from '@/lib/api';

type MockAccountResponse = {
  ok: boolean;
  json: () => Promise<{ success: boolean; message: string }>;
};

describe('CreateAccountPage', () => {
  const fetchMock = jest.fn<Promise<MockAccountResponse>, [RequestInfo | URL, RequestInit?]>();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
    localStorage.clear();
  });

  async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText('Email'), 'new.user@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.type(screen.getByLabelText('Name'), 'New User');
    await user.type(screen.getByLabelText('DOB'), '1998-01-01');
    await user.type(screen.getByLabelText('Phone Number'), '0498765432');
    await user.type(screen.getByLabelText('Profile ID'), '1');
  }

  it('shows no status message before submit', () => {
    render(<CreateAccountPage />);

    expect(screen.queryByText('Please enter an email.')).not.toBeInTheDocument();
    expect(screen.queryByText('User Account exists.')).not.toBeInTheDocument();
    expect(screen.queryByText('Account Created')).not.toBeInTheDocument();
  });

  it('shows the create account form', () => {
    render(<CreateAccountPage />);

    expect(screen.getByText('Create User Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('DOB')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Profile ID')).toBeInTheDocument();
  });

  it('sends the entered payload without client-side validation', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        message: 'User Account exists.',
      }),
    });
    render(<CreateAccountPage />);

    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(getApiUrl('/api/account'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'not-an-email',
          password: '',
          name: '',
          DOB: '',
          phoneNum: '',
          profileId: '',
        }),
      });
    });
  });

  it('shows success message on successful account creation', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Account created successfully.',
      }),
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
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        message: 'User Account exists.',
      }),
    });

    render(<CreateAccountPage />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('User Account exists.')).toBeInTheDocument();
  });

  it('shows network error when server is unavailable', async () => {
    const user = userEvent.setup();
    fetchMock.mockRejectedValue(new Error('Network failure'));

    render(<CreateAccountPage />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('Unable to connect to server.')).toBeInTheDocument();
  });
});
