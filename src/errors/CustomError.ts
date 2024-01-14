import { HttpError } from 'routing-controllers';

export class CustomError extends HttpError {
  constructor(message: string) {
    super(404, message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
