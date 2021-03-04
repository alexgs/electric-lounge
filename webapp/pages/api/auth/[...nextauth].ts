/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { PrismaClient } from '@prisma/client';
import * as env from 'env-var';
import NextAuth from 'next-auth';
import Adapters from 'next-auth/adapters';
import Providers from 'next-auth/providers';

const prisma = new PrismaClient();

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
      // console.log(`>> ${JSON.stringify(user)} <<`);
      const userId = user.id as number;
      const result = await prisma.account.findFirst({
        select: { accessToken: true },
        where: {
          userId,
          providerId: 'spotify'
        }
      });

      if (result?.accessToken) {
        return {
          ...session,
          spotifyToken: result.accessToken,
        };
      }

      return session;
    },
  },
  debug: false,
  providers: [
    Providers.Spotify({
      clientId: env.get('SPOTIFY_CLIENT_ID').required().asString(),
      clientSecret: env.get('SPOTIFY_CLIENT_SECRET').required().asString(),
      scope: SPOTIFY_SCOPES,
    }),
  ],
});
