export { default as prisma } from './prisma';
export { refreshAccessToken } from './spotify/oauth';

const PLAYLIST_FIELDS =
  'id,name,tracks.items(added_at,added_by,is_local,track.id,track.name,track.uri)';

export const spotifyUrl = {
  playlists: (spotifyUserId: string, limit = 50): string =>
    `https://api.spotify.com/v1/users/${spotifyUserId}/playlists?limit=${limit}`,
  playlist: (playlistId: string): string =>
    `https://api.spotify.com/v1/playlists/${playlistId}?fields=${PLAYLIST_FIELDS}`,
};
