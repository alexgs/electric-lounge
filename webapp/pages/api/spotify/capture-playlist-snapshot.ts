/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { PlaylistTrack } from '@prisma/client';
import got from 'got';
import { DateTime } from 'luxon';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { prisma, spotifyUrl } from 'lib';
import { Spotify } from 'types';

type Playlist = Spotify.PlaylistObject;

const JANUARY_2021 = '77fNisrK3i50hCB8kVhEWH';
const FEBRUARY_2021 = '1uHIHWIyTtJIyPKy3Q41w3';
const MARCH_2021 = '2FIcB7cjbzbCY7QcOU3NO6';

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
    response.status(200).json({ ...spPlaylist });

    // TODO Build a list of tracks that are not currently in the database
    const spTrackIds = spPlaylist.tracks.map(
      (spPlaylistTrack) => spPlaylistTrack.track.id,
    );
    const dbSpotifyTracks = await prisma.track.findMany({
      where: {
        spotifyId: { in: spTrackIds },
      },
    });
    const knownSpotifyTracks = dbSpotifyTracks.reduce((output, dbTrack) => {
      return {
        ...output,
        [dbTrack.spotifyId]: dbTrack,
      };
    }, {});
    const knownSpotifyTrackIds = Object.keys(knownSpotifyTracks);

    // TODO Package playlist-tracks for nested write
    const dbPlaylistTracks = spPlaylist.tracks.map((spPlaylistTrack): PlaylistTrack => {
      return {
        addedAt: DateTime.fromISO(spPlaylistTrack.added_at).toJSDate(),
        trackId: knownSpotifyTracks[spPlaylistTrack.track.id].id,
      }
    });

    // TODO Save playlist and snapshot into the database
    const dbPlaylist = await prisma.playlist.upsert({
      where: { spotifyId: spPlaylist.id },
      update: {
        name: spPlaylist.name,
        description: spPlaylist.description,
        snapshots: {
          create: {
            description: spPlaylist.description,
            name: spPlaylist.name,
            // tracks: [],
          },
        },
      },
      create: {
        name: spPlaylist.name,
        description: spPlaylist.description,
        spotifyId: spPlaylist.id,
      },
    });
    // const dbSnapshot = await prisma.playlistSnapshot.insert({})
  } catch (error) {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */
    response.status(500).json({
      status: error.response.statusCode,
      statusMessage: error.response.statusMessage,
      body: JSON.parse(error.response.body),
    });
    /* eslint-enable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */
  }
}

export default handler;
