import { Action } from 'routing-controllers';
import passport from 'passport';
import { Client } from '../services/models/Client';
import { UnauthorizedError } from '../../errors/UnAuthorizedError';

const authorizationChecker = async (action: Action): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, (err: Error, user: Client) => {
      if (err) {
        return reject(err);
      }
      if (!user) {
        throw new UnauthorizedError();
      }
      action.request.user = user;
      return resolve(true);
    })(action.request, action.response, action.next);
  });
};

export default authorizationChecker;
