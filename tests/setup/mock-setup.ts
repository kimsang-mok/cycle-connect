jest.mock('@src/libs/application/context/AppRequestContext', () => ({
  RequestContextService: {
    getContext: jest.fn(() => ({
      requestId: 'test-request-id',
      user: { id: 'mock-user-id' },
    })),
  },
}));
