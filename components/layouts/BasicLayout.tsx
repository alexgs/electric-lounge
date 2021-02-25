import styled from '@emotion/styled';
import Head from 'next/head';
import * as React from 'react';

import { breakpoint, maxWidth, space } from 'components/tokens';
import { MdxMetadata } from 'types';

const Page = styled.div({
  fontSize: '1.25rem',
  padding: space.sm,
  [breakpoint.medium]: {
    fontSize: '1.25rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: 0,
    paddingRight: 0,
    maxWidth: maxWidth.medium,
  },
});
Page.displayName = 'Page';

interface Props {
  children: React.ReactNode;
  metadata: MdxMetadata;
}

export const BasicLayout: React.FC<Props> = (props: Props) => {
  const title = props.metadata.title ?? 'Untitled';

  const { children } = props;
  return (
    <Page>
      <Head>
        <title>{title} | The Legacy of Lolth</title>
      </Head>
      <h1>{title}</h1>
      <div>{children}</div>
    </Page>
  );
};
