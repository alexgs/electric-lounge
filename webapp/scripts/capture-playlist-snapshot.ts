/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as env from 'env-var';
import got from 'got';
import path from 'path';
import winston from 'winston';

import { prisma, spotifyUrl } from 'lib';
import {
  getNewSpotifyIds,
  getSpotifyId,
  insertSpotifyTracks,
} from 'lib/spotify';
import { getValidAccessToken } from 'lib/spotify/oauth';
import { Spotify } from 'types';

type Playlist = Spotify.PlaylistObject;

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
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(myFormat),
      ),
    }),
  ],
});

async function getPlaylist(playlistId: string, spotifyToken: string) {
  try {
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${spotifyToken}`,
      'Content-Type': 'application/json',
      'User-Agent':
        'Electric Lounge (https://github.com/alexgs/electric-lounge)',
    };
    const url = spotifyUrl.playlist(playlistId);
    const playlistResponse = await got(url, { headers });
    return JSON.parse(playlistResponse.body) as Playlist;
  } catch (error) {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/restrict-template-expressions */
    const message = `Code ${error.response.statusCode}: ${error.response.statusMessage}`;
    throw new Error(message);
    /* eslint-enable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/restrict-template-expressions */
  }
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

  const spotifyToken = await getSpotifyToken(EL_USER_ID).catch(
    (error: Error) => {
      logger.error(error.message);
      process.exit(EXIT.ERROR.CRED);
    },
  );
  const playlist = await getPlaylist(MARCH_2021, spotifyToken);

  // Make sure the tracks exist in the database
  const wrappers = playlist.tracks.items;
  const newSpotifyTrackIds = await getNewSpotifyIds(wrappers);
  const newSpotifyTracks = wrappers.filter((wrapper) => {
    const trackId = getSpotifyId(wrapper.track);
    return newSpotifyTrackIds.includes(trackId);
  });
  await insertSpotifyTracks(newSpotifyTracks);

  // Upsert the playlist document
  const dbPlaylist = await prisma.playlist.upsert({
    where: { spotifyId: playlist.id },
    update: {
      name: playlist.name,
      description: playlist.description,
    },
    create: {
      name: playlist.name,
      description: playlist.description,
      spotifyId: playlist.id,
    },
  });

  // Insert an empty snapshot
  const dbSnapshot = await prisma.playlistSnapshot.create({
    data: {
      name: playlist.name,
      description: playlist.description,
      playlistId: dbPlaylist.id,
    },
  });

  // Insert the wrappers and associate with the snapshot
  let position = 0;
  for (const wrapper of playlist.tracks.items) {
    await prisma.playlistTrack.create({
      data: {
        position,
        addedAt: wrapper.added_at,
        snapshot: { connect: { id: dbSnapshot.id } },
        track: {
          connect: { spotifyId: getSpotifyId(wrapper.track) },
        },
      },
    });
    position++;
  }

  logger.info(
    `Captured snapshot ID ${dbSnapshot.id} of playlist "${playlist.name}" ` +
      `for user ID ${EL_USER_ID}`,
  );

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
