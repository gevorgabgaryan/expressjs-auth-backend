const mockUserRepository = {};

const mockClientRepository = {
  saveClient: jest.fn(),
  getClient: jest.fn(),
  getClientWithPhotos: jest.fn(),
  findUserByEmail: jest.fn(),
};

const mockPhotoRepository = {
  savePhoto: jest.fn(),
};

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
