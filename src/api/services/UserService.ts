import { Service } from 'typedi';
import { UserCreateBody } from '../controllers/requests/auth/UserCreateBody';
import * as argon from 'argon2';
import { UploadedFile } from '../controllers/types/UploadFile';
import { Mapper } from '@nartc/automapper';
import { User } from './models/User';
import { deleteUploadedFiles } from '../helpers';
import { ClientEntity } from '../repositories/entities/ClientEntity';
import { PhotoEntity } from '../repositories/entities/PhotoEntity';
import { BaseTransactionable } from './base/BaseTransactionable';
import { ExistsError } from '../../errors/ExistsError';

@Service()
export class UserService extends BaseTransactionable {
  constructor() {
    super();
  }

  async addUser(userData: UserCreateBody, files: UploadedFile[]): Promise<User> {
    let savedClient;
    try {
      savedClient = await this.transaction(async (unitOfWork) => {
        const passwordHash = await argon.hash(userData.password);
        const client = new ClientEntity();
        client.firstName = userData.firstName;
        client.lastName = userData.lastName;
        client.email = userData.email;
        client.passwordHash = passwordHash;
        client.avatar = files.length > 0 ? files[0].path : 'default-avatar-url';

        const savedClient = await unitOfWork.clientRepository.saveClient(client);

        for (const file of files) {
          const photo = new PhotoEntity();
          photo.name = file.filename;
          photo.url = file.path;
          photo.user = savedClient;
          await unitOfWork.photoRepository.savePhoto(photo);
        }

        return savedClient;
      });
    } catch (error: any) {
      await deleteUploadedFiles(files);
      if (error.code === '23505') {
        throw new ExistsError();
      }
      throw error;
    }

    return Mapper.map(savedClient, User);
  }

  public async getUser(userId: string): Promise<User | null> {
    const user = await this.transaction(async (unitOfWork) => {
      const userEntity = await unitOfWork.clientRepository.getUser(userId);
      if (!userEntity) {
        return null;
      }
      return Mapper.map(userEntity, User);
    });
    return user;
  }
}
