import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from './Navbar';
import { displayLoginPage, logout } from '@/feature/logout/boundary/LogoutBoundary';

jest.mock('@/feature/logout/boundary/LogoutBoundary', () => ({
  logout: jest.fn(),
  displayLoginPage: jest.fn(),
}));

jest.mock('@/components/ui/LoginModal', () => ({
  __esModule: true,
  default: function MockLoginModal({
    open,
    onLoginSuccess,
  }: {
    open: boolean;
    onLoginSuccess: (email: string) => void;
  }) {
    if (!open) {
      return null;
    }

    return (
      <button onClick={() => onLoginSuccess('active.fundraiser@example.com')}>
        Complete Mock Login
      </button>
    );
  },
}));

const logoutMock = logout as jest.MockedFunction<typeof logout>;
const displayLoginPageMock = displayLoginPage as jest.MockedFunction<typeof displayLoginPage>;

describe('Navbar', () => {
  beforeEach(() => {
    logoutMock.mockReset();
    displayLoginPageMock.mockReset();
    displayLoginPageMock.mockImplementation((clearUser) => clearUser());
  });

  async function logInThroughNavbar() {
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByRole('button', { name: 'Sign In' }));
    await user.click(screen.getByRole('button', { name: 'Complete Mock Login' }));

    expect(await screen.findByRole('button', { name: 'Logout' })).toBeInTheDocument();
    return user;
  }

  it('shows Sign In again after successful logout', async () => {
    logoutMock.mockResolvedValue(true);
    const user = await logInThroughNavbar();

    await user.click(screen.getByRole('button', { name: 'Logout' }));

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledTimes(1);
      expect(displayLoginPageMock).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
  });

  it('keeps the user logged in when logout fails', async () => {
    logoutMock.mockResolvedValue(false);
    const user = await logInThroughNavbar();

    await user.click(screen.getByRole('button', { name: 'Logout' }));

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledTimes(1);
    });

    expect(displayLoginPageMock).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sign In' })).not.toBeInTheDocument();
  });
});
