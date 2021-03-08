/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as React from 'react';

interface MaybeProps {
  children: React.ReactNode;
  test: boolean;
}

export const Maybe: React.FC<MaybeProps> = (props: MaybeProps) => {
  if (props.test) {
    return <>{props.children}</>;
  }
  return null;
};
