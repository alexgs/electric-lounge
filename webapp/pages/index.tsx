import styled from '@emotion/styled';
import Head from 'next/head';
import * as React from 'react';

import { LoginWidget } from 'components';
import { BasicLayout } from 'components/layouts';
import { color } from 'components/tokens';

const Hello = styled.h1({
  borderBottom: `1px solid ${color.accent}`,
});

const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Electric Lounge</title>
      </Head>

      <BasicLayout>
        <Hello>Hello Electric Lounge</Hello>
        <LoginWidget />
      </BasicLayout>
    </div>
  );
};

export default Home;
