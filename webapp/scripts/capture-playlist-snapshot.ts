/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import winston from 'winston';

const SCRIPT_NAME = 'capture-playlist-snapshot';

const myFormat = (info: Record<string, string>) =>
  `[${info.timestamp}] ${info.script} ${info.level.toUpperCase()}: ` +
  info.message;

async function main() {
  const logger = winston.createLogger({
    defaultMeta: { script: SCRIPT_NAME },
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
    ),
    level: 'silly',
    transports: [
      new winston.transports.File({ filename: 'cron-trace.log' }),
      new winston.transports.File({
        filename: 'cron.log',
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf(myFormat),
        ),
      }),
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf(myFormat),
        ),
      }),
    ],
  });

  logger.verbose(`Script \`${SCRIPT_NAME}\` starting.`);
  const now = await new Promise<Date>((resolve) => {
    resolve(new Date());
  });
  logger.info(`The current time is ${now.toISOString()}.`);
  logger.verbose(`Script \`${SCRIPT_NAME}\` finished.`);
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
