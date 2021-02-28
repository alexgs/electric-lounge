/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import styled from '@emotion/styled';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';

import { color, font, space } from 'components/tokens';

interface BodyProps {
  isOpen: boolean;
}

const Body = styled.div((props: BodyProps) => ({
  display: props.isOpen ? 'block' : 'none',
  marginTop: space.medium,
  marginBottom: space.medium,
}));
Body.displayName = 'Accordion.Body';

const Container = styled.div({
  borderBottom: `1px solid ${color.primaryDark}`,
  cursor: 'pointer',
  marginBottom: space.medium,
  paddingTop: space.small,
  paddingBottom: space.small,
});
Container.displayName = 'Accordion.Container';

const Heading = styled.div({
  color: color.primaryLight,
  display: 'flex',
  fontSize: font.size.heading4,
  fontWeight: 700,
});
Heading.displayName = 'Accordion.Heading';

const HeadingContent = styled.div({
  display: 'inline-block',
});
HeadingContent.displayName = 'Accordion.HeadingContent';

interface Props {
  children: React.ReactNode;
  heading: string;
}

export const Accordion: React.FC<Props> = (props: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);

  function handleHeadingClick() {
    setIsOpen((prevState) => !prevState);
  }

  const rotation = isOpen ? 0 : 90;
  const chevronCss = {
    transform: `rotate(${rotation}deg)`,
    transition: 'all 200ms ease',
  };
  return (
    <Container>
      <Heading onClick={handleHeadingClick}>
        <HeadingContent>{props.heading}</HeadingContent>
        <HeadingContent css={{ marginLeft: 'auto' }}>
          <FontAwesomeIcon
            css={chevronCss}
            icon={faChevronDown}
            fixedWidth={true}
          />
        </HeadingContent>
      </Heading>
      <Body isOpen={isOpen}>{props.children}</Body>
    </Container>
  );
};
