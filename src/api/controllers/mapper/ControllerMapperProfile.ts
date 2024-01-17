import { AutoMapper, ProfileBase, mapWith } from '@nartc/automapper';
import { Auth } from '../../services/models/Auth';
import { Photo } from '../../services/models/Photo';
import { User } from '../../services/models/User';
import { UserCreateBody } from '../requests/auth/UserCreateBody';
import { AuthResponse } from '../responses/Auth/AuthResponse';
import { UserResponse } from '../responses/User/UserResponse';

export class ControllerMapperProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(User, UserResponse).forMember(
      (dest) => dest.photos,
      mapWith(Photo, (s: User) => s.photos),
    );
    mapper.createMap(UserCreateBody, User);
    mapper.createMap(Auth, AuthResponse).reverseMap();
  }
}
