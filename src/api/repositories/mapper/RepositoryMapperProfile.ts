import { AutoMapper, ProfileBase, mapWith } from '@nartc/automapper';
import { BaseModel } from '../../services/models/BaseModel';
import { Photo } from '../../services/models/Photo';
import { User } from '../../services/models/User';
import { BaseEntity } from '../entities/BaseEntity';
import { ClientEntity } from '../entities/ClientEntity';
import { PhotoEntity } from '../entities/PhotoEntity';
import { UserEntity } from '../entities/UserEntity';

export class RepositoryMapperProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper
      .createMap(UserEntity, User, {
        includeBase: [BaseEntity, BaseModel],
      })
      .reverseMap();

    mapper.createMap(PhotoEntity, Photo).reverseMap();
    mapper.createMap(PhotoEntity, PhotoEntity).reverseMap();

    mapper
      .createMap(ClientEntity, User, {
        includeBase: [BaseEntity, BaseModel],
      })
      .forMember(
        (d) => d.photos,
        mapWith(PhotoEntity, (s: ClientEntity) => s.photos),
      );
  }
}
