import { getSession } from 'next-auth/client'
import {pg} from 'helpers/db'
import { std, mean, median } from 'mathjs'
const query = `
select 'avg_sound_lag' "attribute", json_build_object('avg_lag', avg(create_time::date - peak_day), 'n', count(song_id)) "value"
from tiktok.user_videos
inner join (
    select video_id, max(fetchedat) fetchedat
    from tiktok.user_videos
    group by video_id
) q using (video_id, fetchedat)
left join tiktok_next.tokboard_song song on song.song_id = user_videos.soundid
where user_videos.author = ?

union all

select 'fyp', json_build_object('n', count(distinct video_id), 'tags', array_agg(tag_name))
from tiktok.video_tag
inner join tiktok.user_videos using (video_id)	
where author = ?
and tag_name in (
    'fyp',
    'foryoupage',
    'xyzabc',
    'xyzbca',
    'viral',
    'foryou'
)

union all

select 'video_too_short' "attribute", json_build_object('n', count(distinct video_id)) "value"
from tiktok.user_videos
where author = ?
and duration < 5

union all

(with coded as (
    select views, 
        case when duration between 5 and 20 then 'short' 
        when duration < 40 then 'medium'
        else 'long' end duration_category
    from tiktok.user_videos
    inner join (
        select video_id, max(fetchedat) fetchedat
        from tiktok.user_videos
        group by video_id
    ) q using (video_id, fetchedat)
    where author = ?
),
compressed as (
    select jsonb_agg(json_build_object('g', duration_category, 'v', ln(nullif(views,0)))) cv
    from coded
),
other_stats as (
    select json_build_object('duration_category', duration_category, 'count', count(1), 'average_views', avg(views)) o
    from coded
    group by duration_category
)
select 'optimal_duration', json_build_object('f', tiktok_next.f_test(cv), 'details', o)
from compressed
left join (
    select json_agg(o) o
    from other_stats) q on true)

union all

(with coded as (
    select views, time_category
    from (values ('0-4'), ('4-8'), ('8-12'), ('12-16'), ('16-20'), ('20-24')) s(tc)
    left join 
    (select views, 
       case when create_time::time between time '00:00' and '04:00' then '0-4'
       when create_time::time between time '04:00' and '08:00' then '4-8'
       when create_time::time between time '08:00' and '12:00' then '8-12'
       when create_time::time between time '12:00' and '16:00' then '12-16'
       when create_time::time between time '16:00' and '20:00' then '16-20'
       when create_time::time between time '20:00' and '24:00' then '20-24'
       else '' end time_category
     from tiktok.user_videos
     inner join (
        select video_id, max(fetchedat) fetchedat
        from tiktok.user_videos
        group by video_id
    ) q using (video_id, fetchedat)
    where author = ?) uv on tc = uv.time_category
),
compressed as (
    select jsonb_agg(json_build_object('g', time_category, 'v', ln(nullif(views,0)))) cv
    from coded
),
other_stats as (
    select json_build_object('time_category', time_category, 'count', count(1), 'average_views', avg(views)) o
    from coded
    group by time_category
)
select 'optimal_time', json_build_object('f', tiktok_next.f_test(cv), 'details', o)
from compressed
left join (
    select json_agg(o) o
    from other_stats) q on true)
`
export default async (req, res) => {
	const session = await getSession({ req })

	const { name } = req?.query
    if(!session) {
        res.statusCode = 500
        res.json({'error': 'not_logged_in', session: session});
        return;
    }
    const result = await pg.raw(query, [name, name, name, name, name]).then(r => r.rows)
    res.statusCode = 200
	res.json(result);
}