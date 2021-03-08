/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as React from 'react';

interface EorProps {
  test: boolean;
  ifTrue: React.ReactNode;
  ifFalse: React.ReactNode;
}

export const EitherOr: React.FC<EorProps> = (props: EorProps) => {
  if (props.test) {
    return <>{props.ifTrue}</>;
  }
  return <>{props.ifFalse}</>;
};
