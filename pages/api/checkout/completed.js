const stripe = require('stripe')(process.env.STRIPE_KEY);
const endpointSecret = 'whsec_BBqQOXegTYJEWkoKjMAyNwTMtd2HtH7P';
import { AccountApproved } from '../../../models/account_approved'
const { Model } = require('objection');
var pg = require('knex')({
  client: 'pg',
  connection: process.env.DB_URL,
  searchPath: ['knex', 'public', 'tiktok', 'tiktok_authentication'],
  pool: { min: 0, idleTimeoutMillis: 1000 }
});
Model.knex(pg);
/*
req.json
{
  id: 'evt_1HYI5GCr5qaiBj0xAbAshRfL',
  object: 'event',
  api_version: '2020-08-27',
  created: 1601759759,
  data: {
    object: {
      id: 'cus_I8ZDU26ygPTNFe',
      object: 'customer',
      address: null,
      balance: 0,
      created: 1601759759,
      currency: null,
      default_source: null,
      delinquent: false,
      description: null,
      discount: null,
      email: 'xodarap00@gmail.com',
      invoice_prefix: '2818B77B',
      invoice_settings: [Object],
      livemode: false,
      metadata: {},
      name: null,
      next_invoice_sequence: 1,
      phone: null,
      preferred_locales: [],
      shipping: null,
      tax_exempt: 'none'
    }
  },
  livemode: false,
  pending_webhooks: 1,
  request: { id: 'req_77U0IWAWz9E9qK', idempotency_key: null },
  type: 'customer.created'
}
*/
/*
req.json
{
  id: 'evt_1HYI5HCr5qaiBj0xUb8CXB11',
  object: 'event',
  api_version: '2020-08-27',
  created: 1601759763,
  data: {
    object: {
      id: 'cs_test_PrylVCijMSFABHQmgssGjGWUTUkv7DIq8bvUfonegTpIBcXg4FxzuYlo',
      object: 'checkout.session',
      allow_promotion_codes: null,
      amount_subtotal: 2000,
      amount_total: 2000,
      billing_address_collection: null,
      cancel_url: 'https://example.com/cancel',
      client_reference_id: null,
      currency: 'usd',
      customer: 'cus_I8ZDU26ygPTNFe',
      customer_email: null,
      livemode: false,
      locale: null,
      metadata: {},
      mode: 'payment',
      payment_intent: 'pi_1HYI4QCr5qaiBj0xSwMTSCv1',
      payment_method_types: [Array],
      payment_status: 'paid',
      setup_intent: null,
      shipping: null,
      shipping_address_collection: null,
      submit_type: null,
      subscription: null,
      success_url: 'https://example.com/success',
      total_details: [Object]
    }
  },
  livemode: false,
  pending_webhooks: 1,
  request: { id: null, idempotency_key: null },
  type: 'checkout.session.completed'
}

Update (I.e. will be canceled in the future):
{
  id: 'evt_1HsYcNCr5qaiBj0xDMxvQopa',
  object: 'event',
  api_version: '2020-08-27',
  created: 1606589878,
  data: {
    object: {
      id: 'sub_IBzDhIllSXSkyK',
      object: 'subscription',
      application_fee_percent: null,
      billing_cycle_anchor: 1602548363,
      billing_thresholds: null,
      cancel_at: 1607818763,
      cancel_at_period_end: true,
      canceled_at: 1606589878,
      collection_method: 'charge_automatically',
      created: 1602548363,
      current_period_end: 1607818763,
      current_period_start: 1605226763,
      customer: 'cus_IBzDIwBuz8PuCg',
      days_until_due: null,
      default_payment_method: 'pm_1HbbEoCr5qaiBj0xw3P7vRNQ',
      default_source: null,
      default_tax_rates: [],
      discount: null,
      ended_at: null,
      items: [Object],
      latest_invoice: 'in_1Hmq2tCr5qaiBj0xszZAR1OO',
      livemode: false,
      metadata: {},
      next_pending_invoice_item_invoice: null,
      pause_collection: null,
      pending_invoice_item_interval: null,
      pending_setup_intent: null,
      pending_update: null,
      plan: [Object],
      quantity: 1,
      schedule: null,
      start_date: 1602548363,
      status: 'active',
      transfer_data: null,
      trial_end: null,
      trial_start: null
    },
    previous_attributes: { cancel_at: null, cancel_at_period_end: false, canceled_at: null }
  },
  livemode: false,
  pending_webhooks: 1,
  request: { id: 'req_nTZMn4GfXvKm6e', idempotency_key: null },
  type: 'customer.subscription.updated'
}

deleted: i.e. cancel now

{
  id: 'evt_1HsYX8Cr5qaiBj0xy2lOv106',
  object: 'event',
  api_version: '2020-08-27',
  created: 1606589554,
  data: {
    object: {
      id: 'sub_IBzKTQbucWFoAR',
      object: 'subscription',
      application_fee_percent: null,
      billing_cycle_anchor: 1602548798,
      billing_thresholds: null,
      cancel_at: null,
      cancel_at_period_end: false,
      canceled_at: 1606589554,
      collection_method: 'charge_automatically',
      created: 1602548798,
      current_period_end: 1607819198,
      current_period_start: 1605227198,
      customer: 'cus_IBzKYS16UT8glK',
      days_until_due: null,
      default_payment_method: 'pm_1HbbLeCr5qaiBj0x8Ht2Sb4c',
      default_source: null,
      default_tax_rates: [],
      discount: null,
      ended_at: 1606589554,
      items: [Object],
      latest_invoice: 'in_1Hmq7rCr5qaiBj0xPgsH8Ikw',
      livemode: false,
      metadata: {},
      next_pending_invoice_item_invoice: null,
      pause_collection: null,
      pending_invoice_item_interval: null,
      pending_setup_intent: null,
      pending_update: null,
      plan: [Object],
      quantity: 1,
      schedule: null,
      start_date: 1602548798,
      status: 'canceled',
      transfer_data: null,
      trial_end: null,
      trial_start: null
    }
  },
  livemode: false,
  pending_webhooks: 1,
  request: { id: 'req_1JUFIf0aBMKnXA', idempotency_key: null },
  type: 'customer.subscription.deleted'
}
*/
export default async (request, response) => {
  const payload = request.body
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    // todo
    //event = stripe.webhooks.constructEvent(JSON.stringify(buf, null, 2), sig, endpointSecret);
  } catch (err) {
    return response.status(400).send(`Webhook Error (probably auth): ${err.message}`);
  }
  event = payload;
  console.log(event)
  switch (event.type) {
    case 'checkout.session.completed': {
      await session_completed(event)
      break;
    }
    case 'customer.subscription.updated': {
      await save_event(event);
      break;
    }
    case 'customer.subscription.deleted': {
      await save_event(event);
      break;
    }
  }

  response.statusCode = 200
  response.json({});
}

