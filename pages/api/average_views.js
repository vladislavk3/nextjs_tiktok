import {pg} from 'helpers/db'

const query = `
with latest as (
    SELECT h.*
    FROM tiktok_next.insights_history h
    inner join (
        select author, implied_date, Max(created_at) created_at
        from tiktok_next.insights_history
        group by author, implied_date) q using (author, implied_date, created_at)
)
, by_author as (
    select author, avg(video_view_count) average_view_count
    from latest
    group by author
)
, author_normalized as (
    select author, implied_date, video_view_count, video_view_count / average_view_count normalized_views
    from latest
    inner join by_author using (author)
)
, results as (
    select implied_date "Date", avg(normalized_views) "Average Views", 
    stddev(normalized_views) "View Standard Deviation"
    from author_normalized
    group by implied_date
)
select *,
    avg("Average Views") OVER (
                ORDER BY "Date" DESC
                ROWS BETWEEN 3 preceding AND 3 FOLLOWING
            ) "1-Week Moving Average"
from results
`

export default async (req, res) => {
    const result = await pg.raw(query).then(r => r.rows)
    res.statusCode = 200
	res.json(result);
}