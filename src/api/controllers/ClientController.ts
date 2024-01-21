import { Mapper } from '@nartc/automapper';
import { Get, Authorized, JsonController, CurrentUser } from 'routing-controllers'; // Import 'Authorized' decorator
import { Service } from 'typedi';
import { AppError } from '../../errors/AppError';
import { ClientService } from '../services/ClientService';
import { Client } from '../services/models/Client';
import { ClientCreateResponse } from './responses/client/ClientCreateResponse';

@Service()
@JsonController('/users')
export class ClientController {
  constructor(private clientService: ClientService) {}
  @Get('/me')
  @Authorized()
  async getMe(@CurrentUser() user: Client) {
    try {
      const clientWithPhotos = await this.clientService.getClientWithPhotos(user.id);
      return Mapper.map(clientWithPhotos, ClientCreateResponse);
    } catch (error: any) {
      throw new AppError(error.stack ? error.stack : '');
    }
  }
}
