import { LogoutController } from '../../src/logout/controller/LogoutController';

describe('LogoutController', () => {
  it('returns true for logout', () => {
    const controller = new LogoutController();

    expect(controller.logout()).toBe(true);
  });
});
