/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import styled from '@emotion/styled';
import * as React from 'react';

import { font, space } from '../tokens';

// https://ethanschoonover.com/solarized/
const solarized = {
  base03: 'rgb(0, 43, 54)',
  base02: 'rgb(7, 54, 66)',
  base01: 'rgb(88, 110, 117)',
  base00: 'rgb(101, 123, 131)',
  base0: 'rgb(131, 148, 150)',
  base1: 'rgb(147, 161, 161)',
};

const SolarCode = styled.pre({
  backgroundColor: solarized.base03,
  color: solarized.base0,
  fontFamily: '\'JetBrains Mono\', monospace',
  fontSize: font.size.kindaSmall,
  padding: space.small,
});

interface Props {
  data: unknown;
}

export const JsonDisplay: React.FC<Props> = (props: Props) => {
  return (
    <div>
      <SolarCode>{JSON.stringify(props.data, null, 2)}</SolarCode>
    </div>
  );
};
