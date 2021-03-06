/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

/* eslint-disable no-inner-declarations */

import { useSession } from 'next-auth/client';
import * as React from 'react';

export const SpotifyApiCheck: React.FC = () => {
  const [someState, setSomeState] = React.useState<unknown>(null);
  const [session, loading] = useSession();

  React.useEffect(() => {
    if (session && !someState) {
      async function worker() {
        // Typescript is dumb sometimes :eyeroll:
        const spotifyToken = session?.spotifyToken ?? 'missing-access-token';
        const response = await fetch(`https://api.spotify.com/v1/me`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json',
          },
        });
        const payload: unknown = await response.json();
        setSomeState(payload);
      }

      void worker();
    }
  }, [session]);

  if (loading || !session || !someState) {
    return null;
  }

  return (
    <div>
      <pre>{JSON.stringify(someState, null, 2)}</pre>
    </div>
  );
};
