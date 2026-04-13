import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateProfilePage from './CreateProfilePage';

type MockProfileResponse = {
  ok: boolean;
  json: () => Promise<{ success: boolean; message: string }>;
};

describe('CreateProfilePage', () => {
  const fetchMock = jest.fn<Promise<MockProfileResponse>, [RequestInfo | URL, RequestInit?]>();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('shows no message before submit', () => {
    render(<CreateProfilePage />);

    expect(screen.queryByText('Please enter a name.')).not.toBeInTheDocument();
    expect(screen.queryByText('Please enter an email.')).not.toBeInTheDocument();
    expect(screen.queryByText('Profile created successfully.')).not.toBeInTheDocument();
  });

  it('blocks submission when name is empty', async () => {
    const user = userEvent.setup();
    render(<CreateProfilePage />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Phone Number'), '0412345678');
    await user.type(screen.getByLabelText('Address'), '123 Test St');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please enter a name.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks submission when email is empty', async () => {
    const user = userEvent.setup();
    render(<CreateProfilePage />);

    await user.type(screen.getByLabelText('Name'), 'Test User');
    await user.type(screen.getByLabelText('Phone Number'), '0412345678');
    await user.type(screen.getByLabelText('Address'), '123 Test St');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please enter an email.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks submission when email format is invalid', async () => {
    const user = userEvent.setup();
    render(<CreateProfilePage />);

    await user.type(screen.getByLabelText('Name'), 'Test User');
    await user.type(screen.getByLabelText('Email'), 'user-at-mail.com');
    await user.type(screen.getByLabelText('Phone Number'), '0412345678');
    await user.type(screen.getByLabelText('Address'), '123 Test St');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks submission when phone number is empty', async () => {
    const user = userEvent.setup();
    render(<CreateProfilePage />);

    await user.type(screen.getByLabelText('Name'), 'Test User');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Address'), '123 Test St');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please enter a phone number.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks submission when address is empty', async () => {
    const user = userEvent.setup();
    render(<CreateProfilePage />);

    await user.type(screen.getByLabelText('Name'), 'Test User');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Phone Number'), '0412345678');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please enter an address.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows email already exists message from the backend', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        message: 'Email already exists.',
      }),
    });

    render(<CreateProfilePage />);

    await user.type(screen.getByLabelText('Name'), 'Existing User');
    await user.type(screen.getByLabelText('Email'), 'existing.user@example.com');
    await user.type(screen.getByLabelText('Phone Number'), '0412345678');
    await user.type(screen.getByLabelText('Address'), '123 Test St');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('Email already exists.')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('shows a network error when the backend is unavailable', async () => {
    const user = userEvent.setup();
    fetchMock.mockRejectedValue(new Error('Network failure'));

    render(<CreateProfilePage />);

    await user.type(screen.getByLabelText('Name'), 'New User');
    await user.type(screen.getByLabelText('Email'), 'new.user@example.com');
    await user.type(screen.getByLabelText('Phone Number'), '0498765432');
    await user.type(screen.getByLabelText('Address'), '456 Example Ave');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('Unable to connect to server.')).toBeInTheDocument();
  });

  it('sends the expected payload and shows success message', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Profile created successfully.',
      }),
    });

    render(<CreateProfilePage />);

    await user.type(screen.getByLabelText('Name'), 'New User');
    await user.type(screen.getByLabelText('Email'), 'new.user@example.com');
    await user.type(screen.getByLabelText('Phone Number'), '0498765432');
    await user.type(screen.getByLabelText('Address'), '456 Example Ave');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'New User',
          email: 'new.user@example.com',
          phoneNum: '0498765432',
          address: '456 Example Ave',
        }),
      });
    });

    expect(await screen.findByText('Profile created successfully.')).toBeInTheDocument();
  });
});
