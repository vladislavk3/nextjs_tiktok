import {  pull_data} from '../../../../pages/api/tiktok_user/[name]/daily_videos'
const { Model } = require('objection');
import {pg} from 'helpers/db'
import {Video} from 'models/video'

beforeAll(async () => {
   await pg.raw(`
    Insert into tiktok.user_videos(author,fetchedat,video_id) values ('test',  '2020-01-01',123);
    Insert into tiktok.user_videos(author,fetchedat,video_id) values ('test',  now(),123);
    Insert into tiktok.user_videos(author,fetchedat,video_id) values ('test',  now()-'1 day'::interval,123);
   insert into tiktok.stats_users(fetch_time,follower_count,name, video_count) values 
      (now(), 0,'test', 0), 
      ('2020-01-01', 30, 'ben', 1),
      ('2020-01-05', 30, 'ben', 2)`)

   for(var i=0; i < 14; i++) {
      await Video.query().insert({video_id: i, likes:10, shares:10, comments: 10, views: 100, author:'ben', fetchedat: '2020-01-02', create_time: '2020-01-02'})
      await Video.query().insert({video_id: i, likes:10, shares:10, comments: 10, views: 100, author:'ben', fetchedat: '2020-01-01', create_time: '2020-01-02'})
  }

  
  await Video.query().insert({video_id: 15, likes:10, shares:10, comments: 10, views: 100, author:'ben', fetchedat: '2020-01-05', create_time: '2020-01-02'})
  await Video.query().insert({video_id: 15, likes:10, shares:10, comments: 10, views: 50, author:'ben', fetchedat: '2020-01-03', create_time: '2020-01-02'})
  await Video.query().insert({video_id: 15, likes:10, shares:10, comments: 10, views: 0, author:'ben', fetchedat: '2020-01-02', create_time: '2020-01-02'})

});
afterAll(async () => {
    await pg.raw(`
    delete from tiktok.user_videos; 
    delete from tiktok.stats_users;
   `)
});

describe("daily dashboard", () => {
  test("nonexistent record", () => expect(pull_data(pg,'BenFake').then( p => p.cached)).resolves.toEqual(false));
  test("choose only one record also lower cases", () => expect(pull_data(pg,'test').then(p => p.videos.length)).resolves.toEqual(1));
  
  test('views since yesterday works with gaps in the data', async () => {
   const r = await pull_data(pg, 'ben')
   expect(r.summary["Views Since Yesterday"]).toEqual(50)
   expect(r.summary["Videos Since Yesterday"]).toEqual(1)
   });
});