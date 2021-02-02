import { get_cookie, user_can_see_author } from '../../helpers/auth'
var pg = require('knex')({
  client: 'pg',
  connection: process.env.DB_URL,
  searchPath: ['knex', 'public', 'tiktok', 'tiktok_authentication'],
  pool: {min: 0, idleTimeoutMillis: 1000}
});

beforeAll(async () => {
    await pg.raw(`
        insert into tiktok_authentication.sessions(user_id, access_token, expires, session_token) values (1, 'access_token', now(), 'st');
        insert into tiktok_authentication.cookies(user_id, cookie, encrypted_cookie, author, created_at) values (1, 'a', PGP_SYM_ENCRYPT('old_cookie', '${process.env.PG_COLUMN_PASSWORD}'), 'Ben', '2020-01-01'),  
            (1, 'b', PGP_SYM_ENCRYPT('cookie', '${process.env.PG_COLUMN_PASSWORD}'), 'Ben', '2020-01-02');
    `)
});
afterAll(async () => {
    await pg.raw(`
    delete from tiktok_authentication.sessions;
    delete from tiktok_authentication.cookies;
`)
});

describe("auth.js", () => {
  test("gets the most recent cookie", () => expect(get_cookie(pg, 'access_token').then(v=>v['cookie'])).resolves.toEqual('cookie'));
  });

describe("user can see author", () => {
  const session = {accessToken: 'access_token', admin: false}
  const expectation = (author, result) => () => expect(user_can_see_author(pg, session, author)).resolves.toEqual(result)
  test("matching username", expectation('ben', true));
  test("Nonmatching username", expectation('fake', false));
  test("Nonmatching username– Admin", () => expect(user_can_see_author(pg, {...session, admin: true}, 'fake')).resolves.toEqual(true));
});