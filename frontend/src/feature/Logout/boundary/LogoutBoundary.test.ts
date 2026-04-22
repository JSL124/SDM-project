import { logout } from './LogoutPage';

describe('LogoutPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('clears stored login state when logout succeeds', async () => {
    localStorage.setItem('userRole', 'Fundraiser');
    localStorage.setItem('userEmail', 'active.fundraiser@example.com');

    await expect(logout()).resolves.toBeUndefined();

    expect(localStorage.getItem('userRole')).toBeNull();
    expect(localStorage.getItem('userEmail')).toBeNull();
  });
});
