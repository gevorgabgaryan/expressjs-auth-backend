import { IsJWT, IsNotEmpty } from 'class-validator';
import { AutoMap } from '@nartc/automapper';

export class AuthResponse {
  @AutoMap()
  @IsJWT()
  @IsNotEmpty()
  public token: string;
}
