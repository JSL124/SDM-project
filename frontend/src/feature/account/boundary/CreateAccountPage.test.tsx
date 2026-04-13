import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateAccountPage from './CreateAccountPage';
import { getApiUrl } from '@/lib/api';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

type MockAccountResponse = {
  ok: boolean;
  json: () => Promise<{ success: boolean; message: string }>;
};

describe('CreateAccountPage', () => {
  const fetchMock = jest.fn<Promise<MockAccountResponse>, [RequestInfo | URL, RequestInit?]>();

  beforeEach(() => {
    fetchMock.mockReset();
    mockPush.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
    localStorage.clear();
    localStorage.setItem('userRole', 'User admin');
  });

  it('shows no status message before submit', () => {
    render(<CreateAccountPage />);

    expect(screen.queryByText('Please enter a profile ID.')).not.toBeInTheDocument();
    expect(screen.queryByText('Username already exists.')).not.toBeInTheDocument();
    expect(screen.queryByText('Account Created')).not.toBeInTheDocument();
  });

  it('shows access denied when user is not User admin', () => {
    localStorage.setItem('userRole', 'Fundraiser');
    render(<CreateAccountPage />);

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText('Only User Admins can create accounts.')).toBeInTheDocument();
    expect(screen.queryByText('Create User Account')).not.toBeInTheDocument();
  });

  it('shows the form when user is User admin', () => {
    render(<CreateAccountPage />);

    expect(screen.getByText('Create User Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Profile ID')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
  });

  it('blocks submission when profile ID is empty', async () => {
    const user = userEvent.setup();
    render(<CreateAccountPage />);

    await user.type(screen.getByLabelText('Username'), 'newuser');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.selectOptions(screen.getByLabelText('Role'), 'Fundraiser');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please enter a profile ID.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks submission when username is empty', async () => {
    const user = userEvent.setup();
    render(<CreateAccountPage />);

    await user.type(screen.getByLabelText('Profile ID'), '1');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.selectOptions(screen.getByLabelText('Role'), 'Fundraiser');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please enter a username.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks submission when password is empty', async () => {
    const user = userEvent.setup();
    render(<CreateAccountPage />);

    await user.type(screen.getByLabelText('Profile ID'), '1');
    await user.type(screen.getByLabelText('Username'), 'newuser');
    await user.selectOptions(screen.getByLabelText('Role'), 'Fundraiser');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please enter a password.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks submission when role is not selected', async () => {
    const user = userEvent.setup();
    render(<CreateAccountPage />);

    await user.type(screen.getByLabelText('Profile ID'), '1');
    await user.type(screen.getByLabelText('Username'), 'newuser');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please select a role.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks submission when profile ID is whitespace only', async () => {
    const user = userEvent.setup();
    render(<CreateAccountPage />);

    await user.type(screen.getByLabelText('Profile ID'), '   ');
    await user.type(screen.getByLabelText('Username'), 'newuser');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.selectOptions(screen.getByLabelText('Role'), 'Fundraiser');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please enter a profile ID.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows success message on successful account creation', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Account Created',
      }),
    });

    render(<CreateAccountPage />);

    await user.type(screen.getByLabelText('Profile ID'), '1');
    await user.type(screen.getByLabelText('Username'), 'newuser');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.selectOptions(screen.getByLabelText('Role'), 'Fundraiser');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('Account Created')).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(getApiUrl('/api/account'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: '1',
          username: 'newuser',
          password: 'Password123!',
          role: 'Fundraiser',
        }),
      });
    });
  });

  it('shows error message when username already exists', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        message: 'Username already exists.',
      }),
    });

    render(<CreateAccountPage />);

    await user.type(screen.getByLabelText('Profile ID'), '1');
    await user.type(screen.getByLabelText('Username'), 'existinguser');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.selectOptions(screen.getByLabelText('Role'), 'Donee');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('Username already exists.')).toBeInTheDocument();
  });

  it('shows error message when profile is not found', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        message: 'Profile not found.',
      }),
    });

    render(<CreateAccountPage />);

    await user.type(screen.getByLabelText('Profile ID'), '999');
    await user.type(screen.getByLabelText('Username'), 'newuser');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.selectOptions(screen.getByLabelText('Role'), 'Donee');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('Profile not found.')).toBeInTheDocument();
  });

  it('shows network error when server is unavailable', async () => {
    const user = userEvent.setup();
    fetchMock.mockRejectedValue(new Error('Network failure'));

    render(<CreateAccountPage />);

    await user.type(screen.getByLabelText('Profile ID'), '1');
    await user.type(screen.getByLabelText('Username'), 'newuser');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.selectOptions(screen.getByLabelText('Role'), 'Platform manager');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('Unable to connect to server.')).toBeInTheDocument();
  });
});
