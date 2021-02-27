// NB: (2021-02-27) TypeScript support for NextAuth is apparently shit, so I'm
// writing my own declaration in this file. Check the [TypeScript Support][1]
// page for future developments.
// [1]: https://next-auth.js.org/getting-started/typescript

declare module 'next-auth' {
  import { ProviderObject } from 'next-auth/providers';

  function NextAuth(options: { providers: ProviderObject[] }): unknown

  export default NextAuth;
}

declare module 'next-auth/providers' {
  export type ProviderObject = unknown;

  interface ProvidersList {
    Spotify: (options: { clientId: string, clientSecret: string }) => ProviderObject;
  }

  const Providers: ProvidersList;

  export default Providers;
}

declare module 'next-auth/client' {
  const Provider: React.FC<ProviderProps>;

  interface ProviderProps {
    session: unknown;
  }

  interface Session {
    user: User;
    accessToken?: string;
    expires: string;
  }

  interface User {
    name: string;
    email: string;
    image: string;
  }

  function signIn(): Promise<void>

  function signOut(): Promise<void>

  function useSession(): [Session | null, false | undefined, true]
}
