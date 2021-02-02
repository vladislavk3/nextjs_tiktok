import { getInsights } from '../../../../pages/api/tiktok_user/[name]/fetch_insights'
import {pg} from 'helpers/db'
import {Video} from 'models/video'
const { raw } = require('objection');

beforeAll(async () => {
    await Video.query().delete();
    for(var i=0; i < 100; i++) {
        await Video.query().insert({video_id: i, likes:10, shares:10, comments: 10, views: 100, author:'ben', fetchedat: 'now()', create_time: '2020-01-02'})
    }
    await Video.query().insert({video_id: 101, likes:100000, shares:1000000, comments: 100000000, views: 100000000000, author:'ben', fetchedat: 'now()', create_time: '2020-01-01'})
    

    await pg.raw(`insert into tiktok.stats_users(name, follower_count, fetch_time) values
                    ('ben', 30, '2020-01-01'),
                    ('ben', 60, '2020-01-02'),
                    ('ben4', 60, '2020-01-02'),
                    ('ben5', 60, '2020-01-02');`)
    await pg.raw(`insert into tiktok_next.insights(video_id, author, video_created_at, created_at) values
                    (1, 'ben', '2020-01-01', '2020-01-03'),
                    (1, 'ben', '2020-01-01', now()),
                    (2, 'ben2', '2020-01-03', '2020-01-03');`)
    
});

afterAll(async () => {
    await Video.query().delete();
    await pg.raw(`delete from tiktok.stats_users`);
    await pg.raw(`delete from tiktok_next.insights`);
});

describe("Videos API", () => {
    test("it's the right number of videos", () => expect(getInsights(pg, 'ben').then(v => v.length)).resolves.toEqual(1));
    test("it's the right number of videos even without videos", () => expect(getInsights(pg, 'ben2').then(v => v.length)).resolves.toEqual(1));
});