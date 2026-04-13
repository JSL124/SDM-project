describe('accountRoutes', () => {
  let consoleErrorSpy: jest.SpyInstance;

  async function loadHandler(createAccountResult: unknown, shouldReject = false) {
    jest.resetModules();
    jest.doMock('../../src/account/controller/CreateAccountController', () => ({
      CreateAccountController: jest.fn().mockImplementation(() => ({
        createAccount: shouldReject
          ? jest.fn().mockRejectedValue(new Error('db down'))
          : jest.fn().mockResolvedValue(createAccountResult),
      })),
    }));

    const { default: accountRoutes } = await import('../../src/routes/accountRoutes');
    return (accountRoutes as any).stack[0].route.stack[0].handle;
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
    const handler = await loadHandler({
      success: true,
      message: 'Account created successfully.',
    });
    const response = createResponse();

    await handler(
      {
        body: {
          profileId: '1',
          username: 'newuser',
          password: 'Password123!',
          role: 'Fundraiser',
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
    const handler = await loadHandler({
      success: false,
      message: 'Username already exists.',
    });
    const response = createResponse();

    await handler(
      {
        body: {
          profileId: '1',
          username: 'existinguser',
          password: 'Password123!',
          role: 'Donee',
        },
      },
      response
    );

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: 'Username already exists.',
    });
  });

  it('returns 500 when the controller throws an error', async () => {
    const handler = await loadHandler(null, true);
    const response = createResponse();

    await handler(
      {
        body: {
          profileId: '1',
          username: 'newuser',
          password: 'Password123!',
          role: 'User admin',
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
