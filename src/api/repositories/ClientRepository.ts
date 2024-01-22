import { ClientEntity } from './entities/ClientEntity';
import appDataSource from '../../db/dataSource';
import { Client } from '../services/models/Client';
import { Mapper } from '@nartc/automapper';

export const ClientRepository = appDataSource.getRepository(ClientEntity).extend({
  async findUserByEmail(email: string) {
    return this.findOne({ where: { email } });
  },

  async saveClient(client: Client): Promise<Client> {
    const clientEntity = Mapper.map(client, ClientEntity);
    const savedClient = await this.save(clientEntity);
    return Mapper.map(savedClient, Client);
  },

  async getClient(id: string): Promise<Client | null> {
    const clientEntity = await this.findOne({ where: { id } });
    return clientEntity ? Mapper.map(clientEntity, Client) : null;
  },

  async getClientWithPhotos(id: string): Promise<Client | null> {
    const clientEntity = await this.findOne({ where: { id }, relations: ['photos'] });
    return clientEntity ? Mapper.map(clientEntity, Client) : null;
  },
});
