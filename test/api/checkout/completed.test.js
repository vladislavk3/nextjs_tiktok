import { session_completed } from '../../../pages/api/checkout/completed'
import { AccountApproved } from '../../../models/account_approved'
import { User } from '../../../models/user'
var pg = require('knex')({
  client: 'pg',
  connection: process.env.DB_URL,
  searchPath: ['knex', 'public', 'tiktok', 'tiktok_authentication'],
  pool: {min: 0, idleTimeoutMillis: 1000}
});

beforeAll(async () => {
    await pg.raw(`
        insert into tiktok_authentication.users(id) values (1);
        insert into tiktok_next.stripe_session(stripe_session_id, user_id) values (3, 1);
    `)
});
afterAll(async () => {
    await pg.raw(`
    delete from tiktok_authentication.users;
    delete from tiktok_next.stripe_session;
    delete from tiktok_next.account_approved;
`)
});

describe("Home", () => {
    const event = {data: {object: {subscription: 1, customer_email: 'ben@c.com', customer: 2, id: 3}}}
    test("Marks As Pro", () => expect(run_session(event).then(v=>v['pro'])).resolves.toBeTruthy());
    test("Marks As Approved Just once", () => expect(run_session(event).then(v=>v['approved'])).resolves.toEqual(1));
});


const run_session = async (event) => {
    const user_id = await session_completed(event);
    const approved = (await AccountApproved.query().where('user_id', user_id).select('user_id')).length
    const pro = (await User.query().where('id', user_id).select('pro'))[0]['pro']
    return {approved, pro}
}