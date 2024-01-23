const mockUserRepository = {};

const mockClientRepository = {
  saveClient: jest.fn(),
};

const mockPhotoRepository = {};

export const UnitOfWorkMock = jest.fn().mockImplementation(() => ({
  userRepository: {},
  clientRepository: mockClientRepository,
  photoRepository: mockPhotoRepository,
  create: jest.fn().mockReturnValue({
    userRepository: mockUserRepository,
    clientRepository: mockClientRepository,
    photoRepository: mockPhotoRepository,
  }),
}));
