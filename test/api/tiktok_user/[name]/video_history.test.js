import { get_video_history } from '../../../../pages/api/tiktok_user/[name]/video_history'
import { pg } from 'helpers/db'
import { Video } from 'models/video'
const { raw } = require('objection');

beforeAll(async () => {
  await Video.query().insert({ video_id: 201, likes: 10, shares: 10, comments: 10, views: 10, author: 'ben2', fetchedat: 'now()', create_time: 'now()' })
  await Video.query().insert({ video_id: 202, likes: 20, shares: 20, comments: 20, views: 20, author: 'ben2', fetchedat: 'now()', create_time: '2020-01-01' })
  await Video.query().insert({ video_id: 203, likes: 20, shares: 20, comments: 20, views: 20, author: 'ben2', fetchedat: raw("now() - '1 day'::interval"), create_time: '2020-01-01' })
  await Video.query().insert({ video_id: 203, likes: 30, shares: 40, comments: 50, views: 60, author: 'ben2', fetchedat: 'now()', create_time: '2020-01-01' })
  await Video.query().insert({ video_id: 204, likes: 30, shares: 40, comments: 50, views: 60, author: 'ben2', fetchedat: raw("now() - '1 day'::interval"), create_time: raw("now() - '1 day'::interval") })
  await Video.query().insert({ video_id: 204, likes: 40, shares: 50, comments: 60, views: 70, author: 'ben2', fetchedat: 'now()', create_time: '2020-01-01' })
  await Video.query().insert({ video_id: 205, likes: 40, shares: 50, comments: 60, views: 70, author: 'ben2', fetchedat: 'now()', create_time: raw("now() - '1 day'::interval") })
  await Video.query().insert({ video_id: 206, likes: 30, shares: 50, comments: 60, views: 70, author: 'ben2', fetchedat: raw("now() - '3 days'::interval"), create_time: raw("now() - '5 days'::interval") })
  await Video.query().insert({ video_id: 206, likes: 50, shares: 60, comments: 70, views: 80, author: 'ben2', fetchedat: 'now()', create_time: raw("now() - '5 days'::interval") })
  await pg.raw(`insert into tiktok.stats_users(name, follower_count, fetch_time) values
                    ('ben', 30, '2020-01-01'),
                    ('ben', 60, now()),
                    ('ben2', 60, now())`)

});

afterAll(async () => {
  await Video.query().delete();
  await pg.raw(`delete from tiktok.stats_users`);
});

describe("Video history", () => {
  let results;
  beforeAll(async () => {
    results = await get_video_history('ben2', true).then(parseData)
  })
  test("Video created within window", () => expect(results[0]).toEqual({
    video_id: '201',
    description: null,
    likes: '10',
    shares: '10',
    comments: '10',
    views: '10'
  }));
  test("Video created outside of window", () => expect(results[1]).toEqual(
    {
      video_id: '203',
      description: null,
      likes: '10',
      shares: '20',
      comments: '30',
      views: '40'
    }));
  test("Created within window, multiple samples", () => expect(results[2]).toEqual(
    {
      video_id: '204',
      description: null,
      likes: '40',
      shares: '50',
      comments: '60',
      views: '70'
    }));
  test("Created within window, yesterday", () => expect(results[3]).toEqual(
    {
      video_id: '205',
      description: null,
      likes: '40',
      shares: '50',
      comments: '60',
      views: '70'
    }));
  test("Created within window, multiple gaps", () => expect(results[4]).toEqual(
    {
      video_id: '206',
      description: null,
      likes: '50',
      shares: '60',
      comments: '70',
      views: '80'
    }));
  test("length", () => expect(results.length).toEqual(5));
});


const parseData = (results) => {
  return results.sort((a, b) => a['video_id'] - b['video_id'])
}