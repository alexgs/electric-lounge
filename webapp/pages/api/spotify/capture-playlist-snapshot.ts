/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import got from 'got';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { spotifyUrl } from 'lib';
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
    const playlist = JSON.parse(playlistResponse.body) as Playlist;
    response.status(200).json({ ...playlist });

    // TODO Save it into the database using functions from the `wip/2` branch
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
