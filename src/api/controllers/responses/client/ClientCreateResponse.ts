import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { AutoMap } from '@nartc/automapper';
import { Role } from '../../../enums/Role';
import { PhotoResponse } from '../file/PhotoResponse';

export class ClientCreateResponse {
  @AutoMap()
  @IsUUID()
  public id: string;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  public fullName: string;

  @AutoMap()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @AutoMap()
  @IsEnum(Role)
  @IsNotEmpty()
  public role: Role;

  @AutoMap()
  @IsBoolean()
  @IsNotEmpty()
  public isActive: boolean;
  @AutoMap()
  @IsNotEmpty()
  public avatar: string;

  @AutoMap(() => PhotoResponse)
  @ValidateNested({ each: true })
  @IsArray()
  @IsNotEmpty()
  @ArrayNotEmpty()
  public photos: PhotoResponse[];
}
