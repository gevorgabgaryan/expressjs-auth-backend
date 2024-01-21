import passport from 'passport';
import passportJWT from 'passport-jwt';

import Container from 'typedi';
import { ClientService } from '../../api/services/ClientService';
import config from '../../config';
import { UnauthorizedError } from '../../errors/UnAuthorizedError';
import logger from '../logger';
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const SetupPassport = () => {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.JWTSecret,
      },
      async (jwtPayload, done) => {
        try {
          if (!jwtPayload.id) {
            done(null, false);
          }
          const clientService = Container.get<ClientService>(ClientService);
          const user = await clientService.getClient(jwtPayload.id);
          if (!user) {
            throw new UnauthorizedError();
          }
          if (!user?.isActive) {
            done(null, false);
          }
          done(null, user);
        } catch (error) {
          logger.error(error);
          return done(error, false);
        }
      },
    ),
  );

  return passport;
};

export default SetupPassport;
