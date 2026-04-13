import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
    onLoginSuccess: (user: { email: string; username?: string }) => void;
  }) {
    if (!open) {
      return null;
    }

    return (
      <button onClick={() => onLoginSuccess({ email: 'jason21888@naver.com', username: 'jason04' })}>
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

    expect(await screen.findByRole('button', { name: 'Open profile menu for jason04' })).toBeInTheDocument();
    return user;
  }

  it('shows the profile trigger with the username after login', async () => {
    const user = await logInThroughNavbar();
    const profileTrigger = screen.getByRole('button', { name: 'Open profile menu for jason04' });

    expect(profileTrigger).toHaveTextContent('J');
    expect(profileTrigger).toHaveTextContent('jason04');

    await user.hover(profileTrigger);

    expect(screen.getByRole('menu', { name: 'Profile menu' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Your impact' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Account settings' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toBeInTheDocument();
  });

  it('shows Sign In again after successful logout', async () => {
    logoutMock.mockResolvedValue(true);
    const user = await logInThroughNavbar();
    const profileTrigger = screen.getByRole('button', { name: 'Open profile menu for jason04' });

    fireEvent.focus(profileTrigger);
    fireEvent.mouseDown(screen.getByRole('menuitem', { name: 'Sign out' }));

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledTimes(1);
      expect(displayLoginPageMock).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Open profile menu for jason04' })).not.toBeInTheDocument();
  });

  it('keeps the user logged in when logout fails', async () => {
    logoutMock.mockResolvedValue(false);
    const user = await logInThroughNavbar();
    const profileTrigger = screen.getByRole('button', { name: 'Open profile menu for jason04' });

    fireEvent.focus(profileTrigger);
    fireEvent.mouseDown(screen.getByRole('menuitem', { name: 'Sign out' }));

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledTimes(1);
    });

    expect(displayLoginPageMock).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Open profile menu for jason04' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sign In' })).not.toBeInTheDocument();
  });
});
