import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginBoundary from './LoginBoundary';
import { getApiUrl } from '@/lib/api';

type MockLoginResponse = {
  ok: boolean;
  json: () => Promise<{
    success: boolean;
    message: string;
    user?: {
      email: string;
      username?: string;
      role?: string;
    };
  }>;
};

describe('LoginBoundary', () => {
  const fetchMock = jest.fn<Promise<MockLoginResponse>, [RequestInfo | URL, RequestInit?]>();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
    localStorage.clear();
  });

  it('shows no message before submit', () => {
    render(<LoginBoundary />);

    expect(screen.queryByText('Please enter your email.')).not.toBeInTheDocument();
    expect(screen.queryByText('Please enter a valid email address.')).not.toBeInTheDocument();
    expect(screen.queryByText('Please enter your password.')).not.toBeInTheDocument();
    expect(screen.queryByText('Login successful.')).not.toBeInTheDocument();
    expect(screen.queryByText('Forgot password?')).not.toBeInTheDocument();
    expect(screen.queryByText("Don't have an account?")).not.toBeInTheDocument();
    expect(screen.queryByText('Sign up')).not.toBeInTheDocument();
  });

  it('blocks submission when email is empty', async () => {
    const user = userEvent.setup();
    render(<LoginBoundary />);

    await user.type(screen.getByLabelText('Password'), 'Fundraiser123!');
    await user.click(screen.getByRole('button', { name: 'Log In' }));

    expect(screen.getByText('Please enter your email.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks submission when email format is invalid', async () => {
    const user = userEvent.setup();
    render(<LoginBoundary />);

    await user.type(screen.getByLabelText('Email'), 'fundraiser-at-mail.com');
    await user.type(screen.getByLabelText('Password'), 'Fundraiser123!');
    await user.click(screen.getByRole('button', { name: 'Log In' }));

    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks submission when password is empty', async () => {
    const user = userEvent.setup();
    render(<LoginBoundary />);

    await user.type(screen.getByLabelText('Email'), 'active.fundraiser@example.com');
    await user.click(screen.getByRole('button', { name: 'Log In' }));

    expect(screen.getByText('Please enter your password.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows invalid credential message from the backend', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        message: 'Invalid email or password.',
      }),
    });

    render(<LoginBoundary />);

    await user.type(screen.getByLabelText('Email'), 'missing.fundraiser@example.com');
    await user.type(screen.getByLabelText('Password'), 'AnyPass123!');
    await user.click(screen.getByRole('button', { name: 'Log In' }));

    expect(await screen.findByText('Invalid email or password.')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('shows a network error when the backend is unavailable', async () => {
    const user = userEvent.setup();
    fetchMock.mockRejectedValue(new Error('Network failure'));

    render(<LoginBoundary />);

    await user.type(screen.getByLabelText('Email'), 'active.fundraiser@example.com');
    await user.type(screen.getByLabelText('Password'), 'Fundraiser123!');
    await user.click(screen.getByRole('button', { name: 'Log In' }));

    expect(await screen.findByText('Unable to connect to server.')).toBeInTheDocument();
  });

  it('sends the expected payload without rendering an inline success screen', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Login successful.',
        user: {
          email: 'active.fundraiser@example.com',
          username: 'active-user',
          role: 'User admin',
        },
      }),
    });

    render(<LoginBoundary />);

    await user.type(screen.getByLabelText('Email'), 'active.fundraiser@example.com');
    await user.type(screen.getByLabelText('Password'), 'Fundraiser123!');
    await user.click(screen.getByRole('button', { name: 'Log In' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(getApiUrl('/api/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'active.fundraiser@example.com',
          password: 'Fundraiser123!',
        }),
      });
    });

    await waitFor(() => {
      expect(screen.queryByText('Login successful.')).not.toBeInTheDocument();
      expect(screen.queryByText('Redirecting to dashboard...')).not.toBeInTheDocument();
    });
    expect(localStorage.getItem('userEmail')).toBe('active.fundraiser@example.com');
    expect(localStorage.getItem('userUsername')).toBe('active-user');
    expect(localStorage.getItem('userRole')).toBe('User admin');
  });

  it('passes the logged-in user to the login success callback', async () => {
    const user = userEvent.setup();
    const onLoginSuccess = jest.fn();
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Login successful.',
        user: {
          email: 'jason21888@naver.com',
          username: 'jason04',
          role: 'User admin',
        },
      }),
    });

    render(<LoginBoundary onLoginSuccess={onLoginSuccess} />);

    await user.type(screen.getByLabelText('Email'), 'jason21888@naver.com');
    await user.type(screen.getByLabelText('Password'), 'Fundraiser123!');
    await user.click(screen.getByRole('button', { name: 'Log In' }));

    await waitFor(() => {
      expect(onLoginSuccess).toHaveBeenCalledWith({
        email: 'jason21888@naver.com',
        username: 'jason04',
        role: 'User admin',
      });
    });
  });
});
