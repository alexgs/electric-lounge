/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as React from 'react';

interface Props {
  children: React.ReactNode;
}

export const Accordion: React.FC<Props> = (props: Props) => {
  return (
    <div>
      <p>Hello accordion!</p>
      {props.children}
    </div>
  );
};
