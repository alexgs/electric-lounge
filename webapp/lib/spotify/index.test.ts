import { smokeTest } from './index';

test('correctly adds 2 and 2', () => {
  expect(smokeTest(2, 2)).toEqual(4);
});
