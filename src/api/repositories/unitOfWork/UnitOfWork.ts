import { Service } from 'typedi';
import { EntityManager } from 'typeorm';
import { ClientRepository } from '../ClientRepository';
import { PhotoRepository } from '../PhotoRepository';
import { UserRepository } from '../UserRepository';

@Service()
export class UnitOfWork {
  constructor(
    public userRepository: typeof UserRepository,
    public clientRepository: typeof ClientRepository,
    public photoRepository: typeof PhotoRepository,
  ) {}

  public static create(manager: EntityManager): UnitOfWork {
    return new UnitOfWork(
      manager.withRepository(UserRepository),
      manager.withRepository(ClientRepository),
      manager.withRepository(PhotoRepository),
    );
  }
}
