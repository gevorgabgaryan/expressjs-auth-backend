import { Request, Response } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface, UnauthorizedError, HttpError } from 'routing-controllers';
import { Service } from 'typedi';
import { ValidationError } from 'class-validator';
import { BaseError } from '../../errors/BaseError';
import { AppError } from '../../errors/AppError';
import { NotFoundError } from '../../errors/NotFoundError';
import { AppBadRequestError } from '../../errors/AppBadRequestError';
import { ExistsError } from '../../errors/ExistsError';
import { ErrorField } from '../controllers/types/ErrorField';

@Service()
@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: any, req: Request, res: Response) {
    // console.log(error);
    console.dir(error, { depth: 7 });
    let baseError: any;
    switch (true) {
      case 'errors' in error &&
        Array.isArray(error.errors) &&
        error.errors.every((e: any) => e instanceof ValidationError):
        baseError = new AppBadRequestError(
          'Bad request schema',
          this.mapValidationErrors(error.errors as ValidationError[]),
        );
        break;
      case error instanceof HttpError:
      case error instanceof AppBadRequestError:
        baseError = error;
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

    res.status(baseError.status ? baseError.status : 500);
    res.json(baseError);
  }

  private mapValidationErrors(errors: ValidationError[]): ErrorField[] {
    const result: ErrorField[] = [];

    errors.forEach((error) => {
      const property = error.property;
      const constraints = Object.values(error.constraints || []);
      let childConstraints: string[] = [];

      if (error.children && error.children.length > 0) {
        const childErrors = this.mapValidationErrors(error.children);

        // Extract constraints from child errors
        childConstraints = childErrors.reduce<string[]>((acc, childError) => {
          return acc.concat(childError.constraints);
        }, []);

        // Remove duplicate constraints from child errors
        childConstraints = Array.from(new Set(childConstraints));
      }

      // Remove duplicate constraints from the current error
      const uniqueConstraints = Array.from(new Set(constraints));

      // Combine constraints from the current error and child errors
      const combinedConstraints = [...uniqueConstraints, ...childConstraints];

      result.push({ field: property, constraints: combinedConstraints });
    });

    return result;
  }
}
