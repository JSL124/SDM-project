import { LogoutController } from '../../src/logout/controller/LogoutController';

describe('LogoutController', () => {
  it('returns void for logout', () => {
    const controller = new LogoutController();

    expect(controller.logout()).toBeUndefined();
  });
});
