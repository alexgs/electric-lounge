/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as env from 'env-var';
import path from 'path';
import winston from 'winston';

const LOG_CRON_PATH = env.get('LOG_CRON_PATH').default(process.cwd()).asString();
const SCRIPT_NAME = 'capture-playlist-snapshot';

const LOG_FILE = path.resolve(LOG_CRON_PATH, `${SCRIPT_NAME}.log`);
const TRACE_FILE = path.resolve(LOG_CRON_PATH, `${SCRIPT_NAME}.trace.log`);

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
      new winston.transports.File({ filename: TRACE_FILE }),
      new winston.transports.File({
        filename: LOG_FILE,
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
