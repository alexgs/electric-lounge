/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import got from 'got';
import * as _ from 'lodash';
import { DateTime } from 'luxon';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import {
  getSpotifyTrackIds,
  prisma,
  rectifyPlaylistTracks,
  spotifyUrl,
} from 'lib';
import { Spotify } from 'types';

type Playlist = Spotify.PlaylistObject;

const JANUARY_2021 = '77fNisrK3i50hCB8kVhEWH';
const FEBRUARY_2021 = '1uHIHWIyTtJIyPKy3Q41w3';
const MARCH_2021 = '2FIcB7cjbzbCY7QcOU3NO6';

// async function upsertTracks(tracks: Spotify.PlaylistTrackObject[]) {
//   // const spotifyTracks = tracks.map(track => track.track);
//   for (let i = 0; i < tracks.length; i++) {
//     const track = tracks[i];
//     // Upsert base track data
//     const dbTrack = await prisma.track.upsert({
//       where: { spotifyId: track.track.id },
//       create: {
//         spotifyId: track.track.id,
//         name: track.track.name,
//       },
//       update: {},
//     });
//     const dbPlaylistTrack = await prisma.playlistTrack.create({
//       data: {
//         addedAt: DateTime.fromISO(track.added_at).toJSDate(),
//         trackId: dbTrack.id,
//       },
//     });
//   }
// }

async function updateDbTracks(
  spotifyPlaylistTracks: Spotify.PlaylistTrackObject[],
) {
  console.log(`  --> Step A <--`);
  const incomingSpotifyTrackIds = getSpotifyTrackIds(spotifyPlaylistTracks);
  console.log(`  --> Step B <--`);
  // console.log(incomingSpotifyTrackIds);
  const existingDbTracks = await prisma.track.findMany({
    where: {
      spotifyId: { in: incomingSpotifyTrackIds },
    },
  });
  console.log(`  --> Step C <--`);
  const existingSpotifyTrackIds = existingDbTracks.map(
    (track) => track.spotifyId,
  );
  console.log(`  --> Step D <--`);
  const newSpotifyTrackIds = _.difference(
    incomingSpotifyTrackIds,
    existingSpotifyTrackIds,
  );
  console.log(`  --> Step E <--`);
  for (let i = 0; i < newSpotifyTrackIds.length; i++) {
    // if (i > 0) {
    //   return;
    // }
    const spotifyTrackId = newSpotifyTrackIds[i];
    // console.log(`     -+- Spotify track ID: ${spotifyTrackId} -+-`);
    const trackData = spotifyPlaylistTracks.find(
      (trackObject) => trackObject.track.id === spotifyTrackId,
    );
    // console.log(`     -+- track data: ${trackData} -+-`);
    if (trackData) {
      await prisma.track.create({
        data: {
          spotifyId: trackData.track.id,
          name: trackData.track.name,
        },
      });
    } else {
      console.error(
        `>> Something bad happened trying to insert Spotify track ID "${spotifyTrackId}" <<`,
      );
    }
  }
  console.log(`  --> Step F <--`);
}

async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const session = await getSession({ req: request });
  if (!session) {
    response.status(401).end();
    return;
  }

  const { spotifyId, spotifyToken } = session;
  if (!spotifyId || !spotifyToken) {
    response.status(500).json({
      message: "An error occurred with the user's Spotify credentials",
    });
    return;
  }

  try {
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${spotifyToken}`,
      'Content-Type': 'application/json',
      'User-Agent':
        'Electric Lounge (https://github.com/alexgs/electric-lounge)',
    };
    const url = spotifyUrl.playlist(MARCH_2021);
    const playlistResponse = await got(url, { headers });
    const spPlaylist = JSON.parse(playlistResponse.body) as Playlist;
    console.log(`--> Step 0 <--`);

    await updateDbTracks(spPlaylist.tracks.items);
    console.log(`--> Step 1 <--`);

    const dbPlaylist = await prisma.playlist.upsert({
      where: { spotifyId: spPlaylist.id },
      update: {
        name: spPlaylist.name,
        description: spPlaylist.description,
      },
      create: {
        name: spPlaylist.name,
        description: spPlaylist.description,
        spotifyId: spPlaylist.id,
      },
    });
    console.log(`--> Step 2 <--`);

  } catch (error) {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */
    if (error.response) {
      response.status(500).json({
        status: error.response.statusCode,
        statusMessage: error.response.statusMessage,
        body: JSON.parse(error.response.body),
      });
      /* eslint-enable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */
    } else {
      console.error(error);
      response.status(500).send('Internal server error');
    }
  }
}

export default handler;
