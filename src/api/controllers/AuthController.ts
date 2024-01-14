import { Post, Controller, UseBefore, Req, Body, BadRequestError } from 'routing-controllers';
import { UserCreateBody } from './requests/auth/UserCreateBody';
import { UserService } from '../services/UserService';
import { Service } from 'typedi';
import { UploadFileRequest } from './requests/auth/UploadFileRequest'; // Corrected import statement
import { fileUploadMiddleware } from './middlewares/fileUploadMiddleware ';
import { Mapper } from '@nartc/automapper';
import { UserResponse } from './responses/User/UserResponse';
import { CustomError } from '../../errors/CustomError';

@Service()
@Controller()
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @UseBefore(fileUploadMiddleware)
  async register(@Body() body: UserCreateBody, @Req() req: UploadFileRequest) {
    if (!req.is('multipart/form-data')) {
      throw new CustomError('Unsupported content type, expecting multipart/form-data');
    }
    const files = req.files;
    const newUser = await this.userService.addUser(body, files);
    return Mapper.map(newUser, UserResponse);
  }
}
