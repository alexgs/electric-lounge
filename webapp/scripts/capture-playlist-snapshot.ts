/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as env from 'env-var';
import path from 'path';
import winston from 'winston';

import { prisma } from '../lib';
import { getValidAccessToken } from '../lib/spotify/oauth';

const EXIT = {
  SUCCESS: 0,
  ERROR: {
    UNCAUGHT: 1,
    CRED: 2,
  },
};
const LOG_CRON_PATH = env
  .get('LOG_CRON_PATH')
  .default(process.cwd())
  .asString();
const SCRIPT_NAME = 'capture-playlist-snapshot';

const LOG_FILE = path.resolve(LOG_CRON_PATH, `${SCRIPT_NAME}.log`);
const TRACE_FILE = path.resolve(LOG_CRON_PATH, `${SCRIPT_NAME}.trace.log`);

const myFormat = (info: Record<string, string>) =>
  `[${info.timestamp}] ${info.script} ${info.level.toUpperCase()}: ` +
  info.message;

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
      level: 'silly',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(myFormat),
      ),
    }),
  ],
});

async function getSpotifyId(userId: number) {
  const idResult = await prisma.account.findFirst({
    where: {
      userId,
      providerId: 'spotify',
    },
  });
  if (!idResult) {
    throw new Error(`Unable to retrieve Spotify ID for user ID ${userId}.`);
  }
  return idResult.providerAccountId;
}

async function getSpotifyToken(userId: number) {
  const tokenResult = await getValidAccessToken(userId);
  if (!tokenResult?.accessToken) {
    throw new Error(
      `Unable to retrieve Spotify access token for user ID ${userId}.`,
    );
  }
  return tokenResult.accessToken;
}

async function main() {
  const EL_USER_ID = 1;
  const MARCH_2021 = '2FIcB7cjbzbCY7QcOU3NO6';

  logger.verbose(`Script \`${SCRIPT_NAME}\` starting.`);

  const spotifyId = await getSpotifyId(EL_USER_ID).catch((error: Error) => {
    logger.error(error.message);
    process.exit(EXIT.ERROR.CRED);
  });
  const spotifyToken = await getSpotifyToken(EL_USER_ID).catch(
    (error: Error) => {
      logger.error(error.message);
      process.exit(EXIT.ERROR.CRED);
    },
  );
  logger.debug(JSON.stringify({ spotifyId, spotifyToken }));

  logger.verbose(`Script \`${SCRIPT_NAME}\` finished.`);
}

main()
  .then(() => {
    process.exit(EXIT.SUCCESS);
  })
  .catch((error) => {
    console.log(error);
    process.exit(EXIT.ERROR.UNCAUGHT);
  });
