import { getSession } from 'next-auth/client'
import {pg} from 'helpers/db'
import {user_can_see_author} from 'helpers/auth'
import { clean_name } from 'helpers/clean_name'

const video_query = `
with most_recent as (
	SELECT max(fetchedat) fetchedat
	FROM tiktok.user_videos
	where author = ?
),
today as materialized (
	SELECT distinct on (video_id) *
	FROM tiktok.user_videos
	inner join most_recent using (fetchedat)
	where author = ?
), yesterday as materialized (
	SELECT distinct on (video_id) *
	FROM tiktok.user_videos su
	inner join most_recent mr on su.fetchedat::date  < (mr.fetchedat)::date 
	where author = ?
	order by video_id, su.fetchedat::date desc
)
select today.video_id, today.description "Description", 
(today.views - coalesce(yesterday.views, 0))::integer "Views Since Yesterday", 
(today.likes - coalesce(yesterday.likes, 0))::integer "Likes Since Yesterday"
from today
left join yesterday using (video_id)
order by today.create_time desc
`

const author_query = `
with most_recent as (
	SELECT max(fetch_time) fetch_time
	FROM tiktok.stats_users
    where name = ?
),
today as (
	SELECT *
	FROM tiktok.stats_users
	inner join most_recent using (fetch_time)
	where name = ? 
    limit 1
), 
yesterday_max as (
	SELECT max(su.fetch_time) fetch_time
	FROM tiktok.stats_users su
	inner join most_recent mr on su.fetch_time::date <= (mr.fetch_time - '1 day'::interval)::date
    where name = ?
)
,yesterday as (
	SELECT *
	FROM tiktok.stats_users su
	inner join yesterday_max ym on su.fetch_time::date = ym.fetch_time::date
    where name = ?
    limit 1
)
select 
(today.follower_count - coalesce(yesterday.follower_count, 0))::integer "Followers Since Yesterday", 
(today.video_count - coalesce(yesterday.video_count, 0))::integer "Videos Since Yesterday",
today.follower_count "Total Followers",
today.avatar_medium, today.bio, today.fetch_time "Last Fetched"
from today
left join yesterday using (name)
`

export default async (req, res) => {
	const session = await getSession({ req })

	const { name } = req?.query
    const cleaned_name = clean_name(name);
    const authenticated = await user_can_see_author(pg, session, cleaned_name)
    if(!authenticated) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 'error': 'no TikTok cookie found' }))
        return;
	}
	const result = await pull_data(pg, cleaned_name);
	res.statusCode = 200;
	res.json(result);
}


function getSummary(videos) {
    return {
        "Views Since Yesterday": videos.map(v => v["Views Since Yesterday"]).reduce((a, b) => a + b, 0),
        "Likes Since Yesterday": videos.map(v => v["Likes Since Yesterday"]).reduce((a, b) => a + b, 0),
    }
}

export async function pull_data(pg, name) {
	const author = await pg.raw(author_query, [name, name, name, name]).then(r => r.rows[0])
	if(!author) return { cached: false }	
    const videos = await pg.raw(video_query, [name, name, name]).then(r => r.rows)
    const summarized = getSummary(videos)
    author["Last Fetched"] = author["Last Fetched"].toString()
	const summary = {...summarized, ...author}
	const cached = await pg.raw(`select max(fetchedat)::date >= now()::date fetched_today
								FROM tiktok.user_videos
								where author = ?`, [name]).then(r => r.rows[0])
	return { videos, summary, cached }
}