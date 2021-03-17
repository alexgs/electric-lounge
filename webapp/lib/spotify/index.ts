/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as _ from 'lodash';

import { Spotify } from 'types';

type WrapperList = Spotify.TrackWrapper[];

export function smokeTest(a: number, b: number): number {
  return a + b;
}

export function getTrackIds(wrappers: WrapperList): string[] {
  const output: string[] = [];
  for (const wrapper of wrappers) {
    if (typeof wrapper.track.id === 'string') {
      output.push(wrapper.track.id);
    } else if (typeof wrapper.track.uri === 'string') {
      output.push(wrapper.track.uri);
    } else {
      throw new Error(`Cannot process wrapper ${JSON.stringify(wrapper)}`);
    }
  }
  return output;
}

