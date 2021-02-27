/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Provider } from 'next-auth/client';
import { AppProps } from 'next/app';
import * as React from 'react';

import { GlobalStyles } from 'components';

const App = ({ Component, pageProps }: AppProps): React.ReactNode => {
  return (
    <Provider session={pageProps.session}>
      <GlobalStyles />
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
