import { signIn, signOut, useSession } from 'next-auth/client';
import * as React from 'react';

export const LoginWidget: React.FC = () => {
  const [ session, loading ] = useSession();

  if (loading) {
    return null;
  }

  if (session) {
    return (
      <div>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }

  return (
    <div>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
}
