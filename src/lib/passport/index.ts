import passport from 'passport';
import passportJWT from 'passport-jwt';

import Container from 'typedi';
import { UserService } from '../../api/services/UserService';
import config from '../../config';
import { UnauthorizedError } from '../../errors/UnAuthorizedError';
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
        if (!jwtPayload.id) {
          done(null, false);
        }
        const userService = Container.get<UserService>(UserService);
        const user = await userService.getUser(jwtPayload.id);
        if (!user) {
          throw new UnauthorizedError();
        }
        if (!user?.isActive) {
          done(null, false);
        }
        done(null, user);
      },
    ),
  );

  return passport;
};

export default SetupPassport;
