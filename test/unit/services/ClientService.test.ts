import argon from 'argon2';
import { BaseTransactionable } from '../../../src/api/services/base/BaseTransactionable';
import { ClientService } from '../../../src/api/services/ClientService';
import { Client } from '../../../src/api/services/models/Client';
import { PhotoService } from '../../../src/api/services/PhotoService';
import { ExistsError } from '../../../src/errors/ExistsError';
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
  describe('saveClient', () => {
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

    it('should throw an ExistsError when adding a client with an existing email', async () => {
      const clientData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing.email@example.com',
        password: 'password123',
        files: [],
      };

      const saveClientSpy = jest
        .spyOn(unitOfWork.clientRepository, 'saveClient')
        .mockRejectedValueOnce({ code: '23505' });
      await expect(clientService.addClient(clientData)).rejects.toThrow(ExistsError);
      expect(saveClientSpy).toHaveBeenCalled();
    });
  });
  describe('getClient', () => {
    it('should get a client by ID successfully', async () => {
      const clientId = 'someClientId';
      const expectedClient = new Client();
      const getClientSpy = jest.spyOn(unitOfWork.clientRepository, 'getClient').mockResolvedValueOnce(expectedClient);

      const result = await clientService.getClient(clientId);

      expect(getClientSpy).toHaveBeenCalledWith(clientId);
      expect(result).toEqual(expectedClient);
    });

    it('should return null if client not found by ID', async () => {
      const clientId = 'nonexistentClientId';
      const getClientSpy = jest.spyOn(unitOfWork.clientRepository, 'getClient').mockResolvedValueOnce(null);

      const result = await clientService.getClient(clientId);

      expect(getClientSpy).toHaveBeenCalledWith(clientId);
      expect(result).toBeNull();
    });
  });

  describe('getClientWithPhotos', () => {
    it('should get a client with photos by ID successfully', async () => {
      const clientId = 'someClientId';
      const expectedClient = new Client();
      const getClientWithPhotosSpy = jest
        .spyOn(unitOfWork.clientRepository, 'getClientWithPhotos')
        .mockResolvedValueOnce(expectedClient);

      const result = await clientService.getClientWithPhotos(clientId);

      expect(getClientWithPhotosSpy).toHaveBeenCalledWith(clientId);
      expect(result).toEqual(expectedClient);
    });

    it('should return null if client with photos not found by ID', async () => {
      const clientId = 'nonexistentClientId';
      const getClientWithPhotosSpy = jest
        .spyOn(unitOfWork.clientRepository, 'getClientWithPhotos')
        .mockResolvedValueOnce(null);

      const result = await clientService.getClientWithPhotos(clientId);

      expect(getClientWithPhotosSpy).toHaveBeenCalledWith(clientId);
      expect(result).toBeNull();
    });
  });
});
