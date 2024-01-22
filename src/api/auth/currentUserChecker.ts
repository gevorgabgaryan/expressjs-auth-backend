import { Action } from 'routing-controllers';
import { Client } from '../services/models/Client';

const currentUserChecker = async (action: Action): Promise<Client | undefined> => {
  return action.request.user;
};

export default currentUserChecker;
