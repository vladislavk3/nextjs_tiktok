import { getSession } from 'next-auth/client'
import {user_can_see_author} from 'helpers/auth'
var pg = require('knex')({
    client: 'pg',
    connection: process.env.DB_URL,
    searchPath: ['knex', 'public', 'tiktok', 'tiktok_authentication'],
    pool: {min: 0, idleTimeoutMillis: 1000}
});

export default async (req, res) => {
    const session = await getSession({ req })
    if (!session?.accessToken) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 'error': 'not logged in' }))
        return;
    }

    const { name } = req?.query
    const authenticated = await user_can_see_author(pg, session, name)
    if(!authenticated) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 'error': 'no TikTok cookie found' }))
        return;
    }
    const insights = await getInsights(pg, name)

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(insights))
}

async function cookie(access_token) {
    const r = await pg.raw(`
            select cookie, author
            from tiktok_authentication.cookies
            inner join sessions using (user_id)
            where sessions.access_token = (?)
            order by cookies.created_at desc
            limit 1
        `, [access_token,])
    return r.rows[0]
}

export async function getInsights(pg, name) {
    const insights = await pg.raw(`
            select video_id, Coalesce(insights.description, uv.description) "Description", total_views "Total Views"
            , (watch_time / insights.duration) * 100 "Watch %"        
            , insights.duration/1000 "Length (s)"
            , fyp_percent * total_views "FYP Views"
            , follow_percent * total_views "Follower Views"
            , hashtag_percent * total_views "Hashtag Views"
            , sound_percent * total_views "Sound Views"
            , profile_percent * total_views "Profile Views"
            , watch_time/1000 "Avg Watch Time"
            from tiktok_next.insights
            inner join (select video_id, max(created_at) created_at from tiktok_next.insights group by video_id) q using (video_id, created_at)
            left join (select video_id, description 
                    from tiktok.user_videos
                    inner join (
                        select video_id, max(fetchedat) fetchedat
                        from tiktok.user_videos
                        where author = ?
                        group by video_id
                    ) q using (video_id, fetchedat)
                    ) uv using (video_id)
            where author = ?
            order by video_created_at desc
    `, [name, name]).then(r => r.rows)
    insights.forEach(r =>  r['Total Views'] = Number.parseInt(r['Total Views']))
    return insights;
}