import argon from 'argon2';
import { BaseTransactionable } from '../../../src/api/services/base/BaseTransactionable';
import { ClientService } from '../../../src/api/services/ClientService';
import { Client } from '../../../src/api/services/models/Client';
import { PhotoService } from '../../../src/api/services/PhotoService';
import { UnitOfWorkMock } from '../UnitOfWorkMock/UnitOfWorkMock';

describe('ClientService', () => {
  let clientService: ClientService;
  let photoService: PhotoService;

  const unitOfWork = UnitOfWorkMock();

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (BaseTransactionable.prototype.transaction as jest.Mock) = jest.fn((runInTransaction: any) => {
      return runInTransaction(unitOfWork);
    });
    photoService = new PhotoService();
    clientService = new ClientService(photoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    photoService = new PhotoService();
    clientService = new ClientService(photoService);
  });

  it('should add a new client successfully', async () => {
    const clientData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      files: [],
    };
    const expectedClient = new Client();
    const saveClientSpy = jest.spyOn(unitOfWork.clientRepository, 'saveClient').mockResolvedValueOnce(expectedClient);
    const savePhotoSpy = jest.spyOn(photoService, 'savePhotos').mockResolvedValueOnce([]);

    const result = await clientService.addClient(clientData);

    expect(saveClientSpy).toHaveBeenCalled();
    expect(savePhotoSpy).toHaveBeenCalled();
    expect(photoService.savePhotos).toHaveBeenCalledWith(clientData.files, expectedClient, unitOfWork);
    expect(result).toEqual(expectedClient);
  });
});
