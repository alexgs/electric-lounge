/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

// References: [blog post][1] and [sandbox][2]
// [1]: https://www.chrisberry.io/Animate-Auto-With-React-Spring/
// [2]: https://codesandbox.io/s/animate-auto-height-6trvh

import styled from '@emotion/styled';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useSpring, animated } from 'react-spring';
import { useMeasure } from 'react-use';

import { color, font, space } from 'components/tokens';

const Container = styled.div({
  borderBottom: `1px solid ${color.primaryDark}`,
  marginBottom: space.medium,
  paddingTop: space.small,
  paddingBottom: space.small,
});
Container.displayName = 'Accordion.Container';

const Heading = styled.div({
  color: color.primaryLight,
  cursor: 'pointer',
  display: 'flex',
  fontSize: font.size.heading4,
  fontWeight: 700,
});
Heading.displayName = 'Accordion.Heading';

const HeadingContent = styled.div({
  display: 'inline-block',
});
HeadingContent.displayName = 'Accordion.HeadingContent';

const bodyCss = {
  overflow: 'hidden',
};

const contentCss = {
  paddingTop: space.medium,
  paddingBottom: space.medium,
};

interface Props {
  children: React.ReactNode;
  heading: string;
  isOpen: boolean;
  onClick: (id: string) => void;
  uniqueId: string;
}

export const Accordion: React.FC<Props> = (props: Props) => {
  const defaultHeight = 0;
  // const [isOpen, setIsOpen] = React.useState(false);
  const [contentHeight, setContentHeight] = React.useState(defaultHeight);
  const [ref, { height }] = useMeasure();

  const expand = useSpring({
    // config: { friction: 10 },
    height: props.isOpen ? `${contentHeight}px` : `${defaultHeight}px`,
  });

  React.useEffect(() => {
    //Sets initial height
    setContentHeight(height);

    // Adds resize event listener // TODO This can be done in the future
    // window.addEventListener("resize", setContentHeight(height));

    // Clean-up
    // return window.removeEventListener("resize", setContentHeight(height));
  }, [height]);

  function handleHeadingClick() {
    props.onClick(props.uniqueId);
  }

  // TODO Change the chevron animation to also use react-spring?
  const rotation = props.isOpen ? 0 : 90;
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
      <animated.div css={bodyCss} style={expand}>
        <div ref={ref as React.LegacyRef<HTMLDivElement>}>
          <div css={contentCss}>{props.children}</div>
        </div>
      </animated.div>
    </Container>
  );
};
