import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminNavbar from './AdminNavbar';
import { logout } from '@/feature/Logout/boundary/LogoutPage';

const pushMock = jest.fn();
let mockPathname = '/admin/create-account';

jest.mock('@/feature/Logout/boundary/LogoutPage', () => ({
  logout: jest.fn(),
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
  usePathname: () => mockPathname,
}));

const logoutMock = logout as jest.MockedFunction<typeof logout>;

describe('AdminNavbar', () => {
  beforeEach(() => {
    logoutMock.mockReset();
    pushMock.mockReset();
    sessionStorage.clear();
    localStorage.clear();

    localStorage.setItem('userRole', 'User admin');
    localStorage.setItem('userEmail', 'admin@example.com');
    mockPathname = '/admin/create-account';
  });

  it('shows a queued login success banner after redirecting to admin pages', () => {
    sessionStorage.setItem(
      'fundraise:flash-banner',
      JSON.stringify({
        message: 'You have successfully signed in to FundRaise.',
        durationMs: 4500,
      }),
    );

    render(<AdminNavbar />);

    expect(screen.getByText('You have successfully signed in to FundRaise.')).toBeInTheDocument();
    expect(sessionStorage.getItem('fundraise:flash-banner')).toBeNull();
  });

  it('links user admin navigation directly to diagram-backed boundaries', () => {
    render(<AdminNavbar />);

    expect(screen.getByRole('link', { name: 'Fund Raise' })).toHaveAttribute('href', '/admin/create-account');
    expect(screen.getByRole('link', { name: 'Account' })).toHaveAttribute('href', '/admin/create-account');
    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/admin/create-profile');
    expect(screen.getByRole('link', { name: 'Account' })).toHaveAttribute('aria-current', 'page');
  });

  it('marks profile navigation active on the create profile route', () => {
    mockPathname = '/admin/create-profile';

    render(<AdminNavbar />);

    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Account' })).not.toHaveAttribute('aria-current');
  });

  it('queues a logout success banner before redirecting home', async () => {
    logoutMock.mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<AdminNavbar />);

    await user.hover(screen.getByRole('button', { name: 'Open profile menu for admin' }));
    fireEvent.mouseDown(screen.getByRole('menuitem', { name: 'Sign out' }));

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledTimes(1);
      expect(pushMock).toHaveBeenCalledWith('/');
    });

    expect(sessionStorage.getItem('fundraise:flash-banner')).toBe(
      JSON.stringify({
        message: 'You have successfully signed out of FundRaise.',
        durationMs: 3000,
      }),
    );
  });
});
