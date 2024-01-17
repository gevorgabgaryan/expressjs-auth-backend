import { Service } from 'typedi';
import { Repository } from 'typeorm';
import appDataSource from '../../db/dataSource';
import { UserCreateBody } from '../controllers/requests/auth/UserCreateBody';
import { ClientEntity } from '../repositories/entities/ClientEntity';
import { PhotoEntity } from '../repositories/entities/PhotoEntity';
import * as argon from 'argon2';
import { UploadedFile } from '../controllers/types/UploadFile';
import { Mapper } from '@nartc/automapper';
import { User } from './models/User';
import { CustomError } from '../../errors/CustomError';

@Service()
export class UserService {
  private clientRepository: Repository<ClientEntity> = appDataSource.getRepository(ClientEntity);
  private photoRepository: Repository<PhotoEntity> = appDataSource.getRepository(PhotoEntity);

  async addUser(userData: UserCreateBody, files: UploadedFile[]): Promise<User> {
    const existingUser = await this.clientRepository.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new CustomError('credentials are taken');
    }

    const passwordHash = await argon.hash(userData.password);

    const client = new ClientEntity();
    client.firstName = userData.firstName;
    client.lastName = userData.lastName;
    client.email = userData.email;
    client.passwordHash = passwordHash;

    client.avatar = files.length > 0 ? files[0].path : 'default-avatar-url';

    const savedClient = await this.clientRepository.save(client);

    const photoPromises = files.map((file) => {
      const photo = new PhotoEntity();
      photo.name = file.filename;
      photo.url = file.path;
      photo.user = savedClient;
      return this.photoRepository.save(photo);
    });

    await Promise.all(photoPromises);

    return Mapper.map(savedClient, User);
  }

  public async getUser(userId: string): Promise<User | undefined> {
    const userEntity = await this.clientRepository.findOne({ where: { id: userId }, relations: ['photos'] });
    if (!userEntity) {
      return undefined;
    }
    return Mapper.map(userEntity, User);
  }
}
