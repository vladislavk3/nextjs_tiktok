import { get_insights_history } from '../../../../pages/api/tiktok_user/[name]/insights_history'
import {pg} from 'helpers/db'
import {Video} from 'models/video'
const { raw } = require('objection');

beforeAll(async () => {
    await Video.query().delete();
    for(var i=0; i < 100; i++) {
        await Video.query().insert({video_id: i, likes:10, shares:10, comments: 10, views: 100, author:'ben', fetchedat: 'now()', create_time: '2020-01-02'})
    }
    await Video.query().insert({video_id: 101, likes:100000, shares:1000000, comments: 100000000, views: 100000, author:'ben', fetchedat: 'now()', create_time: '2020-01-01'})
    

    await pg.raw(`insert into tiktok.stats_users(name, follower_count, fetch_time) values
                    ('ben', 30, '2020-01-01'),
                    ('ben', 60, now()),
                    ('ben2', 60, now())`)
    await pg.raw(`insert into tiktok_next.insights_history(author, follower_count, video_view_count, implied_date, created_at) values
                    ('ben2', 10, 20, now() - '1 week'::interval, now() - '1 day'::interval)
                    , ('ben2', 20, 30, now() - '1 week'::interval, now())
                    , ('ben2', 40, 50, now() - '6 days'::interval, now())                    
                    `)
    
});

afterAll(async () => {
    await Video.query().delete();
    await pg.raw(`delete from tiktok.stats_users`);
    await pg.raw(`delete from tiktok_next.insights`);
    await pg.raw(`delete from tiktok_next.insights_history`);
});

describe("Insights history", () => {
    test("works with inference", () => expect(get_insights_history('ben', true).then(parseData)).resolves.toEqual({
        length: 1,
        views: '110000',
        likes: '101000',
        comments: '100001000',
        shares: '1001000',
    }));
    test("Fails without inference", () => expect(get_insights_history('ben', false).then(v => v.length)).resolves.toEqual(0));
});

Object.defineProperty(Array.prototype, "sort_by", {
    value: function sort_by(k) {
        return this.sort((a,b) => b[k] - a[k])
    }
})

const parseData = (results) => {
    return {
        length: results.length,
        views: results.sort_by('Video Views')[0]['Video Views'],
        likes: results.sort_by('likes')[0].likes,
        comments: results.sort_by('comments')[0].comments,
        shares: results.sort_by('shares')[0].shares,
    }
}