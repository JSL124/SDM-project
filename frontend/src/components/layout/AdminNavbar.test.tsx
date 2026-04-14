import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminNavbar from './AdminNavbar';
import { displayLoginPage, logout } from '@/feature/logout/boundary/LogoutBoundary';

const pushMock = jest.fn();

jest.mock('@/feature/logout/boundary/LogoutBoundary', () => ({
  logout: jest.fn(),
  displayLoginPage: jest.fn(),
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
  useSearchParams: () => ({
    get: () => 'account',
  }),
}));

const logoutMock = logout as jest.MockedFunction<typeof logout>;
const displayLoginPageMock = displayLoginPage as jest.MockedFunction<typeof displayLoginPage>;

describe('AdminNavbar', () => {
  beforeEach(() => {
    logoutMock.mockReset();
    displayLoginPageMock.mockReset();
    pushMock.mockReset();
    sessionStorage.clear();
    localStorage.clear();

    localStorage.setItem('userRole', 'User admin');
    localStorage.setItem('userEmail', 'admin@example.com');
    localStorage.setItem('userUsername', 'admin-user');

    displayLoginPageMock.mockImplementation((clearUser) => clearUser());
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

  it('queues a logout success banner before redirecting home', async () => {
    logoutMock.mockResolvedValue(true);
    const user = userEvent.setup();

    render(<AdminNavbar />);

    await user.hover(screen.getByRole('button', { name: 'Open profile menu for admin-user' }));
    fireEvent.mouseDown(screen.getByRole('menuitem', { name: 'Sign out' }));

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledTimes(1);
      expect(displayLoginPageMock).toHaveBeenCalledTimes(1);
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
