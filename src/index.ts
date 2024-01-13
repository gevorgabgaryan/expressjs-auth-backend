import 'reflect-metadata';
import TypeORM from './db';
import logger from './lib/logger';

(async () => {
  try {
    await TypeORM.init();
  } catch (err) {
    logger.error('Initializing error', err);
  }
})();
