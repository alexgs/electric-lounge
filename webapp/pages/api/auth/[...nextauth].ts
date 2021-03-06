/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { PrismaClient } from '@prisma/client';
import * as env from 'env-var';
import formEncoder from 'form-urlencoded';
import got from 'got';
import NextAuth from 'next-auth';
import Adapters from 'next-auth/adapters';
import Providers from 'next-auth/providers';

const SPOTIFY_REFRESH_URL = 'https://accounts.spotify.com/api/token';
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

const prisma = new PrismaClient();

interface Account extends Record<string, unknown> {
  accessToken: string;
  expires_in: number;
  refresh_token: string;
}

interface Token extends Record<string, unknown> {
  accessToken: string;
  accessTokenExpires: number; // Unix timestamp
  refreshToken: string;
  user: Record<string, unknown>;
}

async function jwtCallback(
  token: Token,
  user?: Record<string, unknown>,
  account?: Account,
  profile?: Record<string, unknown>,
): Promise<Token> {

  console.log(`>>-- Token --<<\n${JSON.stringify(token)}\n>>-- Token --<<`);
  console.log(`>>-- User --<<\n${JSON.stringify(user)}\n>>-- User --<<`);
  console.log(`>>-- Account --<<\n${JSON.stringify(account)}\n>>-- Account --<<`);
  console.log(`>>-- Profile --<<\n${JSON.stringify(profile)}\n>>-- Profile --<<`);
  // Initial sign in
  if (account && user) {
    return {
      accessToken: account.accessToken,
      accessTokenExpires: Date.now() + account.expires_in * 1000,
      refreshToken: account.refresh_token,
      user,
    };
  }
  // Return previous token if the access token has not expired yet
  if (Date.now() < token.accessTokenExpires) {
    return token;
  }

  // Access token has expired, try to update it
  return refreshAccessToken(token);
}

async function refreshAccessToken(token: Token): Promise<Token> {
  try {
    const clientId = env.get('SPOTIFY_CLIENT_ID').required().asString();
    const clientSecret = env.get('SPOTIFY_CLIENT_SECRET').required().asString();
    const basicAuth = clientId + ':' + clientSecret;
    const encodedAuth = Buffer.from(basicAuth).toString('base64');
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${encodedAuth}`,
    };
    console.log(`  --> Checkpoint 1`);

    const result = await prisma.account.findFirst({
      where: {
        userId: 2,
        providerId: 'spotify',
      },
    });
    const payload = {
      grant_type: 'refresh_token',
      refresh_token: result?.refreshToken ?? 'missing-token',
    };
    console.log(`  --> Checkpoint 2`);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const body = formEncoder(payload);
    const refreshResponse = await got(SPOTIFY_REFRESH_URL, {
      body,
      headers,
      method: 'POST',
    });
    console.log(`  --> Checkpoint 3`);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const refreshedTokens = JSON.parse(refreshResponse.body);
    /* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
    /* eslint-enable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */
  } catch (error) {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */
    console.log({
      keys: Object.keys(error) ?? 'No response',
      statusCode: error.response.statusCode,
      statusMessage: error.response.statusMessage,
      body: JSON.parse(error.response.body),
    });
    /* eslint-enable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

async function sessionCallback(
  session: Record<string, unknown>,
  user: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  console.log(`>> ${JSON.stringify(session)} <<`);
  console.log(`>> ${JSON.stringify(user)} <<`);
  const userId = user.id as number;
  const result = await prisma.account.findFirst({
    select: { accessToken: true },
    where: {
      userId,
      providerId: 'spotify',
    },
  });

  if (result?.accessToken) {
    return {
      ...session,
      spotifyToken: result.accessToken,
    };
  }

  return session;
}

export default NextAuth({
  adapter: Adapters.Prisma.Adapter({ prisma }),
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // jwt: jwtCallback,
    session: sessionCallback,
  },
  debug: false,
  providers: [
    Providers.Spotify({
      clientId: env.get('SPOTIFY_CLIENT_ID').required().asString(),
      clientSecret: env.get('SPOTIFY_CLIENT_SECRET').required().asString(),
      scope: SPOTIFY_SCOPES.join(' '),
    }),
  ],
  // session: { jwt: true },
});
