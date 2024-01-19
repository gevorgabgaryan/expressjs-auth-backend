import { BadRequestError } from 'routing-controllers';
import { ErrorField } from '../types';

export class AppBadRequestError extends BadRequestError {
  public readonly details: ErrorField[];

  constructor(details: ErrorField[] = []) {
    super();
    this.details = details;
  }
}
