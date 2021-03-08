/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { useSession } from 'next-auth/client';
import * as React from 'react';

import { Maybe, Spinner } from 'components';
import { space } from 'components/tokens';

import { JsonDisplay } from './JsonDisplay';

type LoadingState = 'not-loaded' | 'loading' | 'complete' | 'error';

// TODO I feel like there ought to be a way to make this into a generic
//   component that just takes a function; then individual panels would each
//   basically compose a specific API function with the generic component. Might
//   be more trouble than it's worth.

export const SpotifyApiCheck: React.FC = () => {
  const [loadingState, setLoadingState] = React.useState<LoadingState>(
    'not-loaded',
  );
  const [data, setData] = React.useState<Record<string, unknown>>({});
  const [session, loading] = useSession();

  function handleClearClick() {
    setData({});
    setLoadingState('not-loaded');
  }

  async function handleFetchClick() {
    if (session) {
      setLoadingState('loading');
      const spotifyToken = session.spotifyToken ?? 'missing-access-token';
      const response = await fetch(`https://api.spotify.com/v1/me`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${spotifyToken}`,
          'Content-Type': 'application/json',
        },
      });
      const payload = (await response.json()) as Record<string, unknown>;
      setLoadingState('complete');
      setData(payload);
    }
  }

  return (
    <div>
      <Maybe test={loading || loadingState === 'loading'}>
        <Spinner />
      </Maybe>
      <Maybe test={loadingState === 'complete'}>
        <JsonDisplay data={data} />
      </Maybe>
      <div>
        <button onClick={handleFetchClick}>Fetch</button>
        <button css={{ marginLeft: space.small }} onClick={handleClearClick}>
          Clear
        </button>
      </div>
    </div>
  );
};
