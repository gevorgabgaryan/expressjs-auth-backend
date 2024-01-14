import 'reflect-metadata';
import TypeORM from './db';
import logger from './lib/logger';
import App from './api';

(async () => {
  try {
    await TypeORM.init();
    await App.init();
  } catch (err) {
    logger.error('Initializing error', err);
  }
})();

process.on('unhandledRejection', (err) => {
  logger.error('unhandledRejection');
  logger.error(err);
  throw err;
});

process.on('uncaughtException', (err) => {
  logger.error('uncaughtException');
  logger.error(err);
});
