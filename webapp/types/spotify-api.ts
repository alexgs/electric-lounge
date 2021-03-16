/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

export interface ArrayObject<Item> {
  items: Item[];
}

// https://developer.spotify.com/documentation/web-api/reference/#object-playlistobject
export interface CleanPlaylistObject {
  description: string;
  id: string;
  name: string;
  tracks: ArrayObject<CleanPlaylistTrackObject>;

  [key: string]: unknown;
}

// https://developer.spotify.com/documentation/web-api/reference/#object-playlisttrackobject
export interface CleanPlaylistTrackObject {
  added_at: string; // timestamp
  track: CleanTrackObject;

  [key: string]: unknown;
}

// A rectified track that is guaranteed to have an ID. For local files, this is just a copy of the `uri` field
// https://developer.spotify.com/documentation/web-api/reference/#object-trackobject
export interface CleanTrackObject {
  id: string;
  name: string;

  [key: string]: unknown;
}

// https://developer.spotify.com/documentation/web-api/reference/#object-pagingobject
export interface PagingObject<Item> {
  href: string;
  items: Item[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

// https://developer.spotify.com/documentation/web-api/reference/#object-playlisttracksrefobject
export interface PlaylistTracksRefObject {
  href: string;
  total: number;
}

// https://developer.spotify.com/documentation/web-api/reference/#object-publicuserobject
export interface PublicUserObject {
  display_name: string;
  id: string;

  [key: string]: unknown;
}

// https://developer.spotify.com/documentation/web-api/reference/#object-playlistobject
export interface RawPlaylistObject {
  description: string;
  id: string;
  name: string;
  tracks: ArrayObject<RawPlaylistTrackObject>;

  [key: string]: unknown;
}

// https://developer.spotify.com/documentation/web-api/reference/#object-playlisttrackobject
export interface RawPlaylistTrackObject {
  added_at: string; // timestamp
  track: RawTrackObject;

  [key: string]: unknown;
}

// The data from the Spotify API does not have an `ID` for local tracks
// https://developer.spotify.com/documentation/web-api/reference/#object-trackobject
export interface RawTrackObject {
  id: string | null;
  name: string;
  uri: string;

  [key: string]: unknown;
}

// https://developer.spotify.com/documentation/web-api/reference/#object-simplifiedplaylistobject
export interface SimplifiedPlaylistObject {
  description: string;
  id: string;
  name: string;
  owner: PublicUserObject;
  tracks: PlaylistTracksRefObject;

  [key: string]: unknown;
}
