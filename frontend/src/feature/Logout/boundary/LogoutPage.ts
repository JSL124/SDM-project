export async function logout(): Promise<void> {
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
  window.dispatchEvent(new Event('storage'));
}
