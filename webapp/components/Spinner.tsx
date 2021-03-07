/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import styled from '@emotion/styled';
import { faGuitarElectric } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useSpring, animated } from 'react-spring';

const boxCss = {
  display: 'inline-block',
};

// There are a lot of "music" related icons in FontAwesome that we could use
// for alternative or additional spinners. I think a lightning bolt spinning on
// a turntable might be a good custom one.

export const Spinner: React.FC = () => {
  const [x, setX] = React.useState(0);

  function handleClick() {
    setX(x === 0 ? 1 : 0);
  }

  const spin = useSpring({
    transform: x === 1 ? 'rotate(359deg)' : 'rotate(0deg)',
  });

  return (
    <>
      <div>
        <animated.div css={boxCss} style={spin}>
          <FontAwesomeIcon icon={faGuitarElectric} size="4x" />
        </animated.div>
      </div>
      <div>
        <button onClick={handleClick}>Spin</button>
      </div>
    </>
  );
};
