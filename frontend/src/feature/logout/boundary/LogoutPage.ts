import { getApiUrl } from '@/lib/api';

type LogoutResponse = {
  success: boolean;
};

export async function logout(): Promise<boolean> {
  try {
    const response = await fetch(getApiUrl('/api/logout'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = (await response.json()) as LogoutResponse;
    return response.ok && data.success;
  } catch {
    return false;
  }
}

export function displayLoginPage(clearUser: () => void): void {
  clearUser();
}
