import { IsBoolean, IsEmail, IsEnum, IsString, IsUUID } from 'class-validator';
import { AutoMap } from '@nartc/automapper';
import { Role } from '../../../enums/Role';

export class UserResponse {
  @AutoMap()
  @IsUUID()
  public id: string;

  @AutoMap()
  @IsString()
  public firstName: string;

  @AutoMap()
  @IsString()
  public lastName: string;

  @AutoMap()
  @IsEmail()
  public email: string;

  @AutoMap()
  @IsEnum(Role)
  public role: Role;

  @AutoMap()
  @IsBoolean()
  public isActive: boolean;
}
