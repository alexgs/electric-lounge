/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { PrismaClient } from '@prisma/client';
import * as env from 'env-var';
import formEncoder from 'form-urlencoded';
import got from 'got';
import { NextApiResponse, NextApiRequest } from 'next';

const SPOTIFY_REFRESH_URL = 'https://accounts.spotify.com/api/token';

const prisma = new PrismaClient();

async function refreshAccessToken(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
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
    const body = formEncoder(payload) as string;
    const refreshResponse = await got(SPOTIFY_REFRESH_URL, {
      body,
      headers,
      method: 'POST',
    });
    console.log(`  --> Checkpoint 3`);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const refreshedTokens = JSON.parse(refreshResponse.body);
    console.log(`  --> Checkpoint 4`);

    response
      .status(200)
      .json(refreshedTokens);
  } catch (error) {
    console.log(error);
    /* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */
    response.status(500).json({
      keys: Object.keys(error) ?? 'No response',
      statusCode: error.response.statusCode,
      statusMessage: error.response.statusMessage,
      body: JSON.parse(error.response.body),
    });
    /* eslint-enable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */
  }
}

export default refreshAccessToken;
