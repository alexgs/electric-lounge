/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import styled from '@emotion/styled';
import { faGuitarElectric } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useSpring, animated } from 'react-spring';

import { color, space } from 'components/tokens';

// React Spring doesn't have great Typescript support, so we have to type the
// hook manually.
interface SpringHook {
  degrees: {
    interpolate: (fn: (d: number) => string) => string;
  };
}

const Container = styled.div({
  margin: space.medium,
  textAlign: 'center',
});

const boxCss = {
  display: 'inline-block',
};

// Coloring the duotone icon requires these non-standard properties, and we
// have to tell Typescript that everything is okay.
const guitarStyle = {
  '--fa-primary-color': color.primaryLight,
  // '--fa-primary-color': 'white',
  '--fa-secondary-color': color.accent,
  '--fa-secondary-opacity': 1,
} as React.CSSProperties;

// There are a lot of "music" related icons in FontAwesome that we could use
// for alternative or additional spinners. I think a lightning bolt spinning on
// a turntable might be a good custom one.

export const Spinner: React.FC = () => {
  const [spin, setSpin] = React.useState(false);
  const [x, setX] = React.useState(0);

  React.useEffect(() => {
    setSpin(true);
    return () => setSpin(false);
  }, []);

  function handleClick() {
    setX(x === 0 ? 1 : 0);
  }

  const { degrees } = useSpring({
    to: async (next: (opt: unknown) => Promise<void>) => {
      // Only spin continuously in production, because const spin does not play
      // nice with hot reloading in Next.js dev mode.
      // TODO Verify that this works correctly with a production build
      if (process.env.NODE_ENV === 'production') {
        while (spin) {
          await next({ degrees: 359, reset: true });
        }
      } else {
        const LIMIT = 10;
        let count = 0;
        while (count < LIMIT) {
          await next({ degrees: 359, reset: true });
          count++;
        }
      }
    },
    from: { degrees: 0 },
    reset: true,
  }) as SpringHook;

  return (
    <>
      <Container>
        <animated.div
          css={boxCss}
          style={{ transform: degrees.interpolate((d) => `rotate(${d}deg)`) }}
        >
          <FontAwesomeIcon
            icon={faGuitarElectric}
            size="2x"
            style={guitarStyle}
          />
        </animated.div>
      </Container>
      <div>
        <button onClick={handleClick}>Spin</button>
      </div>
    </>
  );
};
