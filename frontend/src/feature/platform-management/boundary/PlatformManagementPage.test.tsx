import { render, screen } from '@testing-library/react';
import PlatformManagementPage from './PlatformManagementPage';

describe('PlatformManagementPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows access denied when user is not Platform manager', () => {
    localStorage.setItem('userRole', 'Fundraiser');
    render(<PlatformManagementPage />);

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText('Only Platform Managers can view this page.')).toBeInTheDocument();
    expect(screen.queryByText('Platform Management')).not.toBeInTheDocument();
  });

  it('shows access denied when no role is set', () => {
    render(<PlatformManagementPage />);

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });

  it('renders the dashboard when user is Platform manager', () => {
    localStorage.setItem('userRole', 'Platform manager');
    render(<PlatformManagementPage />);

    expect(screen.getByRole('heading', { name: 'Platform Management' })).toBeInTheDocument();
    expect(screen.getByText('Total Accounts')).toBeInTheDocument();
    expect(screen.getByText('Active Fundraising Activities')).toBeInTheDocument();
    expect(screen.getByText('Total Target Amount')).toBeInTheDocument();
    expect(screen.getByText('Platform Categories')).toBeInTheDocument();
    expect(screen.getByText('Activity feed will be displayed here.')).toBeInTheDocument();
  });
});
