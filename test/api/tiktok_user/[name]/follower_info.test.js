import { getFollowers } from '../../../../pages/api/tiktok_user/[name]/follower_info'
import { pg } from 'helpers/db'
import { Video } from 'models/video'
import { getFollowerSourcing }  from '../../../../pages/api/tiktok_user/[name]/follower_sourcing'

beforeAll(async () => {
  await Video.query().delete();
  for (var i = 0; i < 100; i++) {
    await Video.query().insert({ video_id: i, likes: 10, shares: 10, comments: 10, views: 100, author: 'ben', fetchedat: 'now()', create_time: '2020-01-02' })
  }
  await Video.query().insert({ video_id: 101, likes: 100000, shares: 1000000, comments: 100000000, views: 100000000000, author: 'ben', fetchedat: 'now()', create_time: '2020-01-01' })

  await pg.raw(`insert into tiktok.stats_users(name, follower_count, fetch_time) values
                    ('ben', 30, '2020-01-01'),
                    ('ben', 60, '2020-01-02'),
                    ('ben4', 60, '2020-01-02'),
                    ('ben5', 60, '2020-01-02');`)
  await pg.raw(`insert into tiktok_next.insights(video_id, author, video_created_at, created_at, followers, total_views, follow_percent) values
                    (1, 'ben', '2020-01-01', to_timestamp(1604466231), 1, 50, 0),
                    (1, 'ben', '2020-01-01', to_timestamp(1604466231) + '1 day'::interval, 5, 100, 0),
                    (1, 'ben', '2020-01-01', to_timestamp(1604466231) + '2 days'::interval, 100, 200, 0),
                    (2, 'ben2', '2020-01-03', '2020-01-03', 1, 200, 5);`)

  // const negative_videos = [[200, 2, 0], [200, 3, 3], [201, 2, 0], [201, 3, 1]].map(r => ({
  //    video_id: r[0], views: r[2], author: 'negative', fetchedat: '2020-02-0' + r[1].toString()
  // }))
  await pg('tiktok_next.insights').insert([[200, 2, 0], [200, 3, 80], [201, 2, 0], [201, 3, 20]].map(r => ({
    video_id: r[0], total_views: r[2], author: 'negative', created_at: '2020-02-0' + r[1].toString(), follow_percent: 0.9
    }))
  )
  await pg('tiktok_next.insights_history').insert(
    [[20, 2], [10, 3]].map(r => ({
      author: 'negative', follower_count: r[0], implied_date: '2020-02-0' + r[1].toString()
    }))
  )
});

afterAll(async () => {
  await Video.query().delete();
  await pg.raw(`delete from tiktok.stats_users`);
  await pg.raw(`delete from tiktok_next.insights`);
  await pg.raw(`delete from tiktok_next.insights_history`);
});

describe("Follower info", () => {
  test("it calcs followers", () => expect(getFollowers(pg, 'ben', 1604466230).then(v => v[0]['Estimated New Followers Generated'])).resolves.toEqual(99));
  test("time filter", () => expect(getFollowers(pg, 'negative', 1604466230)).resolves.toEqual([]));
  test("Negative followers", () => expect(getFollowers(pg, 'negative', 0).then(v => 
    v.filter(r => r.video_id == '201')[0]['Estimated New Followers Generated'])).resolves.toEqual(-2));
});

describe("Follower Sourcing", () => {
  const extract_followers = v => v.sort((a,b) => parseInt(a.Date[-1]) - parseInt(b.Date[-1])).map(r => r['Estimated New Followers Generated'])
  test("it calcs followers", () => expect(getFollowerSourcing(pg, 'ben', 1604466230).then(extract_followers))
    .resolves.toEqual([95, 4]));
  test("time filter", () => expect(getFollowerSourcing(pg, 'negative', 1604466230)).resolves.toEqual([]));
  test("Negative followers", () => expect(getFollowerSourcing(pg, 'negative', 0).then(extract_followers))
  .resolves.toEqual([-2, -8]));
});