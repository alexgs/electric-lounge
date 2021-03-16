/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Spotify } from 'types';

type Playlist = Spotify.PlaylistObject;
type Track = Spotify.TrackObject;
type TrackList = Spotify.PlaylistTrackObject[];

function cleanId(track: Track) {
  if (track.is_local) {
    return {
      ...track,
      id: track.uri,
    };
  }
  return track;
}

function isPlaylist(list: Playlist|TrackList): list is Playlist {
  return (list as Playlist).tracks.items !== undefined;
}

export function getSpotifyTrackIds(list: Playlist|TrackList): string[] {
  if (isPlaylist(list)) {
    return getSpotifyTrackIdsFromPlaylist(list);
  }
  return getSpotifyTrackIdsFromTrackList(list);
}

export function getSpotifyTrackIdsFromPlaylist(playlist: Playlist): string[] {
  return getSpotifyTrackIdsFromTrackList(playlist.tracks.items);
}

export function getSpotifyTrackIdsFromTrackList(trackList: TrackList): string[] {
  // return trackList
  //   .map((trackObject) => trackObject.track.id)
  //   .filter((id) => id);
}

/**
 * Cleans up playlists from the Spotify API, including removal of falsey ID
 * values (which can be due to local tracks).
 */
export function rectifyPlaylistTracks(playlist: Playlist): Playlist {
  const items = playlist.tracks.items.map((track) => {
    if (track.id) {
      return track;
    }
    return {
      ...track,
      id: track.uri,
    };
  });
  return {
    ...playlist,
    tracks: { items },
  };
}
