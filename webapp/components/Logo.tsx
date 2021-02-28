/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import styled from '@emotion/styled';
import * as React from 'react';

import { color, font, space } from 'components/tokens';

const Hello = styled.div({
  borderBottom: `1px solid ${color.accent}`,
  fontFamily: font.head,
  fontSize: font.size.title,
  marginBottom: space.mediumSmall,
  marginTop: '1rem',
});

interface Props {
  className?: string;
}

export const Logo: React.FC<Props> = (props: Props) => (
  <Hello className={props.className}>Electric Lounge</Hello>
);
