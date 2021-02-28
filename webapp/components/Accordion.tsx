/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import styled from '@emotion/styled';
import * as React from 'react';

import { color, font, space } from 'components/tokens';

const Body = styled.div({
  marginTop: space.medium,
  marginBottom: space.medium,
});
Body.displayName = 'Accordion.Body';

const Container = styled.div({
  borderBottom: `1px solid ${color.primaryDark}`,
  marginBottom: space.medium,
  paddingTop: space.small,
  paddingBottom: space.small,
});
Container.displayName = 'Accordion.Container';

const Heading = styled.div({
  color: color.primaryLight,
  fontSize: font.size.heading4,
  fontWeight: 700,
});
Heading.displayName = 'Accordion.Heading';

interface Props {
  children: React.ReactNode;
  heading: string;
}

export const Accordion: React.FC<Props> = (props: Props) => {
  return (
    <Container>
      <Heading>{props.heading}</Heading>
      <Body>{props.children}</Body>
    </Container>
  );
};
