export type LogoutResult =
  | { success: true; message: string }
  | { success: false; message: string };

export async function logout(): Promise<LogoutResult> {
  try {
    const response = await fetch('http://localhost:8080/api/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return data as LogoutResult;
  } catch {
    return { success: false, message: 'Unable to connect to server.' };
  }
}

export function displayLoginPage(clearUser: () => void): void {
  clearUser();
}
