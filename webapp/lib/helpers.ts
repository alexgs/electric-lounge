/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Spotify } from 'types';

type Playlist = Spotify.PlaylistObject;
type Track = Spotify.TrackObject;
type WrapperList = Spotify.TrackWrapper[];

export function cleanId(track: Track): Spotify.SpotifyTrackObject {
  if (isLocalTrack(track)) {
    return {
      ...track,
      id: track.uri,
    };
  }
  return track;
}

function isLocalTrack(track: Track): track is Spotify.LocalTrackObject {
  return (track as Spotify.LocalTrackObject).is_local;
}

function isPlaylist(list: Playlist|WrapperList): list is Playlist {
  return (list as Playlist).tracks.items !== undefined;
}

export function getSpotifyTrackIds(list: Playlist|WrapperList): string[] {
  if (isPlaylist(list)) {
    return getSpotifyTrackIdsFromPlaylist(list);
  }
  return getSpotifyTrackIdsFromWrapperList(list);
}

export function getSpotifyTrackIdsFromPlaylist(playlist: Playlist): string[] {
  return getSpotifyTrackIdsFromWrapperList(playlist.tracks.items);
}

export function getSpotifyTrackIdsFromWrapperList(trackWrappers: WrapperList): string[] {
  return trackWrappers
    .map((trackObject) => trackObject.track.id)
    .filter((id) => id) as string[];
}

export function getTrackIds(trackWrappers: WrapperList): string[] {
  return trackWrappers
    .map((wrapper) => cleanId(wrapper.track))
    .map((track) => track.id);
}

/**
 * Cleans up playlists from the Spotify API, including removal of falsey ID
 * values (which can be due to local tracks).
 */
export function rectifyPlaylistTracks(playlist: Playlist): Playlist {
  const items = playlist.tracks.items.map((wrapper) => {
    return {
      ...wrapper,
      track: cleanId(wrapper.track),
    };
  });
  return {
    ...playlist,
    tracks: { items },
  };
}
