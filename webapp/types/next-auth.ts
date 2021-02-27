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

  function signIn(): Promise<void>;

  function signOut(): Promise<void>;

  function useSession(): [Session | null, false | undefined, true];
}

