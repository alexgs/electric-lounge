/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Prisma } from '@prisma/client';
import * as _ from 'lodash';

import { Spotify } from 'types';

import prisma from '../prisma';

type WrapperList = Spotify.TrackWrapper[];

export function smokeTest(a: number, b: number): number {
  return a + b;
}

// TODO Consider moving all of the playlist stuff into a place like
//   `lib/spotify-api/playlists`. There could be custom types defined in this
//   place that derive from the API types in the `types` folder.

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

export async function getNewSpotifyIds(
  trackWrappers: Spotify.TrackWrapper[],
): Promise<string[]> {
  const incomingSpotifyTrackIds = getTrackIds(trackWrappers);
  const existingDbTracks = await prisma.track.findMany({
    where: {
      spotifyId: { in: incomingSpotifyTrackIds },
    },
  });
  const existingSpotifyTrackIds = existingDbTracks.map(
    (track) => track.spotifyId,
  );
  return _.difference(incomingSpotifyTrackIds, existingSpotifyTrackIds);
}

export async function insertSpotifyTracks(wrappers: WrapperList): Promise<number> {
  let count = 0;
  for (const trackData of wrappers) {
    const id = getSpotifyId(trackData.track);
    const payload: Prisma.TrackCreateInput = {
      isLocal: trackData.is_local,
      spotifyId: id,
      name: trackData.track.name,
    };
    await prisma.track.create({
      data: payload,
    });
    count++;
  }
  return Promise.resolve(count);
}

export function getSpotifyId(track: Spotify.TrackObject): string {
  if (track.id) {
    return track.id;
  }
  return track.uri;
}
