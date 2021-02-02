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

    const alert_ids = req.body
    await markAlertsSeen(id, alert_ids)
    res.statusCode = 200
    res.json(true);
}

async function validUser(id, session) {
    const res = await pg.raw(`
        select user_id
        from  tiktok_authentication.sessions 
        where access_token = (?)`, [session.accessToken]).then(r => r.rows[0])
    return (parseInt(res['user_id']) == parseInt(id))
}

async function markAlertsSeen(user_id, alert_ids) {
    const seen = true
    const alert_records = alert_ids.map(alert_id => {return { alert_id, user_id, seen}})
    return pg.raw(
        `? ON CONFLICT (alert_id, user_id)
              DO UPDATE SET
              seen = true
            RETURNING *;`
  , [pg('tiktok_next.alerts_users').insert(alert_records)])
}
