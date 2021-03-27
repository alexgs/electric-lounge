/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { User } from '@prisma/client';
import * as env from 'env-var';
import NextAuth from 'next-auth';
import Adapters from 'next-auth/adapters';
import Providers from 'next-auth/providers';

import { prisma } from 'lib';
import { getValidAccessToken } from 'lib/spotify/oauth';

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

export default NextAuth({
  adapter: Adapters.Prisma.Adapter({ prisma }),
  callbacks: {
    async session(session, user) {
      const userId = user.id as number;
      const idResult = await prisma.account.findFirst({
        where: {
          userId,
          providerId: 'spotify',
        },
      });
      const tokenResult = await getValidAccessToken(userId);
      if (tokenResult.accessToken && idResult?.providerAccountId) {
        return {
          ...session,
          spotifyId: idResult.providerAccountId,
          spotifyToken: tokenResult.accessToken,
        };
      }

      if (!idResult?.providerAccountId) {
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
