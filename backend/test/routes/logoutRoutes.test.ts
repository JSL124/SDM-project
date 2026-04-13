describe('logoutRoutes', () => {
  async function loadHandler(logoutResult: boolean) {
    jest.resetModules();
    jest.doMock('../../src/logout/controller/LogoutController', () => ({
      LogoutController: jest.fn().mockImplementation(() => ({
        logout: jest.fn().mockReturnValue(logoutResult),
      })),
    }));

    const { default: logoutRoutes } = await import('../../src/routes/logoutRoutes');
    return (logoutRoutes as any).stack[0].route.stack[0].handle;
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

  it('returns 200 with success true when logout succeeds', async () => {
    const handler = await loadHandler(true);
    const response = createResponse();

    await handler({}, response);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
    });
  });
});
