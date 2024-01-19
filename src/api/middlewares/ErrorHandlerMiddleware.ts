import { Request, Response } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface, UnauthorizedError } from 'routing-controllers';
import { Service } from 'typedi';
import { ValidationError } from 'class-validator';
import { BaseError } from '../../errors/BaseError';
import { AppError } from '../../errors/AppError';
import { NotFoundError } from '../../errors/NotFoundError';
import { AppBadRequestError } from '../../errors/AppBadRequestError';
import { ErrorField } from '../../types';
import { ExistsError } from '../../errors/ExistsError';

@Service()
@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: any, req: Request, res: Response) {
    let baseError: any;
    switch (true) {
      case 'errors' in error &&
        Array.isArray(error.errors) &&
        error.errors.every((e: any) => e instanceof ValidationError):
        baseError = new AppBadRequestError(this.mapValidationErrors(error.errors as ValidationError[]));
        break;
      case error instanceof BaseError:
        baseError = error;
        break;
      case error instanceof UnauthorizedError:
        baseError = new UnauthorizedError();
        break;
      case error instanceof NotFoundError:
        baseError = new NotFoundError();
        break;
      case error instanceof ExistsError:
        baseError = new ExistsError();
        break;
      default:
        baseError = new AppError(error.message);
        break;
    }

    res.status(baseError.status ? baseError.status : 400);
    res.json(baseError);
  }

  private mapValidationErrors(errors: ValidationError[]): ErrorField[] {
    const result: ErrorField[] = [];
    errors.forEach((error) => {
      const property = error.property;
      const constraints = Object.values(error.constraints || {});
      result.push({ field: property, constraints });
    });

    return result;
  }
}
