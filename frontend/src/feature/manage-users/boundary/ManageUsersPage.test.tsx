import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ManageUsersPage from './ManageUsersPage';

jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) {
    return <a href={href} {...props}>{children}</a>;
  };
});

describe('ManageUsersPage', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('userRole', 'User admin');
  });

  it('shows access denied when user is not User admin', () => {
    localStorage.setItem('userRole', 'Fundraiser');
    render(<ManageUsersPage />);

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText('Only User Admins can manage users.')).toBeInTheDocument();
    expect(screen.queryByText('Account')).not.toBeInTheDocument();
  });

  it('shows the management page when user is User admin', () => {
    render(<ManageUsersPage />);

    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.queryByText('Access Denied')).not.toBeInTheDocument();
  });

  it('defaults to Account tab active with Accounts heading', () => {
    render(<ManageUsersPage />);

    expect(screen.getByText('Accounts')).toBeInTheDocument();
  });

  it('switches to Profile view when Profile tab is clicked', async () => {
    const user = userEvent.setup();
    render(<ManageUsersPage />);

    await user.click(screen.getByText('Profile'));

    expect(screen.getByText('Profiles')).toBeInTheDocument();
  });

  it('switches back to Account view when Account tab is clicked', async () => {
    const user = userEvent.setup();
    render(<ManageUsersPage />);

    await user.click(screen.getByText('Profile'));
    expect(screen.getByText('Profiles')).toBeInTheDocument();

    await user.click(screen.getByText('Account'));
    expect(screen.getByText('Accounts')).toBeInTheDocument();
  });

  it('"+" button links to create-account when Account tab is active', () => {
    render(<ManageUsersPage />);

    const addLink = screen.getByRole('link', { name: /create account/i });
    expect(addLink).toHaveAttribute('href', '/admin/create-account');
  });

  it('"+" button links to create-profile when Profile tab is active', async () => {
    const user = userEvent.setup();
    render(<ManageUsersPage />);

    await user.click(screen.getByText('Profile'));

    const addLink = screen.getByRole('link', { name: /create profile/i });
    expect(addLink).toHaveAttribute('href', '/admin/create-profile');
  });

  it('shows placeholder content for account list', () => {
    render(<ManageUsersPage />);

    expect(screen.getByText('No accounts to display yet.')).toBeInTheDocument();
  });

  it('shows placeholder content for profile list', async () => {
    const user = userEvent.setup();
    render(<ManageUsersPage />);

    await user.click(screen.getByText('Profile'));

    expect(screen.getByText('No profiles to display yet.')).toBeInTheDocument();
  });
});
