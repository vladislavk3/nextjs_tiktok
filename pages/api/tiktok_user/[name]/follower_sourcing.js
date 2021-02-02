import { getSession } from 'next-auth/client'
import {pg} from 'helpers/db'
import {user_can_see_author} from 'helpers/auth'
import {query_shared} from './follower_info'

const query = `${query_shared}
ranked as (
	select *,
		row_number() over (partition by created_at::date order by abs(new_follower_production) desc) rn
	from results
),
best as (
	select * from ranked
	where rn < 6
)
select to_char(created_at, 'YYYY-MM-DD') "Date", video_id, description "Caption", floor(new_follower_production) "Estimated New Followers Generated"
from best
where new_follower_production != 0
order by created_at desc, new_follower_production desc
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
	const result = await getFollowerSourcing(pg, name, created_at)
    res.statusCode = 200
	res.json(result);
}

export async function getFollowerSourcing(pg, name, created_at) {
	return pg.raw(query, [name, name, 0, name]).then(r => r.rows);
}