/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import styled from '@emotion/styled';
import * as React from 'react';

import { breakpoint, font, maxWidth, space } from 'components/tokens';

const Page = styled.div({
  fontSize: font.size.regular,
  padding: space.sm,
  [breakpoint.medium]: {
    fontSize: font.size.regular,
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
}

export const BasicLayout: React.FC<Props> = (props: Props) => {
  const { children } = props;
  return (
    <Page>
      <div>{children}</div>
    </Page>
  );
};
