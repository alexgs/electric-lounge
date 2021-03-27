/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { User } from '@prisma/client';
import * as env from 'env-var';
import formEncoder from 'form-urlencoded';
import got from 'got';
import { DateTime } from 'luxon';

import { prisma } from 'lib';
import {
  RefreshErrorResult,
  RefreshResult,
  RefreshSuccessfulResult,
} from 'types';

const SPOTIFY_PROVIDER_ID = 'spotify';
const SPOTIFY_REFRESH_URL = 'https://accounts.spotify.com/api/token';

interface SpotifyRefreshResult {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

interface TokenResult {
  accessToken?: string;
  error?: string;
}

export async function getValidAccessToken(user: User): Promise<TokenResult> {
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

export async function refreshAccessToken(userId: number): Promise<RefreshResult> {
  try {
    const clientId = env.get('SPOTIFY_CLIENT_ID').required().asString();
    const clientSecret = env.get('SPOTIFY_CLIENT_SECRET').required().asString();
    const basicAuth = clientId + ':' + clientSecret;
    const encodedAuth = Buffer.from(basicAuth).toString('base64');
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${encodedAuth}`,
    };

    const result = await prisma.account.findFirst({
      where: {
        userId,
        providerId: SPOTIFY_PROVIDER_ID,
      },
    });
    if (!result?.refreshToken) {
      return {
        status: 500,
        statusMessage: `Missing refresh token for user ID ${userId}`
      };
    }

    const payload = {
      grant_type: 'refresh_token',
      refresh_token: result.refreshToken,
    };
    const requestBody = formEncoder(payload);
    const refreshResponse = await got(SPOTIFY_REFRESH_URL, {
      headers,
      body: requestBody,
      method: 'POST',
    });

    const responseBody = JSON.parse(refreshResponse.body) as SpotifyRefreshResult;
    return {
      ...responseBody,
      status: 200,
    };
  } catch (error) {
    // console.log(error);
    /* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */
    return {
      status: error.response.statusCode,
      statusMessage: error.response.statusMessage,
      body: JSON.parse(error.response.body),
    };
    /* eslint-enable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */
  }
}
