/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import got from 'got';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { Spotify } from 'types';

type PlayLists = Spotify.PagingObject<Spotify.SimplifiedPlaylistObject>;

const spotifyUrl = {
  playlists: (spotifyUserId: string, limit = 50) => `https://api.spotify.com/v1/users/${spotifyUserId}/playlists?limit=${limit}`,
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
    const url = spotifyUrl.playlists(spotifyId)
    const playlistResponse = await got(url, { headers });
    const playlists = JSON.parse(playlistResponse.body) as PlayLists;
    response.status(200).json({ ...playlists });
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
