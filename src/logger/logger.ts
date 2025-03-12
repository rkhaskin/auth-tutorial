import winston from "winston";
const { combine, timestamp, simple } = winston.format;

export const consoleLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",

  transports: [
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    new winston.transports.Console({
      format: combine(timestamp(), simple()),
    }),
  ],
});

export const fileLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), simple()),
  transports: [
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    new winston.transports.File({
      filename: process.env.LOG_FILENAME || "auth-log.txt",
    }),
  ],
});
