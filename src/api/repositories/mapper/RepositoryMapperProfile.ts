import { AutoMapper, ProfileBase, ignore, mapFrom } from '@nartc/automapper';
import { BaseModel } from '../../services/models/BaseModel';
import { Photo } from '../../services/models/Photo';
import { Client } from '../../services/models/Client';
import { BaseEntity } from '../entities/BaseEntity';
import { ClientEntity } from '../entities/ClientEntity';
import { PhotoEntity } from '../entities/PhotoEntity';
import { UserEntity } from '../entities/UserEntity';
import { User } from '../../services/models/User';
export class RepositoryMapperProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper
      .createMap(UserEntity, User, {
        includeBase: [BaseEntity, BaseModel],
      })
      .reverseMap();

    mapper.createMap(ClientEntity, Client, {
      includeBase: [UserEntity, User],
    });

    mapper.createMap(Client, ClientEntity, {
      includeBase: [User, UserEntity],
    });

    mapper
      .createMap(Photo, PhotoEntity, {
        includeBase: [BaseModel, BaseEntity],
      })
      .forMember(
        (d) => d.user,
        mapFrom((s) => s.user),
      );

    mapper
      .createMap(PhotoEntity, Photo, {
        includeBase: [BaseEntity, BaseModel],
      })
      .forMember((d) => d.createdAt, ignore())
      .forMember((d) => d.updatedAt, ignore());
  }
}
