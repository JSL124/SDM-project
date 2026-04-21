describe('CreateProfileRoutes', () => {
  let consoleErrorSpy: jest.SpyInstance;

  async function loadHandler(createProfileResult: unknown, shouldReject = false) {
    jest.resetModules();
    jest.doMock('../../src/CreateProfile/controller/CreateProfileController', () => ({
      CreateProfileController: jest.fn().mockImplementation(() => ({
        createProfile: shouldReject
          ? jest.fn().mockRejectedValue(new Error('db down'))
          : jest.fn().mockResolvedValue(createProfileResult),
      })),
    }));

    const { default: CreateProfileRoutes } = await import('../../src/routes/CreateProfileRoutes');
    return (CreateProfileRoutes as any).stack[0].route.stack[0].handle;
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
      role: 'Fundraiser',
      description: 'Creates fundraising activities',
    });
    const response = createResponse();

    await handler(
      {
        body: {
          role: 'Fundraiser',
          description: 'Creates fundraising activities',
        },
      },
      response
    );

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      role: 'Fundraiser',
      description: 'Creates fundraising activities',
    });
  });

  it('returns 400 when profile creation fails', async () => {
    const handler = await loadHandler(null);
    const response = createResponse();

    await handler(
      {
        body: {
          role: 'Fundraiser',
          description: 'Creates fundraising activities',
        },
      },
      response
    );

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeNull();
  });

  it('returns 500 when the controller throws an error', async () => {
    const handler = await loadHandler(null, true);
    const response = createResponse();

    await handler(
      {
        body: {
          role: 'Fundraiser',
          description: 'Creates fundraising activities',
        },
      },
      response
    );

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Create profile request failed:',
      expect.any(Error)
    );
  });
});
