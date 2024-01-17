import { Mapper } from '@nartc/automapper';
import { Get, Authorized, JsonController, CurrentUser } from 'routing-controllers'; // Import 'Authorized' decorator
import { Service } from 'typedi';
import { CustomError } from '../../errors/CustomError';
import { User } from '../services/models/User';
import { UserResponse } from './responses/User/UserResponse';

@Service()
@JsonController('/users')
export class UserController {
  @Get('/me')
  @Authorized()
  async getMe(@CurrentUser() user: User) {
    if (!user) {
      throw new CustomError('User not found');
    }
    return Mapper.map(user, UserResponse);
  }
}
