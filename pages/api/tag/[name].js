const ALT_SQL = `
with limited as Materialized (
	select v1.tag_name original_name, v2.tag_name alt_name
	FROM tiktok.video_tag v1
	inner join tiktok.video_tag v2 using (video_id)
	where  v1.tag_name != v2.tag_name
	and v1.tag_name = ?
	and v2.tag_name not in ('fyp', 'foryou', 'foryoupage', 'xyzbca', 'viral', 'foryourpage', 'viralvideo', 'trend', 'greenscreen', 'duet', 'reply',
                            'forupage', 'fypage', '4upage', '4yu')
	limit 10000
)
select alt_name "Alternative Tag Name", video_count "Video Count", view_count "View Count", view_count / nullif(video_count, 0) "Average Views"
from tiktok.tag_data
inner join (
	SELECT original_name, alt_name, count(1) usages
	FROM limited
	group by original_name, alt_name
	order by count(1) desc
	limit 10
) q
on q.alt_name = name
order by usages desc
`

const STATS_SQL = `
select video_count "Video Count", view_count "View Count", view_count / nullif(video_count, 0) "Average Views"
from tiktok.tag_data
where name = (?)
order by fetch_time desc nulls last
limit 1
`

import { getSession } from 'next-auth/client'
import {pg} from 'helpers/db'

export default async (req, res) => {
    const session = await getSession({ req })
    const { name } = req?.query
    /*
    todo: currently off so that uptime check works
    if((!session || !(session.user_id))) {
        res.statusCode = 500
        res.send(JSON.stringify({'error': 'not_logged_in'}));
        return;
    }
    */
    const stats = await pg.raw(STATS_SQL, [name]).then(r => r.rows[0])
    const alternatives = await pg.raw(ALT_SQL, [name]).then(r => r.rows)
    if(stats == undefined) {
        res.statusCode = 500
        res.send(JSON.stringify({'error': 'not_in_cache'}));
        return;
    }
    res.statusCode = 200
    res.json({stats, alternatives});
}
 

