import { createLogger, format, transports } from 'winston';
import config from '../../config';

const logger = createLogger({
  transports: [
    new transports.File({
      level: 'error',
      maxsize: 10000000,
      maxFiles: 5,
      filename: 'logs/error.log',
    }),
    new transports.File({
      level: 'info',
      maxsize: 10000000,
      maxFiles: 5,
      filename: 'logs/info.log',
    }),
  ],
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss',
    }),
    format.printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`),
  ),
});

if (config.nodeEnv !== 'production') {
  logger.add(
    new transports.Console({
      handleExceptions: true,
      format: format.combine(
        format.timestamp({
          format: 'MMM-DD-YYYY HH:mm:ss',
        }),
        format.colorize(),
        format.printf((info) => {
          const timestamp = info.timestamp || '';
          const message = info.message || '';
          const stack = info.stack || '';
          return `${timestamp} ${info.level}: ${message}\n${stack}`;
        }),
      ),
    }),
  );
}

export default logger;
