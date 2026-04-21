import { logout } from './LogoutPage';

describe('LogoutPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('clears stored login state when logout succeeds', async () => {
    localStorage.setItem('userRole', 'Fundraiser');
    localStorage.setItem('userEmail', 'active.fundraiser@example.com');
    localStorage.setItem('userUsername', 'jason04');

    await expect(logout()).resolves.toBeUndefined();

    expect(localStorage.getItem('userRole')).toBeNull();
    expect(localStorage.getItem('userEmail')).toBeNull();
    expect(localStorage.getItem('userUsername')).toBeNull();
  });
});
