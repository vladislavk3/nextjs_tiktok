import { get_data, summary_statistics } from '../../../../pages/api/tiktok_user/[name]/videos'
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
                    ('ben5', 60, '2020-01-02')`)
    await Video.query().insert({video_id: 16, likes:100000, shares:1000000, comments: 100000000, views: 100000000000, author:'ben2', fetchedat: '2020-01-01'})  

    await Video.query().insert({video_id: 17, likes:10, shares:10, comments: 10, views: 100, author:'ben4', fetchedat: "2020-01-01", create_time: 'now()'})                
    await Video.query().insert({video_id: 18, likes:10, shares:10, comments: 10, views: 100, author:'ben4', fetchedat: "now()", create_time: '2020-01-01'})                
    await Video.query().insert({video_id: 200, likes:10, shares:10, comments: 10, views: 100, author:'ben5', fetchedat: raw("now() - INTERVAL '10 minutes'"), create_time: '2020-01-01'})                
});

afterAll(async () => {
    await Video.query().delete();
    await pg.raw(`delete from tiktok.stats_users`);
});

describe("Videos API", () => {
    test("it's the right number of videos", () => expect(get_data(pg, 'ben', 100).then(v => v.results.length)).resolves.toEqual(100));
    assertEqual('Average Views', 100);
    assertEqual('Average Likes', 10);
    assertEqual('View Standard Deviation', 0);
    assertEqual('Median Views', 100);
    assertEqual('Eng. Rate (Followers)', 0.5);
    test("cached", () => expect(get_data(pg, 'ben2', 1).then(v => v.cached)).resolves.toBeFalsy());
    test("cached", () => expect(get_data(pg, 'ben3', 1).then(v => v.cached)).resolves.toBeFalsy());
    test("cached", () => expect(get_data(pg, 'ben4', 1).then(v => v.cached)).resolves.toBeTruthy());
    test("cached", () => expect(get_data(pg, 'ben', 101).then(v => v.cached)).resolves.toBeFalsy());

    test("recently_fetched", () => expect(get_data(pg, 'ben5', 1).then(v => v.recently_fetched)).resolves.toBeFalsy());
    test("recently_fetched", () => expect(get_data(pg, 'ben4', 1).then(v => v.recently_fetched)).resolves.toBeTruthy());
});
 
function assertEqual(prop, value){
    test(prop, () => expect(get_data(pg, 'ben', 100).then(v => v.summary[prop])).resolves.toEqual(value));
} 