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
  
  const stripe_customer_id = await get_customer_id(session.accessToken)  
  const stripe_session = await stripe.billingPortal.sessions.create({
    customer: stripe_customer_id
  });

  res.redirect(stripe_session.url);
}

async function get_customer_id(access_token) {
  const r = await pg.raw(`
          select stripe_subscription.stripe_customer_id
          from sessions 
          inner join tiktok_next.stripe_session using (user_id) 
          inner join tiktok_next.stripe_subscription using (stripe_session_id)
          where sessions.access_token = (?)
          order by stripe_subscription.created_at desc
          limit 1
      `, [access_token,])
  return r.rows[0]['stripe_customer_id']
}