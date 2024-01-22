import { UserEntity } from './entities/UserEntity';
import appDataSource from '../../db/dataSource';

export const UserRepository = appDataSource.getRepository(UserEntity).extend({});
