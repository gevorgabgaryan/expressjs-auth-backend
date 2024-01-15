import { Action } from 'routing-controllers';
import { User } from '../services/models/User';

const currentUserChecker = async (action: Action): Promise<User | undefined> => {
  return action.request.user;
};

export default currentUserChecker;
