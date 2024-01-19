import * as express from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import RateLimit from 'express-rate-limit';
import { Constants } from '../helpers/Constants';
import { Service } from 'typedi';

@Service()
@Middleware({ type: 'before' })
export class RateLimitingMiddleware implements ExpressMiddlewareInterface {
  private limiter = RateLimit({
    windowMs: Constants.rateLimiting.windowMs,
    max: Constants.rateLimiting.maxCount,
  });

  public use(req: express.Request, res: express.Response, next: express.NextFunction): any {
    this.limiter(req, res, next);
  }
}
