/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { PrismaClient } from '@prisma/client'
import * as env from 'env-var';
import NextAuth from 'next-auth';
import Adapters from 'next-auth/adapters'
import Providers from 'next-auth/providers';

const prisma = new PrismaClient()

export default NextAuth({
  adapter: Adapters.Prisma.Adapter({ prisma }),
  debug: false,
  providers: [
    Providers.Spotify({
      clientId: env.get('SPOTIFY_CLIENT_ID').required().asString(),
      clientSecret: env.get('SPOTIFY_CLIENT_SECRET').required().asString(),
    }),
  ],
});
