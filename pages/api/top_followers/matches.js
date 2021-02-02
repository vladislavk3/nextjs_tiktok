import { pg } from 'helpers/db'

export default async (req, res) => {
  const author = (req.query['author'])
  const overlap = await pg.raw(`
    select distinct on (t.author) t.author "User", t.followers "Follower Count", u.started_following "Started Following You"
    from tiktok_next.top_accounts_normalized t
    inner join tiktok_next.user_followers u on t.author = u.following_author
    where u.author = ? 
  `, [author]).then(r => r.rows)
  res.statusCode = 200
  res.json(overlap);
}