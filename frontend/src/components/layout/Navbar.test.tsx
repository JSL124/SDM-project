import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from './Navbar';
import { logout } from '@/feature/Logout/boundary/LogoutPage';

const pushMock = jest.fn();

jest.mock('@/feature/Logout/boundary/LogoutPage', () => ({
  logout: jest.fn(),
}));

jest.mock('@/components/ui/LoginModal', () => ({
  __esModule: true,
  default: function MockLoginModal({
    open,
    onLoginSuccess,
  }: {
    open: boolean;
    onLoginSuccess: (user: { email: string; role?: string }) => void;
  }) {
    if (!open) {
      return null;
    }

    return (
      <>
        <button onClick={() => onLoginSuccess({ email: 'jason21888@naver.com', role: 'User admin' })}>
          Complete Mock Admin Login
        </button>
        <button onClick={() => onLoginSuccess({ email: 'jason21888@naver.com', role: 'Fundraiser' })}>
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

function setStoredUser(role: 'User admin' | 'Fundraiser' = 'Fundraiser') {
  localStorage.setItem('userRole', role);
  localStorage.setItem('userEmail', 'jason21888@naver.com');
}

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.clear();
    logoutMock.mockReset();
    pushMock.mockReset();
  });

  async function logInThroughNavbar(role: 'User admin' | 'Fundraiser' = 'User admin') {
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByRole('button', { name: 'Sign In' }));
    await user.click(screen.getByRole('button', { name: role === 'User admin' ? 'Complete Mock Admin Login' : 'Complete Mock User Login' }));

    expect(await screen.findByRole('button', { name: 'Open profile menu for jason21888' })).toBeInTheDocument();
    return user;
  }

  it('shows only the logo and sign in when no user is logged in', () => {
    render(<Navbar />);

    expect(screen.getByRole('link', { name: 'Fund Raise' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Fundraising Activities' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Toggle menu' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Open profile menu/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('shows fundraising activity link and profile trigger when a stored user exists', () => {
    setStoredUser();
    render(<Navbar />);

    expect(screen.getByRole('link', { name: 'Fundraising Activities' })).toHaveAttribute('href', '/fundraiser/view-fundraising-activity');
    expect(screen.getByRole('button', { name: 'Open profile menu for jason21888' })).toBeInTheDocument();
  });

  it('shows only Sign out in the desktop profile menu', async () => {
    setStoredUser();
    const user = userEvent.setup();
    render(<Navbar />);

    const profileTrigger = screen.getByRole('button', { name: 'Open profile menu for jason21888' });
    await user.hover(profileTrigger);

    expect(screen.getByRole('menu', { name: 'Profile menu' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Profile' })).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Your impact' })).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Account settings' })).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Admin' })).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'My Activities' })).not.toBeInTheDocument();
  });

  it('shows Sign out in the mobile menu for logged-in users', async () => {
    setStoredUser();
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByRole('button', { name: 'Toggle menu' }));

    expect(screen.getAllByText('jason21888')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
  });

  it('shows no admin-only menu item even for user admins', async () => {
    setStoredUser('User admin');
    const user = userEvent.setup();
    render(<Navbar />);

    await user.hover(screen.getByRole('button', { name: 'Open profile menu for jason21888' }));

    expect(screen.queryByRole('menuitem', { name: 'Admin' })).not.toBeInTheDocument();
  });

  it('clears the navbar back to logo-only after successful logout', async () => {
    logoutMock.mockResolvedValue(undefined);
    setStoredUser();
    render(<Navbar />);

    const profileTrigger = screen.getByRole('button', { name: 'Open profile menu for jason21888' });
    fireEvent.focus(profileTrigger);
    fireEvent.mouseDown(screen.getByRole('menuitem', { name: 'Sign out' }));

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledTimes(1);
      expect(pushMock).toHaveBeenCalledWith('/');
    });

    expect(screen.queryByRole('link', { name: 'Fundraising Activities' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Toggle menu' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Open profile menu/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByText('You have successfully signed out of FundRaise.')).toBeInTheDocument();
  });

  it('allows login through the sign in button', async () => {
    await logInThroughNavbar('Fundraiser');

    expect(screen.getByRole('button', { name: 'Open profile menu for jason21888' })).toBeInTheDocument();
    expect(screen.getByText('You have successfully signed in to FundRaise.')).toBeInTheDocument();
  });

  it('redirects user admins to the create account page after login', async () => {
    await logInThroughNavbar('User admin');

    expect(pushMock).toHaveBeenCalledWith('/admin/create-account');
  });
});
