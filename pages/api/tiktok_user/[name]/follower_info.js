import { getSession } from 'next-auth/client'
import {pg} from 'helpers/db'
import {user_can_see_author} from 'helpers/auth'

export const query_shared = `
with author_latest as MATERIALIZED (
	select * 
	from tiktok_next.latest_videos
	where author = ?
),
insights_latest as MATERIALIZED (
	select *
	FROM tiktok_next.insights
	inner join (
		select video_id, created_at::date created_date, max(created_at) created_at
		FROM tiktok_next.insights 
		where author = ?
		group by video_id, created_date
	) q using (video_id, created_at)
	where created_at >= to_timestamp(?)
)
, follower_history as materialized (
	SELECT follower_count, h.implied_date
	FROM tiktok_next.insights_history h
	inner join (
		SELECT implied_date, max(created_at) created_at
		FROM tiktok_next.insights_history
		group by implied_date
	) q using (implied_date, created_at)
	where author = ?
)
, stats_latest as (
	select * 
	from tiktok.stats_users
	inner join (
		select name, fetch_time::date fd, max(fetch_time) fetch_time
		from tiktok.stats_users
		group by name, fetch_time::date
	) q using (name, fetch_time)
)
,by_day as (
	SELECT total_views * (1 - follow_percent) relevant_views,
    id, video_id, insights.author, 
    --insights stopped including descriptions at some point
    Coalesce(insights.description, latest_videos.description) description, 
    total_views, unique_views, 
    insights.duration, watch_time, 
    -- fall back to using stats users if insights doesn't have follower data
    case when fh.follower_count > 0 then fh.follower_count
		when followers > 0 then followers 
		else stats_users.follower_count end followers, 
    video_created_at, created_at, sound_percent, fyp_percent, follow_percent, hashtag_percent, profile_percent
	FROM insights_latest insights
	left join stats_latest stats_users on stats_users.name = insights.author 
		and stats_users.fetch_time::date = insights.created_at::date
    left join author_latest latest_videos using (video_id)
	left join follower_history fh on fh.implied_date = created_at::date
)
,pairs as (
	select 
		b2.followers - b1.followers new_followers, 
		b2.relevant_views - coalesce(b1.relevant_views, 0) new_views,
		b2.video_id, b2.description, b2.created_at
	from by_day b2
	left join by_day b1 on b1.video_id = b2.video_id 
		and b2.created_at::date = (b1.created_at + '1 day'::interval)::date
),
all_views as (
	select created_at::date created_date
	, sum(new_views) total_new_views
	, max(max_new_followers) max_new_followers
	from pairs p 
	inner join (
		select created_at::date created_date
		, coalesce(new_followers,0) max_new_followers
		,row_number() 
       		over (partition by created_at::date
             order by abs(coalesce(new_followers,0)) desc)  rn
		from pairs
		) q on q.created_date = p.created_at::date and rn = 1
	group by created_at::date
),
results as (
	select video_id, description, created_at::date
	, new_views * max_new_followers / nullif(total_new_views, 0) new_follower_production,
	new_views, max_new_followers, total_new_views
	from pairs
	join all_views on created_date = created_at::date
),
`

const query = `${query_shared}
best as (
    select video_id, max(description) description, sum(new_follower_production) new_follower_production
    from results
    group by video_id
)
select video_id, description "Caption", floor(new_follower_production) "Estimated New Followers Generated"
from best
order by new_follower_production desc
`

export default async (req, res) => {
	const session = await getSession({ req })

	const { name, created_at } = req?.query
    const authenticated = await user_can_see_author(pg, session, name)
    if(!authenticated) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 'error': 'no TikTok cookie found' }))
        return;
    }
	const result = await getFollowers(pg, name, created_at)
    res.statusCode = 200
	res.json(result);
}

export async function getFollowers(pg, name, created_at) {
	return pg.raw(query, [name, name, created_at, name]).then(r => r.rows);
}