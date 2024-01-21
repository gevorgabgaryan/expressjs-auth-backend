import { AutoMapper, ProfileBase, mapWith } from '@nartc/automapper';
import { Auth } from '../../services/models/Auth';
import { Photo } from '../../services/models/Photo';
import { Client } from '../../services/models/Client';
import { ClientCreateBody } from '../requests/client/ClientCreateBody';
import { AuthResponse } from '../responses/auth/LoginResponse';
import { ClientCreateResponse } from '../responses/client/ClientCreateResponse';
import { PhotoResponse } from '../responses/file/PhotoResponse';

export class ControllerMapperProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Client, ClientCreateResponse).forMember(
      (dest) => dest.photos,
      mapWith(PhotoResponse, (s: Client) => s.photos),
    );
    mapper.createMap(ClientCreateBody, Client);
    mapper.createMap(Auth, AuthResponse).reverseMap();
    mapper.createMap(Photo, PhotoResponse).reverseMap();
  }
}
