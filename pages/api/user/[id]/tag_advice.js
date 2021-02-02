import { getSession } from 'next-auth/client'
 
const query = `
with global_stats as (
	select avg(view_count) global_average, variance(view_count) global_variance
	from
	(
		select log(nullif(views, 0)) view_count
		from tiktok.user_videos
		where author = ?
	) q
),
author_videos as (
	select distinct on (video_id) video_id, views, likes
	from tiktok.user_videos
	where author = ?
	order by video_id, fetchedat desc
),
user_stats as (
	select tag_name, avg(log(nullif(views, 0))) average_views, count(1) actual_video_count, count(1) * 0.3 video_count,
	avg(nullif(views, 0) / nullif(likes, 0)) average_vpl
	from tiktok.video_tag
	inner join author_videos using (video_id)	
	group by tag_name
),
with_estimates as (
	-- todo: technically should use experimental variance
	select user_stats.*, (1 / ((1 / global_variance) + (video_count / global_variance))) * 
			((global_average / global_variance) + (average_views * video_count) / global_variance) new_mean,
	-- simplified form of posterior when sigma = sigma' (dubious, but shrug)
			(5 + average_vpl * video_count) / (video_count + 1) new_vpl
	from user_stats
	inner join global_stats on true
)
select tag_name "Tag Name", round(power(10, new_mean)) "Estimated True Average Views", 
round(power(10, average_views)) "Observed Average Views", actual_video_count "Number of Videos with Tag"
, round(average_vpl)::integer "Views / Like", round(new_vpl)::integer "Estimated True Views / Like"
from with_estimates
order by "Estimated True Average Views" desc
`

export default async (req, res) => {
	const session = await getSession({ req })

    const { id } = req?.query
    if(!session ) {
        res.statusCode = 500
        res.json({'error': 'not_logged_in', session: session});
        return;
    }
    var pg = require('knex')({
		client: 'pg',
		connection: process.env.DB_URL,
		searchPath: ['knex', 'public', 'tiktok', 'tiktok_authentication'],
		pool: {min: 0, idleTimeoutMillis: 1000}
	  });
    const r = await pg.raw(query, [id, id])
    res.statusCode = 200
	res.json(r.rows);
}