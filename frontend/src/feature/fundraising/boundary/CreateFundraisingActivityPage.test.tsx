import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateFundraisingActivityPage from './CreateFundraisingActivityPage';
import { getApiUrl } from '@/lib/api';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

type MockActivityResponse = {
  ok: boolean;
  json: () => Promise<{ success: boolean; message: string }>;
};

describe('CreateFundraisingActivityPage', () => {
  const fetchMock = jest.fn<Promise<MockActivityResponse>, [RequestInfo | URL, RequestInit?]>();

  beforeEach(() => {
    fetchMock.mockReset();
    mockPush.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
    localStorage.clear();
    localStorage.setItem('userRole', 'Fundraiser');
  });

  it('shows access denied when user is not User admin', () => {
    localStorage.setItem('userRole', 'User admin');
    render(<CreateFundraisingActivityPage />);

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText('Only Fundraisers can create fundraising activities.')).toBeInTheDocument();
  });

  it('shows no message before submit', () => {
    render(<CreateFundraisingActivityPage />);

    expect(screen.queryByText('Please enter a title.')).not.toBeInTheDocument();
    expect(screen.queryByText('Please enter a description.')).not.toBeInTheDocument();
    expect(screen.queryByText('Fundraising activity created successfully.')).not.toBeInTheDocument();
  });

  it('blocks submission when title is empty', async () => {
    const user = userEvent.setup();
    render(<CreateFundraisingActivityPage />);

    await user.type(screen.getByLabelText('Description'), 'A great cause.');
    await user.type(screen.getByLabelText('Target Amount ($)'), '5000');
    await user.type(screen.getByLabelText('Category'), 'Community');
    await user.type(screen.getByLabelText('Start Date'), '2026-05-01');
    await user.type(screen.getByLabelText('End Date'), '2026-06-01');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please enter a title.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks submission when description is empty', async () => {
    const user = userEvent.setup();
    render(<CreateFundraisingActivityPage />);

    await user.type(screen.getByLabelText('Title'), 'Help the Community');
    await user.type(screen.getByLabelText('Target Amount ($)'), '5000');
    await user.type(screen.getByLabelText('Category'), 'Community');
    await user.type(screen.getByLabelText('Start Date'), '2026-05-01');
    await user.type(screen.getByLabelText('End Date'), '2026-06-01');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please enter a description.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks submission when targetAmount is empty', async () => {
    const user = userEvent.setup();
    render(<CreateFundraisingActivityPage />);

    await user.type(screen.getByLabelText('Title'), 'Help the Community');
    await user.type(screen.getByLabelText('Description'), 'A great cause.');
    await user.type(screen.getByLabelText('Category'), 'Community');
    await user.type(screen.getByLabelText('Start Date'), '2026-05-01');
    await user.type(screen.getByLabelText('End Date'), '2026-06-01');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please enter a target amount greater than zero.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks submission when category is empty', async () => {
    const user = userEvent.setup();
    render(<CreateFundraisingActivityPage />);

    await user.type(screen.getByLabelText('Title'), 'Help the Community');
    await user.type(screen.getByLabelText('Description'), 'A great cause.');
    await user.type(screen.getByLabelText('Target Amount ($)'), '5000');
    await user.type(screen.getByLabelText('Start Date'), '2026-05-01');
    await user.type(screen.getByLabelText('End Date'), '2026-06-01');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please enter a category.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks submission when startDate is empty', async () => {
    const user = userEvent.setup();
    render(<CreateFundraisingActivityPage />);

    await user.type(screen.getByLabelText('Title'), 'Help the Community');
    await user.type(screen.getByLabelText('Description'), 'A great cause.');
    await user.type(screen.getByLabelText('Target Amount ($)'), '5000');
    await user.type(screen.getByLabelText('Category'), 'Community');
    await user.type(screen.getByLabelText('End Date'), '2026-06-01');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please enter a start date.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks submission when endDate is empty', async () => {
    const user = userEvent.setup();
    render(<CreateFundraisingActivityPage />);

    await user.type(screen.getByLabelText('Title'), 'Help the Community');
    await user.type(screen.getByLabelText('Description'), 'A great cause.');
    await user.type(screen.getByLabelText('Target Amount ($)'), '5000');
    await user.type(screen.getByLabelText('Category'), 'Community');
    await user.type(screen.getByLabelText('Start Date'), '2026-05-01');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('Please enter an end date.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks submission when endDate is before startDate', async () => {
    const user = userEvent.setup();
    render(<CreateFundraisingActivityPage />);

    await user.type(screen.getByLabelText('Title'), 'Help the Community');
    await user.type(screen.getByLabelText('Description'), 'A great cause.');
    await user.type(screen.getByLabelText('Target Amount ($)'), '5000');
    await user.type(screen.getByLabelText('Category'), 'Community');
    await user.type(screen.getByLabelText('Start Date'), '2026-06-01');
    await user.type(screen.getByLabelText('End Date'), '2026-05-01');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('End date must be after start date.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows a network error when the backend is unavailable', async () => {
    const user = userEvent.setup();
    fetchMock.mockRejectedValue(new Error('Network failure'));
    render(<CreateFundraisingActivityPage />);

    await user.type(screen.getByLabelText('Title'), 'Help the Community');
    await user.type(screen.getByLabelText('Description'), 'A great cause.');
    await user.type(screen.getByLabelText('Target Amount ($)'), '5000');
    await user.type(screen.getByLabelText('Category'), 'Community');
    await user.type(screen.getByLabelText('Start Date'), '2026-05-01');
    await user.type(screen.getByLabelText('End Date'), '2026-06-01');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('Unable to connect to server.')).toBeInTheDocument();
  });

  it('sends the expected payload and shows confirmation on success', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Fundraising activity created successfully.',
      }),
    });
    render(<CreateFundraisingActivityPage />);

    await user.type(screen.getByLabelText('Title'), 'Help the Community');
    await user.type(screen.getByLabelText('Description'), 'A great cause.');
    await user.type(screen.getByLabelText('Target Amount ($)'), '5000');
    await user.type(screen.getByLabelText('Category'), 'Community');
    await user.type(screen.getByLabelText('Start Date'), '2026-05-01');
    await user.type(screen.getByLabelText('End Date'), '2026-06-01');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(getApiUrl('/api/fundraising-activity'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Help the Community',
          description: 'A great cause.',
          targetAmount: 5000,
          category: 'Community',
          startDate: '2026-05-01',
          endDate: '2026-06-01',
        }),
      });
    });

    expect(await screen.findByText('Fundraising activity created successfully.')).toBeInTheDocument();
  });

  it('navigates to manage-users when Cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<CreateFundraisingActivityPage />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockPush).toHaveBeenCalledWith('/fundraiser/manage-activities');
  });
});
