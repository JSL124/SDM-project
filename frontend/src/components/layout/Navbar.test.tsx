import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from './Navbar';
import { displayLoginPage, logout } from '@/feature/logout/boundary/LogoutBoundary';

const pushMock = jest.fn();

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
    onLoginSuccess: (user: { email: string; username?: string; role?: string }) => void;
  }) {
    if (!open) {
      return null;
    }

    return (
      <>
        <button onClick={() => onLoginSuccess({ email: 'jason21888@naver.com', username: 'jason04', role: 'User admin' })}>
          Complete Mock Admin Login
        </button>
        <button onClick={() => onLoginSuccess({ email: 'jason21888@naver.com', username: 'jason04', role: 'Fundraiser' })}>
          Complete Mock User Login
        </button>
      </>
    );
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: function MockLink({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const logoutMock = logout as jest.MockedFunction<typeof logout>;
const displayLoginPageMock = displayLoginPage as jest.MockedFunction<typeof displayLoginPage>;

describe('Navbar', () => {
  beforeEach(() => {
    logoutMock.mockReset();
    displayLoginPageMock.mockReset();
    pushMock.mockReset();
    displayLoginPageMock.mockImplementation((clearUser) => clearUser());
  });

  async function logInThroughNavbar(role: 'User admin' | 'Fundraiser' = 'User admin') {
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByRole('button', { name: 'Sign In' }));
    await user.click(screen.getByRole('button', { name: role === 'User admin' ? 'Complete Mock Admin Login' : 'Complete Mock User Login' }));

    expect(await screen.findByRole('button', { name: 'Open profile menu for jason04' })).toBeInTheDocument();
    return user;
  }

  it('shows the profile trigger with the username after login', async () => {
    const user = await logInThroughNavbar();
    const profileTrigger = screen.getByRole('button', { name: 'Open profile menu for jason04' });

    expect(screen.getByText('You have successfully signed in to FundRaise.')).toBeInTheDocument();
    expect(profileTrigger).toHaveTextContent('J');
    expect(profileTrigger).toHaveTextContent('jason04');

    await user.hover(profileTrigger);

    expect(screen.getByRole('menu', { name: 'Profile menu' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Your impact' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Account settings' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Admin' })).toHaveAttribute('href', '/admin/manage-users');
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toBeInTheDocument();
  });

  it('does not show the Admin menu item for non-admin users', async () => {
    const user = await logInThroughNavbar('Fundraiser');
    const profileTrigger = screen.getByRole('button', { name: 'Open profile menu for jason04' });

    await user.hover(profileTrigger);

    expect(screen.queryByRole('menuitem', { name: 'Admin' })).not.toBeInTheDocument();
  });

  it('shows the Admin link in the mobile menu only for user admins', async () => {
    const user = await logInThroughNavbar();

    await user.click(screen.getByRole('button', { name: 'Toggle menu' }));

    expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/admin/manage-users');
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
      expect(pushMock).toHaveBeenCalledWith('/');
    });

    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Open profile menu for jason04' })).not.toBeInTheDocument();
    expect(screen.getByText('You have successfully signed out of FundRaise.')).toBeInTheDocument();
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
    expect(pushMock).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Open profile menu for jason04' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sign In' })).not.toBeInTheDocument();
  });
});
