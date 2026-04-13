describe('profileRoutes', () => {
  let consoleErrorSpy: jest.SpyInstance;

  async function loadHandler(createProfileResult: unknown, shouldReject = false) {
    jest.resetModules();
    jest.doMock('../../src/profile/controller/ProfileController', () => ({
      ProfileController: jest.fn().mockImplementation(() => ({
        createProfile: shouldReject
          ? jest.fn().mockRejectedValue(new Error('db down'))
          : jest.fn().mockResolvedValue(createProfileResult),
      })),
    }));

    const { default: profileRoutes } = await import('../../src/routes/profileRoutes');
    return (profileRoutes as any).stack[0].route.stack[0].handle;
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

  it('returns 201 for successful profile creation', async () => {
    const handler = await loadHandler({
      success: true,
      message: 'Profile created successfully.',
    });
    const response = createResponse();

    await handler(
      {
        body: {
          name: 'New User',
          email: 'new.user@example.com',
          phoneNum: '0498765432',
          address: '456 Example Ave',
        },
      },
      response
    );

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      success: true,
      message: 'Profile created successfully.',
    });
  });

  it('returns 409 when email already exists', async () => {
    const handler = await loadHandler({
      success: false,
      message: 'Email already exists.',
    });
    const response = createResponse();

    await handler(
      {
        body: {
          name: 'Existing User',
          email: 'existing.user@example.com',
          phoneNum: '0412345678',
          address: '123 Test St',
        },
      },
      response
    );

    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual({
      success: false,
      message: 'Email already exists.',
    });
  });

  it('returns 400 when profile creation fails', async () => {
    const handler = await loadHandler({
      success: false,
      message: 'Failed to create profile.',
    });
    const response = createResponse();

    await handler(
      {
        body: {
          name: 'New User',
          email: 'new.user@example.com',
          phoneNum: '0498765432',
          address: '456 Example Ave',
        },
      },
      response
    );

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: 'Failed to create profile.',
    });
  });

  it('returns 500 when the controller throws an error', async () => {
    const handler = await loadHandler(null, true);
    const response = createResponse();

    await handler(
      {
        body: {
          name: 'New User',
          email: 'new.user@example.com',
          phoneNum: '0498765432',
          address: '456 Example Ave',
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
      'Create profile request failed:',
      expect.any(Error)
    );
  });
});
