import { getSession } from 'next-auth/client'
import {pg} from 'helpers/db'
import {user_can_see_author} from 'helpers/auth'

const query = `
with recent_per_day as materialized (
	select *
	from (
		select *,
		row_number() over (partition by video_id order by fetchedat desc) day_order
		from (
			select *, row_number() over (partition by video_id, fetchedat::date order by fetchedat desc) rn	
			from tiktok.user_videos
		) q 
		where rn = 1
		and author = ?
		and fetchedat >= now() - '10 days'::interval
	) q2
)
, earliest_videos as (
	select video_id, min(fetchedat) fetchedat
	from recent_per_day
	group by video_id
)
, with_earliest as (
	select recent_per_day.*,
		--If this is the first instancce we have seen of the video and
		--it was created within the past week, assume that all of the views
		-- it has came within the past week
		 earliest_videos.fetchedat is not null
			and recent_per_day.create_time::date >= now() - '10 days'::interval
		first_instance
	from recent_per_day
	left join earliest_videos using (video_id, fetchedat)
)
, deltas as (
	select recent.video_id, recent.description, recent.fetchedat::date
	, recent.likes - coalesce(previous.likes, case when first_instance then 0 else null end) likes
	, recent.shares - coalesce(previous.shares, case when first_instance then 0 else null end) shares
	, recent.comments - coalesce(previous.comments, case when first_instance then 0 else null end) "comments"
	, recent.views - coalesce(previous.views, case when first_instance then 0 else null end) "views"
	from with_earliest recent
	left join recent_per_day previous on previous.video_id = recent.video_id
		and previous.day_order = recent.day_order + 1
	where recent.fetchedat > now() - '6 days'::interval --Cutoff videos which are more than a week old so have inflated numbers at first
)
select video_id, max( description ) description
, sum(likes)::bigint likes
, sum(shares) shares
, sum(comments) "comments"
, sum(views) "views"
from deltas
where likes is not null
	and shares is not null
	and comments is not null
	and views is not null
group by video_id
`

export default async (req, res) => {
	const session = await getSession({ req })

	const { name } = req?.query
    const authenticated = await user_can_see_author(pg, session, name)
    if(!authenticated) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 'error': 'no TikTok cookie found' }))
        return;
    }
    const result = await get_video_history(name)
    res.statusCode = 200
	res.json(result);
}

export async function get_video_history(name){
	const results = await pg.raw(query, [name]).then(r => r.rows)
	return results; 
}