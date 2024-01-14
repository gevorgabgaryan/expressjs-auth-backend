import { AutoMapper, ProfileBase } from '@nartc/automapper';
import { User } from '../../services/models/User';
import { UserCreateBody } from '../requests/auth/UserCreateBody';
import { UserResponse } from '../responses/User/UserResponse';

export class ControllerMapperProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(User, UserResponse);
    mapper.createMap(UserCreateBody, User);
  }
}
