describe('CreateAccountRoutes', () => {
  let consoleErrorSpy: jest.SpyInstance;

  async function loadHandler(createAccountResult: unknown, shouldReject = false) {
    jest.resetModules();
    jest.doMock('../../src/CreateAccount/controller/CreateAccountController', () => ({
      CreateAccountController: jest.fn().mockImplementation(() => ({
        createAccount: shouldReject
          ? jest.fn().mockRejectedValue(new Error('db down'))
          : jest.fn().mockResolvedValue(createAccountResult),
      })),
    }));

    const { default: CreateAccountRoutes } = await import('../../src/routes/CreateAccountRoutes');
    return (CreateAccountRoutes as any).stack[0].route.stack[0].handle;
  }

  function createResponse() {
    const response = {
      statusCode: 200,
      body: undefined as unknown,
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      json(payload: unknown) {
        this.body = payload;
        return this;
      },
    };

    return response;
  }

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('returns 200 for successful account creation', async () => {
    const handler = await loadHandler({ email: 'new.user@example.com' });
    const response = createResponse();

    await handler(
      {
        body: {
          email: 'new.user@example.com',
          password: 'Password123!',
          name: 'New User',
          DOB: '1998-01-01',
          phoneNum: '0498765432',
          profileId: '1',
        },
      },
      response
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'Account created successfully.',
    });
  });

  it('returns 400 when account creation fails', async () => {
    const handler = await loadHandler(null);
    const response = createResponse();

    await handler(
      {
        body: {
          email: 'existing.user@example.com',
          password: 'Password123!',
          name: 'Existing User',
          DOB: '1998-01-01',
          phoneNum: '0412345678',
          profileId: '1',
        },
      },
      response
    );

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: 'User Account exists.',
    });
  });

  it('returns 500 when the controller throws an error', async () => {
    const handler = await loadHandler(null, true);
    const response = createResponse();

    await handler(
      {
        body: {
          email: 'new.user@example.com',
          password: 'Password123!',
          name: 'New User',
          DOB: '1998-01-01',
          phoneNum: '0498765432',
          profileId: '1',
        },
      },
      response
    );

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      success: false,
      message: 'Unable to connect to server.',
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Create account request failed:',
      expect.any(Error)
    );
  });
});
