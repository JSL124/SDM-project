describe('loginRoutes', () => {
  async function loadHandler(loginResult: unknown, shouldReject = false) {
    jest.resetModules();
    jest.doMock('../../src/login/controller/LoginController', () => ({
      LoginController: jest.fn().mockImplementation(() => ({
        login: shouldReject
          ? jest.fn().mockRejectedValue(new Error('db down'))
          : jest.fn().mockResolvedValue(loginResult),
      })),
    }));

    const { default: loginRoutes } = await import('../../src/routes/loginRoutes');
    return (loginRoutes as any).stack[0].route.stack[0].handle;
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
  });

  it('returns 200 for successful login', async () => {
    const handler = await loadHandler({
      success: true,
      message: 'Login successful.',
    });
    const response = createResponse();

    await handler(
      {
        body: {
          email: 'active.fundraiser@example.com',
          password: 'Fundraiser123!',
        },
      },
      response
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'Login successful.',
    });
  });

  it('returns 401 for account not found', async () => {
    const handler = await loadHandler({
      success: false,
      message: 'Account does not exist.',
    });
    const response = createResponse();

    await handler(
      {
        body: {
          email: 'missing.fundraiser@example.com',
          password: 'AnyPass123!',
        },
      },
      response
    );

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      success: false,
      message: 'Account does not exist.',
    });
  });

  it('returns 500 when the controller throws an error', async () => {
    const handler = await loadHandler(null, true);
    const response = createResponse();

    await handler(
      {
        body: {
          email: 'active.fundraiser@example.com',
          password: 'Fundraiser123!',
        },
      },
      response
    );

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      success: false,
      message: 'Unable to connect to server.',
    });
  });
});
