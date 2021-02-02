import handler from 'pages/api/user/tiktok-authenticate'
import { createMocks } from 'node-mocks-http';
import {TiktokSession} from 'models/tiktok_session'
import {pg} from 'helpers/db'
import {Cookie} from 'models/cookie'
const { raw } = require('objection');

describe('Integrations tests for TikTok authentication endpoint', () => {
    beforeAll(async () => {
        await pg.raw(`
            insert into tiktok_authentication.sessions(user_id, access_token, expires, session_token) values (1, 'access_token', now(), 'session_token');
        `)
    });
    afterAll(async () => {
        await pg.raw(`
        delete from tiktok_authentication.sessions;
        delete from tiktok_authentication.cookies;
    `)
    });

    test('Should return 500 if no cookies', async () => {
    const {req, res }= createMocks({
        method: 'GET',
        query: { username: 'ben' }})
    await handler(req,res)
    expect(res._getStatusCode()).toBe(500)
    expect(JSON.parse(res._getData())).toMatchObject({'error': 'no_tt_data'})
  })

  test('Should return 500 if missing TikTok cookies', async () => {
    const {req, res }= createMocks({
        method: 'GET',
        query: { username: 'ben'},
        body: { stCookies: 'ttc' }})
    await handler(req,res)
    expect(res._getStatusCode()).toBe(500)
    expect(JSON.parse(res._getData())).toMatchObject({'error': 'no_tt_data'})
  })

  test('Should create session if missing SCL cookies', async () => { 
    const {req, res }= createMocks({
        method: 'GET',
        query: { username: 'ben'},
        body: { ttCookies: 'ttc' }})
    await handler(req,res)
    expect(res._getStatusCode()).toBe(200)
    const session_id = JSON.parse(res._getData())['session_id']
    expect(session_id).toBeDefined()
    const session_info = await TiktokSession.query().findById(session_id)
    expect(session_info.username).toEqual("ben")
    expect(session_info.cookie).toEqual('ttc')
  })

  test('Should insert encrypted values', async () => { 
    const {req, res }= createMocks({
        method: 'GET',
        query: { username: 'ben'},
        body: { 
            ttCookies: 'abc',
            stCookies: {'__Secure-next-auth.session-token': 'session_token'} }})
    await handler(req,res)
    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())['session_id']).toBeUndefined()
    const cookie = (await Cookie.query().where('user_id', 1)
        .select('*', 
        raw(`PGP_SYM_DECRYPT(encrypted_cookie::bytea, '${process.env.PG_COLUMN_PASSWORD}') as decrypted_cookie`)))[0]
    expect(cookie.author).toEqual("ben")
    expect(cookie.cookie).toEqual("abc")
    expect(cookie.decrypted_cookie).toEqual("abc")
    expect(JSON.parse(res._getData())['success']).toBe(true) 
  })
})
