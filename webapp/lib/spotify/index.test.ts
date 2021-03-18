jest.mock('../prisma');

import { Track } from '@prisma/client';

import { Spotify } from 'types';

import prisma from '../prisma';

import { getNewSpotifyIds, getTrackIds, smokeTest } from './index';

type WrapperList = Spotify.TrackWrapper[];

const publicUser: Spotify.PublicUserObject = {
  display_name: 'Alex',
  external_urls: {
    spotify: 'https://open.spotify.com/user/phil.gs',
  },
  href: 'https://api.spotify.com/v1/users/phil.gs',
  id: 'phil.gs',
  type: 'user',
  uri: 'spotify:user:phil.gs',
};

const song1: Spotify.TrackWrapper = {
  added_at: '2021-03-05T15:21:46Z',
  added_by: publicUser,
  is_local: false,
  track: {
    name: 'Song 1',
    id: '7p2T6ivlXN6n79DBfg8Lrv',
    uri: 'fake:track:7p2T6ivlXN6n79DBfg8Lrv',
  },
};

const song2: Spotify.TrackWrapper = {
  added_at: '2021-03-05T15:21:46Z',
  added_by: publicUser,
  is_local: false,
  track: {
    name: 'Song 2',
    id: '1fxm2w6M69YuCWrVFPHoQB',
    uri: 'fake:track:1fxm2w6M69YuCWrVFPHoQB',
  },
};

const song3: Spotify.TrackWrapper = {
  added_at: '2021-03-05T15:21:46Z',
  added_by: publicUser,
  is_local: false,
  track: {
    name: 'Song Free',
    id: '2MycpboRozeeoFNqWGrnak',
    uri: 'fake:track:2MycpboRozeeoFNqWGrnak',
  },
};

const local: Spotify.TrackWrapper = {
  added_at: '2021-03-05T15:21:46Z',
  track: {
    album: {
      album_type: null,
      artists: [],
      available_markets: [],
      external_urls: {},
      href: null,
      id: null,
      images: [],
      name: '2003-07-11: Mansfield, MA, USA (disc 3)',
      release_date: null,
      release_date_precision: null,
      type: 'album',
      uri: null,
    },
    artists: [
      {
        external_urls: {},
        href: null,
        id: null,
        name: 'Pearl Jam',
        type: 'artist',
        uri: null,
      },
    ],
    available_markets: [],
    disc_number: 0,
    duration_ms: 231000,
    explicit: false,
    external_ids: {},
    external_urls: {},
    href: null,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- allow `null` for `wrapper.track.id`
    id: null,
    is_local: true,
    name: 'Fortunate Son',
    popularity: 0,
    preview_url: null,
    track_number: 0,
    type: 'track',
    uri:
      'spotify:local:Pearl+Jam:2003-07-11%3A+Mansfield%2C+MA%2C+USA+%28disc+3%29:Fortunate+Son:231',
  },
};

describe('Smoke test', () => {
  it('correctly adds 2 and 2', () => {
    expect(smokeTest(2, 2)).toEqual(4);
  });
});

describe('Function `getTrackIds`', () => {
  it('extracts the ID from remote tracks', () => {
    const sampleData: WrapperList = [song1, song2, song3];
    const expectedOutput = [song1.track.id, song2.track.id, song3.track.id];

    expect(getTrackIds(sampleData)).toEqual(expectedOutput);
  });

  it('extracts the ID from local and remote tracks', () => {
    const sampleData: WrapperList = [song1, song2, song3, local];
    const expectedOutput = [
      song1.track.id,
      song2.track.id,
      song3.track.id,
      local.track.uri,
    ];

    expect(getTrackIds(sampleData)).toEqual(expectedOutput);
  });
});

describe('Function `getNewSpotifyIds`', () => {
  it('returns Spotify IDs for tracks not in the database', async () => {
    const timestamp = new Date();
    const song2Track: Track = {
      id: 99,
      spotifyId: song2.track.id,
      name: song2.track.name,
      isLocal: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    (prisma.track.findMany as jest.Mock).mockResolvedValue([song2Track]);

    const result = await getNewSpotifyIds([song1, song2]);
    const expected = [song1.track.id];
    expect(result).toEqual(expected);
  });
});
