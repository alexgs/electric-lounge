/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Spotify } from 'types';

// There's a lot of type coercion in here, which is annoying but I don't have
// the patience right now to deal with Typescript and make it play nice.

type CleanPlaylist = Spotify.CleanPlaylistObject;
type CleanTrack = Spotify.CleanPlaylistTrackObject;
type RawPlaylist = Spotify.RawPlaylistObject;
type TrackList = Spotify.RawPlaylistTrackObject[];

function isPlaylist(list: RawPlaylist | TrackList): list is RawPlaylist {
  return (list as RawPlaylist).tracks.items !== undefined;
}

export function getSpotifyTrackIds(list: RawPlaylist | TrackList): string[] {
  if (isPlaylist(list)) {
    return getSpotifyTrackIdsFromPlaylist(list);
  }
  return getSpotifyTrackIdsFromTrackList(list);
}

export function getSpotifyTrackIdsFromPlaylist(
  playlist: RawPlaylist,
): string[] {
  return getSpotifyTrackIdsFromTrackList(playlist.tracks.items);
}

export function getSpotifyTrackIdsFromTrackList(
  trackList: TrackList,
): string[] {
  return trackList
    .map((trackObject) => trackObject.track.id)
    .filter((id) => id) as string[];
}

/**
 * Cleans up playlists from the Spotify API, including removal of falsey ID
 * values (which can be due to local tracks).
 */
export function rectifyPlaylistTracks(playlist: RawPlaylist): CleanPlaylist {
  const items = playlist.tracks.items.map((track): CleanTrack => {
    if (track.id) {
      return track as CleanTrack;
    }
    return {
      ...track,
      id: track.uri,
    } as CleanTrack;
  });
  return {
    ...playlist,
    tracks: { items },
  };
}
