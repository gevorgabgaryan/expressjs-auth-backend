import { BaseError } from './BaseError';

export class ExistsError extends BaseError {
  constructor() {
    super(401, 'user_exists', 'User exists.');
  }
}
