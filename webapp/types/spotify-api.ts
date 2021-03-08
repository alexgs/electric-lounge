/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

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

// https://developer.spotify.com/documentation/web-api/reference/#object-playlistobject
export interface PlaylistObject {
  description: string;
  id: string;
  name: string;

  [key: string]: unknown;
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

// https://developer.spotify.com/documentation/web-api/reference/#object-simplifiedplaylistobject
export interface SimplifiedPlaylistObject {
  description: string;
  id: string;
  name: string;
  owner: PublicUserObject;
  tracks: PlaylistTracksRefObject;

  [key: string]: unknown;
}
