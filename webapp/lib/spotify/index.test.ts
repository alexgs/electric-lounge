import { Spotify } from 'types';

import { getTrackIds, smokeTest } from './index';

type WrapperList = Spotify.TrackWrapper[];

describe('Smoke test', () => {
  it('correctly adds 2 and 2', () => {
    expect(smokeTest(2, 2)).toEqual(4);
  });
});

describe('Function `getTrackIds`', () => {
  it('extracts the ID from remote tracks', () => {
    const sampleData: WrapperList = [
      {
        added_at: '2021-03-05T15:21:46Z',
        track: {
          name: 'Song 1',
          id: '7p2T6ivlXN6n79DBfg8Lrv',
        },
      },
      {
        added_at: '2021-03-05T15:21:46Z',
        track: {
          name: 'Song 2',
          id: '1fxm2w6M69YuCWrVFPHoQB',
        },
      },
      {
        added_at: '2021-03-05T15:21:46Z',
        track: {
          name: 'Song Free',
          id: '2MycpboRozeeoFNqWGrnak',
        },
      },
    ];
    const expectedOutput = [
      '7p2T6ivlXN6n79DBfg8Lrv',
      '1fxm2w6M69YuCWrVFPHoQB',
      '2MycpboRozeeoFNqWGrnak',
    ];

    expect(getTrackIds(sampleData)).toEqual(expectedOutput);
  });

  it('extracts the ID from local and remote tracks', () => {
    const sampleData: WrapperList = [
      {
        added_at: '2021-03-05T15:21:46Z',
        track: {
          name: 'Song 1',
          id: '7p2T6ivlXN6n79DBfg8Lrv',
        },
      },
      {
        added_at: '2021-03-05T15:21:46Z',
        track: {
          name: 'Song 2',
          id: '1fxm2w6M69YuCWrVFPHoQB',
        },
      },
      {
        added_at: '2021-03-05T15:21:46Z',
        track: {
          name: 'Song Free',
          id: '2MycpboRozeeoFNqWGrnak',
        },
      },
      {
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
      },
    ];
    const expectedOutput = [
      '7p2T6ivlXN6n79DBfg8Lrv',
      '1fxm2w6M69YuCWrVFPHoQB',
      '2MycpboRozeeoFNqWGrnak',
      'spotify:local:Pearl+Jam:2003-07-11%3A+Mansfield%2C+MA%2C+USA+%28disc+3%29:Fortunate+Son:231',
    ];

    expect(getTrackIds(sampleData)).toEqual(expectedOutput);
  });
});
