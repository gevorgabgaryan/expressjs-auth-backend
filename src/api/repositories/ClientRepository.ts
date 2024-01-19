import { ClientEntity } from './entities/ClientEntity';
import appDataSource from '../../db/dataSource';

export const ClientRepository = appDataSource.getRepository(ClientEntity).extend({
  async findUserByEmail(email: string) {
    return this.findOne({ where: { email } });
  },

  async saveClient(client: ClientEntity) {
    return this.save(client);
  },

  async getUser(userId: string): Promise<ClientEntity | null> {
    return this.findOne({ where: { id: userId }, relations: ['photos'] });
  },
});
