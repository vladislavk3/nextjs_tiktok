import { getSession } from 'next-auth/client'
import { pg } from 'helpers/db'

export default async (req, res) => {
  const session = await getSession({ req })
  const { id } = req?.query
  if((!session || !(await validUser(id, session)))) {
      res.statusCode = 500
      res.send(JSON.stringify({'error': 'not_logged_in', session: session}));
      return;
  }

  const alerts = await getAlerts(id)
  res.statusCode = 200
  res.json(alerts);
}

async function validUser(id, session) {
  const res = await pg.raw(`
        select user_id
        from  tiktok_authentication.sessions 
        where access_token = (?)`, [session.accessToken]).then(r => r.rows[0])
  return (parseInt(res['user_id']) == parseInt(id))
}

async function getAlerts(user_id) {
  return pg.raw(`  
    select alerts.* , seen
    from tiktok_next.alerts
    left join 
    (select * 
      from tiktok_next.alerts_users
      where user_id = ?) q using (alert_id)
    where (alert_type = 'Systemwide'
    or alerts.user_id = ?)
    order by seen desc, alerts.created_at desc
  `, [user_id, user_id]).then(r => r.rows)
}
