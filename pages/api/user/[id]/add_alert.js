import { getSession } from 'next-auth/client'
import { pg } from 'helpers/db'
const webpush = require('web-push');

const settings = {
    web: {
        vapidDetails: {
            subject: 'mailto:xodarap00@gmail.com',
            publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC,
            privateKey: process.env.VAPID_PRIVATE
        }
    }
};

export default async (req, res) => {
    const session = await getSession({ req })
    const { id, signature } = req?.query
    if (signature != 'TRDBc9WtttPfDrMnto62MQ==') {
        res.statusCode = 500
        res.send(JSON.stringify({ 'error': 'not_logged_in', session: session }));
        return;
    }

    await insert_data(id, req.body)
    res.statusCode = 200
    res.json(true);
}

export async function insert_data(user_id, alert_info) {
    const alert_id = await insertAlert(user_id, alert_info.title + ': ' + alert_info.description)
    if (alert_info.push) await pushAlert(user_id, alert_info, alert_id)
}

async function insertAlert(user_id, description) {
    return pg('tiktok_next.alerts').insert({
        user_id,
        description,
        alert_type: 'User'
    }).returning('alert_id')
}

async function pushAlert(user_id, alert_info, alert_id) {
    const subscriptions = (await pg.select('endpoint', 'keys', 'id').from('tiktok_next.push_subscriptions')
        .where('user_id', user_id)
        .where('expirationTime', null)
        .orderBy('created_at', 'desc'));

    return Promise.all(subscriptions.map(async subscription => {
        const reconstructed_subscription = {
            endpoint: subscription.endpoint,
            keys: subscription.keys
        }

        const message = {
            title: alert_info.title,
            options: {
                body: alert_info.description,
                actions: [],
                icon: '/img/favicon.ico',
                timestamp: new Date(),
                data: {
                    url: alert_info.url
                }
            }
        }
        try {
            await webpush.sendNotification(reconstructed_subscription, JSON.stringify(message), settings.web);
            return pg('tiktok_next.push_history').insert({
                user_id,
                alert_id: alert_id[0],
                push_subscription_id: subscription.id
            })
        } catch (exception) {
            if (exception.body == 'push subscription has unsubscribed or expired.\n') {
                console.log('subscription expired, marking it in database')
                await pg('tiktok_next.push_subscriptions').where('id', subscription.id).update('expirationTime', 'now()');
            } else {
                throw exception;
            }
        }
    }));
}
