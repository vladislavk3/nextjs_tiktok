import { getSession } from 'next-auth/client'
const stripe = require('stripe')(process.env.STRIPE_KEY);
import {pg} from 'helpers/db'

export default async (req, res) => {
  const session = await getSession({ req })
  if (!session) {
    res.statusCode = 500
    res.send(JSON.stringify({ 'error': 'not_logged_in', session: session }));
    return;
  }
  
  const subscription_id = await get_customer_id(session.accessToken)
  const response = await stripe.subscriptions.update(subscription_id, {cancel_at_period_end: true});
  
  res.statusCode = 200
  res.json({ cancel_at: response.cancel_at });
}

async function get_customer_id(access_token) {
  const r = await pg.raw(`
          select subscription_id
          from sessions 
          inner join tiktok_next.stripe_session using (user_id) 
          inner join tiktok_next.stripe_subscription using (stripe_session_id)
          where sessions.access_token = (?)
          order by stripe_subscription.created_at desc
          limit 1
      `, [access_token,])
  return r.rows[0]['subscription_id']
}