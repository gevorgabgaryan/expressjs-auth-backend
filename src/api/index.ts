import { createExpressServer, useContainer } from 'routing-controllers';
import controllers from './controllers';
import { Application, static as expressStatic } from 'express';
import { Server } from 'http';
import { Container } from 'typedi';
import config from '../config';
import logger from '../lib/logger';
import { RepositoryMapperProfile } from './repositories/mapper/RepositoryMapperProfile';
import { ControllerMapperProfile } from './controllers/mapper/ControllerMapperProfile';
import { Mapper } from '@nartc/automapper';
import { ErrorHandlerMiddleware } from './middlewares/ErrorHandlerMiddleware';
import SetupPassport from '../lib/passport';
import { LogMiddleware } from './middlewares/LogMiddleware';
import authorizationChecker from './auth/authorizationChecker';
import currentUserChecker from './auth/currentUserChecker';

class App {
  static server: Server;
  static async init() {
    const passport = SetupPassport();
    useContainer(Container);
    const app: Application = createExpressServer({
      cors: true,
      controllers,
      middlewares: [ErrorHandlerMiddleware, LogMiddleware],
      routePrefix: config.routePrefix,
      validation: {
        whitelist: true,
      },
      defaultErrorHandler: false,
      authorizationChecker: authorizationChecker,
      currentUserChecker: currentUserChecker,
    });

    app.use(passport.initialize());
    app.use('/public', expressStatic('public'));

    App.initAutoMapper();
    const server = app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
    });

    App.server = server;
    return server;
  }

  static async close() {
    if (App.server) {
      App.server.close(() => {
        logger.info('Server closed.');
      });
    }
  }

  static initAutoMapper() {
    Mapper.addProfile(RepositoryMapperProfile);
    Mapper.addProfile(ControllerMapperProfile);
  }
}

export default App;
