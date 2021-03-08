/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { User } from '@prisma/client';
import * as env from 'env-var';
import { DateTime } from 'luxon';
import NextAuth from 'next-auth';
import Adapters from 'next-auth/adapters';
import Providers from 'next-auth/providers';

import { prisma, refreshAccessToken } from 'lib';
import { RefreshErrorResult, RefreshSuccessfulResult } from 'types';

// Reference: https://developer.spotify.com/documentation/general/guides/scopes/
const SPOTIFY_SCOPES: string[] = [
  // Library
  'user-library-modify',
  'user-library-read',

  // Listening history
  'user-read-recently-played',
  'user-top-read',
  'user-read-playback-position',

  // Spotify Connect
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',

  // Playlists
  'playlist-modify-public',
  'playlist-modify-private',
  'playlist-read-private',
  'playlist-read-collaborative',

  // User
  'user-read-email',
  'user-read-private',
];

interface TokenResult {
  accessToken?: string;
  error?: string;
}

async function getValidAccessToken(user: User): Promise<TokenResult> {
  // Get the current access token and expiry
  const userId = user.id;
  const dbResult = await prisma.account.findFirst({
    where: {
      userId,
      providerId: 'spotify',
    },
  });

  // Return the access token if it is valid
  const accessTokenExpires = dbResult?.accessTokenExpires?.getTime() ?? 0;
  if (Date.now() < accessTokenExpires && dbResult?.accessToken) {
    return { accessToken: dbResult.accessToken };
  }

  // Refresh the access token & update the database
  if (dbResult?.refreshToken) {
    const refreshResult = await refreshAccessToken(userId);
    if (refreshResult.status !== 200) {
      const errorResult = refreshResult as RefreshErrorResult;
      return { error: errorResult.statusMessage };
    }

    const tokenResult = refreshResult as RefreshSuccessfulResult;

    // By waiting for this update query, we should be able to surface any
    //   errors in a somewhat useful way. Change `await` to `void` to make this
    //   non-blocking.
    await prisma.account.update({
      data: {
        accessToken: tokenResult.access_token,
        accessTokenExpires: DateTime.now()
          .plus({ seconds: tokenResult.expires_in })
          .toJSDate(),
        updatedAt: new Date(),
      },
      where: { id: dbResult.id },
    });

    // Return just the access token
    return { accessToken: tokenResult.access_token };
  }

  return { error: 'Something unexpected happened.' };
}

export default NextAuth({
  adapter: Adapters.Prisma.Adapter({ prisma }),
  callbacks: {
    async session(session, user) {
      const idResult = await prisma.account.findFirst({
        where: {
          userId: user.id as number,
          providerId: 'spotify',
        },
      });
      const tokenResult = await getValidAccessToken(user as User);
      if (tokenResult.accessToken && idResult?.providerAccountId) {
        return {
          ...session,
          spotifyId: idResult.providerAccountId,
          spotifyToken: tokenResult.accessToken,
        };
      }

      if (!idResult?.providerAccountId) {
        const userId = user.id as number;
        console.log(
          `Something bad happened while trying to get the Spotify ID for user ${userId}`,
        );
      }
      if (tokenResult.error) {
        console.log(tokenResult.error);
      }
      return session;
    },
  },
  debug: false,
  providers: [
    Providers.Spotify({
      clientId: env.get('SPOTIFY_CLIENT_ID').required().asString(),
      clientSecret: env.get('SPOTIFY_CLIENT_SECRET').required().asString(),
      scope: SPOTIFY_SCOPES.join(' '),
    }),
  ],
});
