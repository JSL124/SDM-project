import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginBoundary from './LoginBoundary';

type MockLoginResponse = {
  ok: boolean;
  json: () => Promise<{ success: boolean; message: string; role?: string; username?: string }>;
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

  it('shows account not found message from the backend', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        message: 'Account does not exist.',
      }),
    });

    render(<LoginBoundary />);

    await user.type(screen.getByLabelText('Email'), 'missing.fundraiser@example.com');
    await user.type(screen.getByLabelText('Password'), 'AnyPass123!');
    await user.click(screen.getByRole('button', { name: 'Log In' }));

    expect(await screen.findByText('Account does not exist.')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('shows invalid password message from the backend', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        message: 'Invalid password.',
      }),
    });

    render(<LoginBoundary />);

    await user.type(screen.getByLabelText('Email'), 'active.fundraiser@example.com');
    await user.type(screen.getByLabelText('Password'), 'WrongPassword!');
    await user.click(screen.getByRole('button', { name: 'Log In' }));

    expect(await screen.findByText('Invalid password.')).toBeInTheDocument();
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

  it('sends the expected payload and renders the dashboard on success', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Login successful.',
        role: 'Fundraiser',
        username: 'jason04',
      }),
    });

    render(<LoginBoundary />);

    await user.type(screen.getByLabelText('Email'), 'active.fundraiser@example.com');
    await user.type(screen.getByLabelText('Password'), 'Fundraiser123!');
    await user.click(screen.getByRole('button', { name: 'Log In' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'active.fundraiser@example.com',
          password: 'Fundraiser123!',
        }),
      });
    });

    expect(await screen.findByText('Redirecting to dashboard...')).toBeInTheDocument();
    expect(localStorage.getItem('userRole')).toBe('Fundraiser');
  });

  it('passes the returned username to the login success callback', async () => {
    const user = userEvent.setup();
    const onLoginSuccess = jest.fn();
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Login successful.',
        role: 'Fundraiser',
        username: 'jason04',
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
      });
    });
  });
});
