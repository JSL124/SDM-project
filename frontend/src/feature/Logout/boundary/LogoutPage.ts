export async function logout(): Promise<void> {
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userUsername');
  window.dispatchEvent(new Event('storage'));
}
