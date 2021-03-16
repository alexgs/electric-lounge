export * from './helpers';
export { default as prisma } from './prisma';
export { refreshAccessToken } from './refresh';

const PLAYLIST_FIELDS = 'id,name,tracks.items(added_at,track.id,track.name)';

export const spotifyUrl = {
  playlists: (spotifyUserId: string, limit = 50): string =>
    `https://api.spotify.com/v1/users/${spotifyUserId}/playlists?limit=${limit}`,
  playlist: (playlistId: string, fields = PLAYLIST_FIELDS): string =>
    `https://api.spotify.com/v1/playlists/${playlistId}?fields=${fields}`,
};
