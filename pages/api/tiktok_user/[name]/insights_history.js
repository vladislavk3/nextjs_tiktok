import { getSession } from 'next-auth/client'
import {pg} from 'helpers/db'
import {user_can_see_author} from 'helpers/auth'

const query = `
with latest as materialized (
	SELECT *
	FROM tiktok_next.insights_history
	inner join (
		select author, implied_date, max(created_at) created_at
		from tiktok_next.insights_history
		group by author, implied_date
	) q using (author, implied_date, created_at)
	where author = ?
),
numbered as (
	select implied_date, follower_count, video_view_count, profile_view_count, row_number() over (order by implied_date desc) rn
	from latest
),
joined as (
	select n1.*, n1.follower_count - n2.follower_count as follower_delta 
	from numbered n1
	left join numbered n2 on n1.rn = n2.rn-1
)
select implied_date "Date", follower_count "Followers", video_view_count "Video Views", profile_view_count "Profile Views",
follower_delta "New Followers"
from joined
`

const missing_query = `
	with follower_info as materialized (
		SELECT fetch_time::date, max(follower_count)
		FROM tiktok.stats_users
		where (fetch_time::date = (now() - '1 week'::interval)::date or
			fetch_time::date = (now())::date)
			and name = ?
		group by fetch_time::date
	),
	old_views as materialized (
		select video_id, max(views) "views", max(fetchedat::date) fetch_time
		, max(likes) "likes", max(shares) "shares", max(comments) "comments"
		from tiktok.user_videos
		where author = ?
		and fetchedat::date = (now() - '1 week'::interval)::date
		group by video_id
	),
	new_views as materialized (
		select video_id, max(views) "views", max(likes) "likes", max(shares) "shares", max(comments) "comments"
		from tiktok.user_videos
		where author = ?
		and fetchedat::date = (now())::date
		group by video_id
	),

	view_info as materialized (
		select now()::date fetch_time
		, sum((new_views.views - coalesce(old_views.views, 0))) delta
		, sum((new_views.likes - coalesce(old_views.likes, 0))) likes
		, sum((new_views.comments - coalesce(old_views.comments, 0))) "comments"
		, sum((new_views.shares - coalesce(old_views.shares, 0))) shares
		from new_views
		left join old_views using (video_id)
		group by now()::date
	)
	select fetch_time "Date", max::integer "Followers", (case when delta is null then 0 else delta end) "Video Views"
	, likes, comments, shares
	from follower_info
	left join view_info using(fetch_time)
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
    const result = await get_insights_history(name)
    res.statusCode = 200
	res.json(result);
}

export async function get_insights_history(name, infer_if_missing){
	const results = await pg.raw(query, [name]).then(r => r.rows)
	if(results.length > 0 || !infer_if_missing) return results; 

	return pg.raw(missing_query, [name, name, name]).then(r => r.rows)
}