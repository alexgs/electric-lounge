/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import got from 'got';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { prisma, spotifyUrl } from 'lib';
import {
  getNewSpotifyIds,
  getSpotifyId,
  getTrackIds,
  insertSpotifyTracks,
} from 'lib/spotify';
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
    const spotifyPlaylist = JSON.parse(playlistResponse.body) as Playlist;

    // Make sure the tracks exist in the database
    const wrappers = spotifyPlaylist.tracks.items;
    const newSpotifyTrackIds = await getNewSpotifyIds(wrappers);
    const newSpotifyTracks = wrappers.filter((wrapper) => {
      const trackId = getSpotifyId(wrapper.track);
      return newSpotifyTrackIds.includes(trackId);
    });
    await insertSpotifyTracks(newSpotifyTracks);

    // Upsert the playlist document
    const dbPlaylist = await prisma.playlist.upsert({
      where: { spotifyId: spotifyPlaylist.id },
      update: {
        name: spotifyPlaylist.name,
        description: spotifyPlaylist.description,
      },
      create: {
        name: spotifyPlaylist.name,
        description: spotifyPlaylist.description,
        spotifyId: spotifyPlaylist.id,
      },
    });

    // Insert an empty snapshot
    const dbSnapshot = await prisma.playlistSnapshot.create({
      data: {
        name: spotifyPlaylist.name,
        description: spotifyPlaylist.description,
        playlistId: dbPlaylist.id,
      },
    });

    // Insert the wrappers and associate with the snapshot
    let position = 0;
    for (const wrapper of spotifyPlaylist.tracks.items) {
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

    const responsePayload = await prisma.playlistSnapshot.findUnique({
      where: { id: dbSnapshot.id },
      include: {
        tracks: true,
      },
    });
    response.status(200).json(responsePayload);
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
