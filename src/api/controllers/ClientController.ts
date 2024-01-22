import { Mapper } from '@nartc/automapper';
import { Get, Authorized, JsonController, CurrentUser } from 'routing-controllers'; // Import 'Authorized' decorator
import { Service } from 'typedi';
import { AppError } from '../../errors/AppError';
import { ClientService } from '../services/ClientService';
import { Client } from '../services/models/Client';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { GetClientResponse } from './responses/client/GetClientResponse';
@Service()
@JsonController('/users')
@OpenAPI({ security: [{ basicAuth: [] }] })
export class ClientController {
  constructor(private clientService: ClientService) {}
  @Get('/me')
  @Authorized()
  @ResponseSchema(GetClientResponse)
  async getMe(@CurrentUser() user: Client): Promise<GetClientResponse> {
    try {
      const clientWithPhotos = await this.clientService.getClientWithPhotos(user.id);
      return Mapper.map(clientWithPhotos, GetClientResponse);
    } catch (error: any) {
      throw new AppError(error.stack ? error.stack : '');
    }
  }
}
