import { getSession } from 'next-auth/client'
import { pg } from 'helpers/db'
import { isCurrentUser } from 'helpers/auth'

export default async (req, res) => {
    const session = await getSession({ req })
    const { id, expired } = req?.query
    const id_to_use = id == 'session' ? session.user_id : id
    if ((!session || !(await isCurrentUser(id_to_use, session)))) {
        res.statusCode = 500
        res.send(JSON.stringify({ 'error': 'not_logged_in', session: session }));
        return;
    }

    const subscription = req.body
    await insertNotification(id_to_use, subscription, expired)
    res.statusCode = 200
    res.json(true);
}


async function insertNotification(user_id, subscription, expired) {
    const expirationTime = expired ? pg.raw('now()') : null;
    // console.log(expirationTime)
    return pg.raw(
        `? ON CONFLICT (endpoint)
              DO UPDATE set "expirationTime" = ?;`
        , [pg('tiktok_next.push_subscriptions').insert({
            user_id,
            endpoint: subscription.endpoint,
            keys: subscription.keys,
            expirationTime 
        }), expirationTime])
}
