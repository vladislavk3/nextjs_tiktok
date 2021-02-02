import { getSession } from 'next-auth/client'
import {pg} from 'helpers/db'
import { std, mean, median } from 'mathjs'
const query = `
    select video_id id, description "Description", likes "Likes", views "Views", shares "Shares", comments "Comments", 
    duration "Duration (s)", create_time "Create Date",
    fetchedat, views / nullif(likes, 0) "Views/Like"
	, '<a href="https://tokboard.com/songs/' || song.song_id || '">' ||
    song.title || ' - ' || song.author ||
    '</a>' "Sound"
    , create_time::date - peak_day "Days after sound peak"
    , (100 * (likes::bigint + shares + comments) / nullif(views, 0))::int  "Eng. Rate (Views)"
    from tiktok.user_videos
    inner join (
        select video_id, max(fetchedat) fetchedat
        from tiktok.user_videos
        group by video_id
    ) q using (video_id, fetchedat)
	left join tiktok_next.tokboard_song song on song.song_id = user_videos.soundid
    where user_videos.author = ?
    order by "Create Date" desc
    limit ?
`
const author_query =`
    select name, follower_count, video_count, like_count, avatar_medium, bio
    from tiktok.stats_users 
    where name = (?) 
    order by fetch_time desc
    limit 1`
export default async (req, res) => {
	const session = await getSession({ req })

    const { name, count, pro } = req?.query
    if(!session) {
        res.statusCode = 500
        res.json({'error': 'not_logged_in', session: session});
        return;
    }
    const result = await get_data(pg,name, count, pro)
    res.statusCode = 200
	res.json(result);
}

export async function get_data(pg, name, count, pro) {
    // The idea is that we pull as many as they have if they have a pro account, but only
    // consider it a cache miss if we have less than the number requested
    const count_to_pull = pro == 'true' ? 5000 : count
    const videos = await pg.raw(query, [name, count_to_pull])
                        .then(r => r.rows)
    
    const newest = videos.map(v => v['fetchedat']).reduce((ac, d) => ac > d ? ac : d, new Date(2020, 1, 1))    
    const recently_fetched = (new Date() - newest) < 1000 * 60 //don't show that it's cached if it was fetched within the last 1 minute
    const cached = videos.length >= count && sameDay(newest, new Date())
    
    const statistics = await pg.raw(author_query, [name]).then(r=> r.rows[0])   
    if (statistics === undefined) { return {cached: false}} 
    const summary = await summary_statistics(videos, statistics)
    const video_results = videos.map(r => { delete r.fetchedat; return r})
    const results = calculate_er(video_results, statistics) 
    return {cached: cached, results, author: statistics, summary, recently_fetched}
}

function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
}

const safeMath = (f, v) => {
    try { return f(v) }
    catch { return 'N/A'}
}

const safeMean = (v) => safeMath(mean, v) 
const safeStd = (v) => safeMath(std, v)
const safeMedian = (v) => safeMath(median, v)

export async function summary_statistics(videos,author_stats) {
    if(author_stats === undefined || videos === undefined || videos.length === 0){ return null; }
    const recent = videos.slice(0,14);
    const average_likes = safeMean(recent.map(video => +video.Likes));
    const average_shares = safeMean(recent.map(video => +video.Shares));
    const average_comments = safeMean(recent.map(video => +video.Comments));
    const sd_views = safeStd(recent.map(video => +video.Views));
    const ern = average_likes + average_shares + average_comments
    const er = (author_stats == undefined || author_stats.follower_count == 0) ? null : (ern /author_stats.follower_count)
    const median_views = safeMedian(recent.map(video => +video.Views));
    return {
        'Average Views': safeMean(recent.map(video => +video.Views)),
        'Average Likes': average_likes,
        'View Standard Deviation': sd_views,
        'Eng. Rate (Followers)': er,
        'Median Views': median_views
    }
}

export function calculate_er(videos, author_stats) {
    const followers = author_stats.follower_count;
    if(followers == 0 || followers == undefined) { return videos; }
    return videos.map(v => {
        const engagement = v['Shares'] + v['Comments'] + v['Likes']
        const er = (100 * engagement / followers)
        return {...v,
        'Eng. Rate (Followers)':  Number.parseInt(er),
        'Views': Number.parseInt(v['Views'])}
    })
}