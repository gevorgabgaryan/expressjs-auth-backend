import { appDataSource } from './dataSource';
import logger from '../lib/logger';

class TypeORM {
  static async init() {
    try {
      await appDataSource.initialize();
      logger.info('db connection has been initialized!');
    } catch (err) {
      logger.error('Error during db connection initialization:', err);
      throw err;
    }
  }
}

export default TypeORM;
