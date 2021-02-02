import { getSession } from 'next-auth/client'
import { valid_code } from './valid_code'

const stripe = require('stripe')(process.env.STRIPE_KEY);
const { Model } = require('objection');
import {pg} from 'helpers/db'
Model.knex(pg);

export default async (req, res) => {
  const session = await getSession({ req })
  const { code } = req.query
  if (!session) {
    res.statusCode = 500
    res.send(JSON.stringify({ 'error': 'not_logged_in', session: session }));
    return;
  }
  const stripe_parameters = store_info
  const trial_days = valid_code(code);
  if (trial_days) stripe_parameters['subscription_data'] = { trial_period_days: trial_days }
  const stripe_session = await stripe.checkout.sessions.create(stripe_parameters)
  const user_id = await get_user(session.accessToken)

  await StripeSession.query().insert({
    user_id,
    stripe_session_id: stripe_session.id,
    referral_code: code?.trim()?.toLowerCase()
  })
  res.statusCode = 200
  res.json({ id: stripe_session.id });
}

const store_info = {
  payment_method_types: ['card'],
  line_items: [
    {
      price: process.env.STRIPE_PRODUCT_KEY,
      quantity: 1
    }
  ],
  mode: 'subscription',
  success_url: process.env.NEXTAUTH_URL + '/authenticated/upgrade_success',
  //todo
  cancel_url: process.env.NEXTAUTH_URL + '/authenticated/upgrade_failure',
}

class StripeSession extends Model {
  static get tableName() {
    return 'tiktok_next.stripe_session';
  }
}

async function get_user(access_token) {
  const r = await pg.raw(`
          select user_id
          from sessions 
          where sessions.access_token = (?)
          limit 1
      `, [access_token,])
  return r.rows[0]['user_id']
}