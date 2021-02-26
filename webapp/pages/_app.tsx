import { AppProps } from 'next/app';
import * as React from 'react';

import { GlobalStyles } from 'components';

const App = ({ Component, pageProps }: AppProps): React.ReactNode => {
  return (
    <>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  );
};

export default App;
