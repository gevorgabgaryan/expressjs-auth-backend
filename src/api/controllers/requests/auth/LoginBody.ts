import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class LoginBody {
  @IsEmail()
  @IsNotEmpty()
  @JSONSchema({ example: 'email@test.com' })
  public email: string;

  @IsString()
  @IsNotEmpty()
  @JSONSchema({ example: 'Password1' })
  public password: string;
}
