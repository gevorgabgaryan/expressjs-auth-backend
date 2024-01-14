import { AutoMapper, ProfileBase } from '@nartc/automapper';
import { BaseModel } from '../../services/models/BaseModel';
import { User } from '../../services/models/User';
import { BaseEntity } from '../entities/BaseEntity';
import { ClientEntity } from '../entities/ClientEntity';
import { UserEntity } from '../entities/UserEntity';

export class RepositoryMapperProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper
      .createMap(UserEntity, User, {
        includeBase: [BaseEntity, BaseModel],
      })
      .reverseMap();

    mapper
      .createMap(ClientEntity, User, {
        includeBase: [BaseEntity, BaseModel],
      })
      .reverseMap();
  }
}
