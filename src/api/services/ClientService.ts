import { Service } from 'typedi';
import * as argon from 'argon2';
import { Client } from './models/Client';
import { ExistsError } from '../../errors/ExistsError';
import { PhotoService } from './PhotoService';
import { ClientCreateBody } from '../controllers/requests/client/ClientCreateBody';
import { BaseService } from './BaseService';
import { Constants } from '../helpers/Constants';

@Service()
export class ClientService extends BaseService {
  constructor(private photoService: PhotoService) {
    super();
  }

  public async addClient(clientData: ClientCreateBody): Promise<Client> {
    try {
      return await this.transaction(async (unitOfWork) => {
        const passwordHash = await argon.hash(clientData.password);
        const client = new Client();
        this.addIdAndTimestamps(client);
        client.firstName = clientData.firstName;
        client.lastName = clientData.lastName;
        client.email = clientData.email;
        client.passwordHash = passwordHash;
        client.role = 'client';
        client.isActive = true;
        client.avatar = Constants.avatarPath;
        const savedClient = await unitOfWork.clientRepository.saveClient(client);
        savedClient.photos = await this.photoService.savePhotos(clientData.files, savedClient, unitOfWork);
        return savedClient;
      });
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ExistsError();
      }
      throw error;
    }
  }

  public async getClient(clientId: string): Promise<Client | null> {
    return await this.transaction(async (unitOfWork) => {
      return await unitOfWork.clientRepository.getClient(clientId);
    });
  }

  public async getClientWithPhotos(clientId: string): Promise<Client | null> {
    return await this.transaction(async (unitOfWork) => {
      return await unitOfWork.clientRepository.getClientWithPhotos(clientId);
    });
  }
}