class StripeSubscription extends Model {
  static get tableName() {
    return 'tiktok_next.stripe_subscription';
  }
}

async function session_completed(event) {
  const session = event.data.object;
  const subscription_id = session.subscription;
  const stripe_email = session.customer_email;
  const stripe_customer_id = session.customer;
  const stripe_response = JSON.stringify(event.data.object)
  const stripe_session_id = session.id;

  // Create a new subscription and mark it as paid this month.
  await StripeSubscription.query().insert({
    subscription_id,
    stripe_email,
    stripe_customer_id,
    stripe_response,
    stripe_session_id
  })

  const user_id = await pg.raw(`Update tiktok_authentication.users
  set pro = true
  FROM tiktok_next.stripe_session
  where users.id = stripe_session.user_id
  and stripe_session.stripe_session_id = ?
  returning users.id`, [stripe_session_id]).then(r => r.rows[0]['id'])
  await AccountApproved.query().where('user_id', user_id).select('user_id').then(async r => {
    if (r?.length > 0) { return; } // acount already approved
    await AccountApproved.query().insert({ user_id, token: 'stripe_payment' })
  })
  return user_id
}

async function save_event(event) {
  const stripe_data = event.data.object;
  await pg('tiktok_next.stripe_events').insert({
    customer_id: stripe_data.customer,
    stripe_data,
    status: stripe_data.status,
    event_type: event.type,
    cancel_at: pg.raw('to_timestamp(?)', [stripe_data.cancel_at])
  })
}

export { session_completed }