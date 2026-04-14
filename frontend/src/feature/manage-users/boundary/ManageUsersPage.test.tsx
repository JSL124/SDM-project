import { render, screen } from '@testing-library/react';
import ManageUsersPage from './ManageUsersPage';

const searchParamsMock = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useSearchParams: () => searchParamsMock,
}));

jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) {
    return <a href={href} {...props}>{children}</a>;
  };
});

function setActiveTab(tab: 'account' | 'profile' | null): void {
  searchParamsMock.delete('tab');
  if (tab) {
    searchParamsMock.set('tab', tab);
  }
}

describe('ManageUsersPage', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('userRole', 'User admin');
    setActiveTab(null);
  });

  it('shows access denied when user is not User admin', () => {
    localStorage.setItem('userRole', 'Fundraiser');
    render(<ManageUsersPage />);

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText('Only User Admins can manage users.')).toBeInTheDocument();
    expect(screen.queryByText('Accounts')).not.toBeInTheDocument();
  });

  it('defaults to Account tab active with Accounts heading', () => {
    render(<ManageUsersPage />);

    expect(screen.getByText('Accounts')).toBeInTheDocument();
    expect(screen.queryByText('Access Denied')).not.toBeInTheDocument();
  });

  it('shows the Profiles heading when tab=profile is in the URL', () => {
    setActiveTab('profile');
    render(<ManageUsersPage />);

    expect(screen.getByText('Profiles')).toBeInTheDocument();
    expect(screen.queryByText('Accounts')).not.toBeInTheDocument();
  });

  it('"+" button links to create-account when Account tab is active', () => {
    render(<ManageUsersPage />);

    const addLink = screen.getByRole('link', { name: /create account/i });
    expect(addLink).toHaveAttribute('href', '/admin/create-account');
  });

  it('"+" button links to create-profile when tab=profile is in the URL', () => {
    setActiveTab('profile');
    render(<ManageUsersPage />);

    const addLink = screen.getByRole('link', { name: /create profile/i });
    expect(addLink).toHaveAttribute('href', '/admin/create-profile');
  });

  it('shows placeholder content for account list', () => {
    render(<ManageUsersPage />);

    expect(screen.getByText('No accounts to display yet.')).toBeInTheDocument();
  });

  it('shows placeholder content for profile list', () => {
    setActiveTab('profile');
    render(<ManageUsersPage />);

    expect(screen.getByText('No profiles to display yet.')).toBeInTheDocument();
  });

  it('does not render the old sidebar tab buttons', () => {
    render(<ManageUsersPage />);

    expect(screen.queryByRole('button', { name: 'Account' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Profile' })).not.toBeInTheDocument();
    expect(screen.queryByText('Management')).not.toBeInTheDocument();
  });
});
