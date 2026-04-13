import { displayLoginPage, logout } from './LogoutBoundary';
import { getApiUrl } from '@/lib/api';

type MockLogoutResponse = {
  ok: boolean;
  json: () => Promise<{ success: boolean }>;
};

describe('LogoutBoundary', () => {
  const fetchMock = jest.fn<Promise<MockLogoutResponse>, [RequestInfo | URL, RequestInit?]>();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('returns true when the backend logout succeeds', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    await expect(logout()).resolves.toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(getApiUrl('/api/logout'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('returns false when the backend logout fails', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ success: false }),
    });

    await expect(logout()).resolves.toBe(false);
  });

  it('returns false on network error', async () => {
    fetchMock.mockRejectedValue(new Error('Network failure'));

    await expect(logout()).resolves.toBe(false);
  });

  it('clears the login state through displayLoginPage', () => {
    const clearUser = jest.fn();

    displayLoginPage(clearUser);

    expect(clearUser).toHaveBeenCalledTimes(1);
  });
});
