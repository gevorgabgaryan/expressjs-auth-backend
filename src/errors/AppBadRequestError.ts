import { BadRequestError } from 'routing-controllers';
import { ErrorField } from '../api/controllers/types/ErrorField';

export class AppBadRequestError extends BadRequestError {
  public readonly details: ErrorField[];
  constructor(message: string = 'Bad Request', details: ErrorField[] = []) {
    super(message);
    this.details = details;
  }
}
