describe('fundraisingRoutes', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let createFundraisingActivityMock: jest.Mock;
  let getFundraisingActivitiesMock: jest.Mock;
  let getFundraisingActivityDetailsMock: jest.Mock;

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

  async function loadRouteHandlers(
    createResult: unknown,
    getListResult: unknown,
    getDetailResult: unknown,
    rejectCreate = false,
    rejectGetList = false,
    rejectGetDetail = false,
  ) {
    jest.resetModules();
    createFundraisingActivityMock = rejectCreate
      ? jest.fn().mockRejectedValue(new Error('db down'))
      : jest.fn().mockResolvedValue(createResult);
    getFundraisingActivitiesMock = rejectGetList
      ? jest.fn().mockRejectedValue(new Error('db down'))
      : jest.fn().mockResolvedValue(getListResult);
    getFundraisingActivityDetailsMock = rejectGetDetail
      ? jest.fn().mockRejectedValue(new Error('db down'))
      : jest.fn().mockResolvedValue(getDetailResult);

    jest.doMock('../../src/db', () => ({ query: jest.fn() }));
    jest.doMock('../../src/CreateFundraisingActivity/controller/CreateFundraisingActivityController', () => ({
      CreateFundraisingActivityController: jest.fn().mockImplementation(() => ({
        createFundraisingActivity: createFundraisingActivityMock,
      })),
    }));

    jest.doMock('../../src/ViewFundraisingActivity/controller/ViewFundraisingActivitiesController', () => ({
      ViewFundraisingActivitiesController: jest.fn().mockImplementation(() => ({
        viewFundraisingActivities: getFundraisingActivitiesMock,
        viewFundraisingActivityDetails: getFundraisingActivityDetailsMock,
      })),
    }));

    const { default: fundraisingRoutes } = await import('../../src/routes/fundraisingRoutes');
    const stack = (fundraisingRoutes as any).stack;
    return {
      postHandler: stack[0].route.stack[0].handle,
      getListHandler: stack[1].route.stack[0].handle,
      getDetailHandler: stack[2].route.stack[0].handle,
    };
  }

  const validBody = {
    title: 'Help the Community',
    description: 'A fundraiser to support local shelters.',
    targetAmount: 5000,
    category: 'Community',
    startDate: '2026-05-01',
    endDate: '2026-06-01',
  };

  const mockActivity = {
    activityID: '1',
    title: 'Help the Community',
    description: 'A fundraiser to support local shelters.',
    targetAmount: 5000,
    category: 'Community',
    startDate: '2026-05-01',
    endDate: '2026-06-01',
    status: 'ACTIVE',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  // POST /api/fundraising-activity
  it('returns 201 for successful activity creation', async () => {
    const { postHandler } = await loadRouteHandlers(
      { success: true, message: 'Fundraising activity created successfully.' },
      [], null,
    );
    const response = createResponse();

    await postHandler({ body: validBody }, response);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ success: true, message: 'Fundraising activity created successfully.' });
  });

  it('passes the request body fields to the create controller in order', async () => {
    const { postHandler } = await loadRouteHandlers(
      { success: true, message: 'Fundraising activity created successfully.' },
      [], null,
    );
    const response = createResponse();

    await postHandler({ body: validBody }, response);

    expect(createFundraisingActivityMock).toHaveBeenCalledWith(
      'Help the Community',
      'A fundraiser to support local shelters.',
      5000,
      'Community',
      '2026-05-01',
      '2026-06-01',
    );
  });

  it('returns 400 when the controller returns a create failure result', async () => {
    const { postHandler } = await loadRouteHandlers(
      { success: false, message: 'Failed to create fundraising activity.' },
      [], null,
    );
    const response = createResponse();

    await postHandler({ body: validBody }, response);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ success: false, message: 'Failed to create fundraising activity.' });
  });

  it('returns 400 when save fails', async () => {
    const { postHandler } = await loadRouteHandlers(
      { success: false, message: 'Failed to create fundraising activity.' },
      [], null,
    );
    const response = createResponse();

    await postHandler({ body: validBody }, response);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ success: false, message: 'Failed to create fundraising activity.' });
  });

  it('returns 500 when the create controller throws an error', async () => {
    const { postHandler } = await loadRouteHandlers(null, [], null, true);
    const response = createResponse();

    await postHandler({ body: validBody }, response);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ success: false, message: 'Unable to connect to server.' });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Create fundraising activity request failed:', expect.any(Error));
  });

  // GET /api/fundraising-activity
  it('returns 200 with list of activities', async () => {
    const { getListHandler } = await loadRouteHandlers(null, [mockActivity], null);
    const response = createResponse();

    await getListHandler({ params: {} }, response);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true, activities: [mockActivity] });
  });

  it('returns 200 with empty array when no activities', async () => {
    const { getListHandler } = await loadRouteHandlers(null, [], null);
    const response = createResponse();

    await getListHandler({ params: {} }, response);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true, activities: [] });
  });

  it('returns 500 when the get list controller throws an error', async () => {
    const { getListHandler } = await loadRouteHandlers(null, null, null, false, true);
    const response = createResponse();

    await getListHandler({ params: {} }, response);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ success: false, message: 'Unable to connect to server.' });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Get fundraising activities request failed:', expect.any(Error));
  });

  // GET /api/fundraising-activity/:activityID
  it('returns 200 with activity details when found', async () => {
    const { getDetailHandler } = await loadRouteHandlers(null, [], mockActivity);
    const response = createResponse();

    await getDetailHandler({ params: { activityID: '1' } }, response);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true, activity: mockActivity });
  });

  it('returns 404 when activity is not found', async () => {
    const { getDetailHandler } = await loadRouteHandlers(null, [], null);
    const response = createResponse();

    await getDetailHandler({ params: { activityID: '999' } }, response);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ success: false, message: 'Activity not found.' });
  });

  it('returns 500 when the get detail controller throws an error', async () => {
    const { getDetailHandler } = await loadRouteHandlers(null, [], null, false, false, true);
    const response = createResponse();

    await getDetailHandler({ params: { activityID: '1' } }, response);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ success: false, message: 'Unable to connect to server.' });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Get fundraising activity details request failed:', expect.any(Error));
  });
});
