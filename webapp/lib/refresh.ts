/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { PrismaClient } from '@prisma/client';
import * as env from 'env-var';
import formEncoder from 'form-urlencoded';
import got from 'got';

const SPOTIFY_PROVIDER_ID = 'spotify';
const SPOTIFY_REFRESH_URL = 'https://accounts.spotify.com/api/token';

const prisma = new PrismaClient();

export interface RefreshSuccessfulResult {
  access_token: string;
  expires_in: number;
  scope: string;
  status: number;
  token_type: string;
}

interface SpotifyRefreshResult {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export interface RefreshErrorResult {
  status: number;
  statusMessage: string;
  body?: Record<string, unknown>;
}

type RefreshResult = RefreshErrorResult | RefreshSuccessfulResult;

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
