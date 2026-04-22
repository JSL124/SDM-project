import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateProfilePage from './CreateProfilePage';
import { getApiUrl } from '@/lib/api';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

type MockProfileResponse = {
  ok: boolean;
  json: () => Promise<{ role: string; description: string } | null>;
};

describe('CreateProfilePage', () => {
  const fetchMock = jest.fn<Promise<MockProfileResponse>, [RequestInfo | URL, RequestInit?]>();

  beforeEach(() => {
    fetchMock.mockReset();
    mockPush.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
    localStorage.clear();
    localStorage.setItem('userRole', 'User admin');
  });

  it('shows access denied when user is not User admin', () => {
    localStorage.setItem('userRole', 'Fundraiser');
    render(<CreateProfilePage />);

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText('Only User Admins can create profiles.')).toBeInTheDocument();
  });

  it('shows no message before submit', () => {
    render(<CreateProfilePage />);

    expect(screen.queryByText('Please enter a role.')).not.toBeInTheDocument();
    expect(screen.queryByText('Please enter a description.')).not.toBeInTheDocument();
    expect(screen.queryByText('Profile created successfully.')).not.toBeInTheDocument();
  });

  it('blocks submission when role is empty', async () => {
    const user = userEvent.setup();
    render(<CreateProfilePage />);

    await user.type(screen.getByLabelText('Description'), 'Creates fundraising activities');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please enter a role.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks submission when description is empty', async () => {
    const user = userEvent.setup();
    render(<CreateProfilePage />);

    await user.type(screen.getByLabelText('Role'), 'Fundraiser');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please enter a description.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows a network error when the backend is unavailable', async () => {
    const user = userEvent.setup();
    fetchMock.mockRejectedValue(new Error('Network failure'));

    render(<CreateProfilePage />);

    await user.type(screen.getByLabelText('Role'), 'Fundraiser');
    await user.type(screen.getByLabelText('Description'), 'Creates fundraising activities');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('Unable to connect to server.')).toBeInTheDocument();
  });

  it('sends the expected payload and shows success message', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        role: 'Fundraiser',
        description: 'Creates fundraising activities',
      }),
    });

    render(<CreateProfilePage />);

    await user.type(screen.getByLabelText('Role'), 'Fundraiser');
    await user.type(screen.getByLabelText('Description'), 'Creates fundraising activities');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(getApiUrl('/api/profile'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'Fundraiser',
          description: 'Creates fundraising activities',
        }),
      });
    });

    expect(await screen.findByText('Profile created successfully.')).toBeInTheDocument();
  });

  it('redirects to create account after profile creation success animation ends', async () => {
    const requestAnimationFrameSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(() => 0);
    const user = userEvent.setup();
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        role: 'Fundraiser',
        description: 'Creates fundraising activities',
      }),
    });

    render(<CreateProfilePage />);

    await user.type(screen.getByLabelText('Role'), 'Fundraiser');
    await user.type(screen.getByLabelText('Description'), 'Creates fundraising activities');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    fireEvent.transitionEnd(await screen.findByText('Profile created successfully.'));

    expect(mockPush).toHaveBeenCalledWith('/admin/create-account');
    requestAnimationFrameSpy.mockRestore();
  });

  it('shows an error when profile creation returns null', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => null,
    });

    render(<CreateProfilePage />);

    await user.type(screen.getByLabelText('Role'), 'Fundraiser');
    await user.type(screen.getByLabelText('Description'), 'Creates fundraising activities');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('Failed to create profile.')).toBeInTheDocument();
  });
});
