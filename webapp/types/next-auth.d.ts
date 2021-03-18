/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

/* eslint-disable import/order */

// NB: (2021-02-27) TypeScript support for NextAuth is apparently shit, so I'm
// writing my own declaration in this file. Check the [TypeScript Support][1]
// page for future developments.
// [1]: https://next-auth.js.org/getting-started/typescript

declare module 'next-auth' {
  import { AdapterObject } from 'next-auth/adapters';
  import { ProviderObject } from 'next-auth/providers';

  interface ConfigOptions {
    adapter?: AdapterObject;
    callbacks?: {
      session?: (
        session: Record<string, unknown>,
        token: Record<string, unknown>,
      ) => Promise<Record<string, unknown>>;
    };
    debug?: boolean;
    providers: ProviderObject[];
  }

  function NextAuth(options: ConfigOptions): unknown;

  export default NextAuth;
}

declare module 'next-auth/adapters' {
  import { PrismaClient } from '@prisma/client';
  const Adapter: AdapterObject;

  export interface AdapterObject {
    Prisma: {
      Adapter: (options: { prisma: PrismaClient }) => AdapterObject;
    };
  }

  export default Adapter;
}

declare module 'next-auth/client' {
  import { NextApiRequest, NextPageContext } from 'next';

  const Provider: React.FC<ProviderProps>;

  type NextContextLike = NextPageContext | { req: NextApiRequest };

  interface ProviderProps {
    session: unknown;
  }

  interface Session {
    user: User;
    accessToken?: string;
    expires: string;
    spotifyId?: string;
    spotifyToken?: string;
  }

  interface User {
    name: string;
    email: string;
    image: string;
  }

  function getSession(context?: NextContextLike): Promise<Session>;

  function signIn(): Promise<void>;

  function signOut(): Promise<void>;

  function useSession(): [Session | null, false | undefined, true];
}

declare module 'next-auth/providers' {
  export type ProviderObject = unknown;

  interface ProvidersList {
    Spotify: (options: {
      clientId: string;
      clientSecret: string;
      scope?: string | string[];
    }) => ProviderObject;
  }

  const Providers: ProvidersList;

  export default Providers;
}
