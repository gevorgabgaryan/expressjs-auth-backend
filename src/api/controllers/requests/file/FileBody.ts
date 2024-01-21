import { IsString, IsNotEmpty, IsIn, IsNumber, Max } from 'class-validator';

export class FileBody {
  @IsString()
  @IsNotEmpty()
  originalname: string;

  @IsNotEmpty()
  @IsIn(['jpeg', 'png'], { message: 'Attached file type can be only jpeg or png' })
  filetype: string;

  @IsNotEmpty()
  @IsNumber()
  @Max(3 * 1024 * 1024, { message: 'Each attached photo size must not exceed 3MB' })
  size: number;

  @IsNotEmpty()
  buffer: Buffer;
}
