import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
      bindings: () => {
        return {};
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  isDevelopment ? pino.transport({
    target: 'pino-pretty',
    options: {
      colorize: true,
      singleLine: false,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  }) : undefined
);

export const createRequestLogger = () => {
  return (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const level = res.statusCode >= 400 ? 'warn' : 'info';
      
      logger[level]({
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('user-agent'),
        ip: req.ip,
      });
    });
    
    next();
  };
};
