/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as env from 'env-var';
import path from 'path';
import winston from 'winston';

import { prisma } from '../lib';
import { getValidAccessToken } from '../lib/spotify/oauth';

const EL_USER_ID = 1;
const EXIT_CODES = {
  UNCAUGHT: 1,
  CREDENTIAL: 2,
}
const LOG_CRON_PATH = env.get('LOG_CRON_PATH').default(process.cwd()).asString();
const MARCH_2021 = '2FIcB7cjbzbCY7QcOU3NO6';
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
        level: 'verbose',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf(myFormat),
        ),
      }),
    ],
  });

  logger.verbose(`Script \`${SCRIPT_NAME}\` starting.`);

  const idResult = await prisma.account.findFirst({
    where: {
      userId: EL_USER_ID,
      providerId: 'spotify',
    },
  });
  if (!idResult) {
    logger.error(`Unable to retrieve Spotify ID for user ID ${EL_USER_ID}.`);
    process.exit(EXIT_CODES.CREDENTIAL);
  }
  const spotifyId = idResult.providerAccountId;

  const tokenResult = await getValidAccessToken(EL_USER_ID);
  if (!tokenResult?.accessToken) {
    logger.error(`Unable to retrieve Spotify access token for user ID ${EL_USER_ID}.`);
    process.exit(EXIT_CODES.CREDENTIAL);
  }
  const spotifyToken = tokenResult.accessToken;

  logger.debug(JSON.stringify({ spotifyId, spotifyToken }));

  logger.verbose(`Script \`${SCRIPT_NAME}\` finished.`);
}

main().catch((error) => {
  console.log(error);
  process.exit(EXIT_CODES.UNCAUGHT);
});
