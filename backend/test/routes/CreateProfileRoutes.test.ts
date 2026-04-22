describe('CreateProfileRoutes', () => {
  let consoleErrorSpy: jest.SpyInstance;

  async function loadHandlers(options: {
    createProfileResult?: unknown;
    listProfilesResult?: unknown;
    createShouldReject?: boolean;
    listShouldReject?: boolean;
  } = {}) {
    jest.resetModules();
    jest.doMock('../../src/CreateProfile/controller/CreateProfileController', () => ({
      CreateProfileController: jest.fn().mockImplementation(() => ({
        createProfile: options.createShouldReject
          ? jest.fn().mockRejectedValue(new Error('db down'))
          : jest.fn().mockResolvedValue(options.createProfileResult),
        listProfiles: options.listShouldReject
          ? jest.fn().mockRejectedValue(new Error('db down'))
          : jest.fn().mockResolvedValue(options.listProfilesResult ?? []),
      })),
    }));

    const { default: CreateProfileRoutes } = await import('../../src/routes/CreateProfileRoutes');
    const stack = (CreateProfileRoutes as any).stack;
    return {
      getHandler: stack.find((layer: any) => layer.route.methods.get).route.stack[0].handle,
      postHandler: stack.find((layer: any) => layer.route.methods.post).route.stack[0].handle,
    };
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
    const { postHandler } = await loadHandlers({
      createProfileResult: {
        role: 'Fundraiser',
        description: 'Creates fundraising activities',
      },
    });
    const response = createResponse();

    await postHandler(
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
    const { postHandler } = await loadHandlers({ createProfileResult: null });
    const response = createResponse();

    await postHandler(
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
    const { postHandler } = await loadHandlers({ createProfileResult: null, createShouldReject: true });
    const response = createResponse();

    await postHandler(
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

  it('returns 200 with profiles for successful profile listing', async () => {
    const profiles = [
      { profileId: '1', role: 'Donee', description: 'Receives donations' },
      { profileId: '2', role: 'Fundraiser', description: 'Creates fundraising activities' },
      { profileId: '3', role: 'User admin', description: 'Manages user accounts' },
      { profileId: '4', role: 'Platform manager', description: 'Manages platform operations' },
    ];
    const { getHandler } = await loadHandlers({ listProfilesResult: profiles });
    const response = createResponse();

    await getHandler({}, response);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(profiles);
  });

  it('returns 500 when profile listing throws an error', async () => {
    const { getHandler } = await loadHandlers({ listShouldReject: true });
    const response = createResponse();

    await getHandler({}, response);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'List profiles request failed:',
      expect.any(Error)
    );
  });
});
