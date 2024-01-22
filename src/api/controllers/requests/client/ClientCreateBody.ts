import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { FileBody } from '../file/FileBody';

export class ClientCreateBody {
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(25)
  @IsNotEmpty()
  public lastName: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @IsNotEmpty()
  public password: string;

  @ValidateNested({ each: true })
  @Type(() => FileBody)
  @ArrayMinSize(4, { message: 'Min attached photos: 4 elements' })
  @ArrayMaxSize(10, { message: 'Max attached photos: 10 elements' })
  @IsNotEmpty()
  public files: FileBody[];
}
