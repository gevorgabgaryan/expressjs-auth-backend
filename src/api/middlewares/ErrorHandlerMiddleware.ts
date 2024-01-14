import { Request, Response } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';
import { Service } from 'typedi';
import { ValidationError } from 'class-validator';
import { CustomError } from '../../errors/CustomError';
import logger from '../../lib/logger';

interface ErrorField {
  field: string;
  constraints: string[];
}

interface ErrorResponse {
  code: number;
  message: string;
  details?: ErrorField[];
}

@Service()
@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  error(err: any, req: Request, res: Response) {
    logger.error(err);
    let responseObj: ErrorResponse;
    let statusCode: number;

    if ('errors' in err && Array.isArray(err.errors) && err.errors.every((e: any) => e instanceof ValidationError)) {
      statusCode = 400;
      responseObj = {
        code: 400,
        message: 'Invalid request schema',
        details: this.mapValidationErrors(err.errors as ValidationError[]),
      };
    } else if (err instanceof CustomError || err instanceof HttpError) {
      statusCode = err.httpCode;
      responseObj = {
        code: err.httpCode,
        message: err.message,
      };
    } else {
      statusCode = 500;
      responseObj = {
        code: 500,
        message: 'Unexpected error',
      };
    }

    res.status(statusCode).json(responseObj);
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
