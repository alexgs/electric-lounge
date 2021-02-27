/* eslint-env node */

import * as env from 'env-var';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.Spotify({
      clientId: env.get('SPOTIFY_CLIENT_ID').required().asString(),
      clientSecret: env.get('SPOTIFY_CLIENT_SECRET').required().asString(),
    }),
  ],

  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
});
