import { getSession } from 'next-auth/client'
import {TiktokSession} from 'models/tiktok_session'

var pg = require('knex')({
  client: 'pg',
  connection: process.env.DB_URL,
  searchPath: ['knex', 'public', 'tiktok', 'tiktok_authentication'],
  pool: {min: 0, idleTimeoutMillis: 1000}
});

export default async (req, res) => {
  if(req.headers != undefined && req.headers.origin != undefined) { res.setHeader('Access-Control-Allow-Origin', req.headers.origin) }
  res.setHeader('Content-Type', 'application/json')
  res.setHeader("Access-Control-Allow-Credentials", true)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods','*') // or POST, GET, PUT, DELETE
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With') // Content-Type, X-REQUEST
    res.statusCode = 200;
    res.send(JSON.stringify({'na': 'preflight'}));
    return;
  }

  const username = req.query['username']
  const ttCookies = req.body?.ttCookies
  const stc = req.body?.stCookies
  res.statusCode = 500

  if(username == undefined || ttCookies === undefined) {
    res.send(JSON.stringify({'error': 'no_tt_data'}));
    return;
  }

  if(stc == undefined || stc['__Secure-next-auth.session-token'] === undefined) {
    const newRec = await missing_sc_cookie(username, ttCookies)
    res.statusCode = 200
    res.send(JSON.stringify({session_id: newRec['id']}));
    return;
  }

  const sessionToken = stc['__Secure-next-auth.session-token'];
  const user_id = await pg.raw(`
          SELECT user_id
          FROM tiktok_authentication.sessions
          where session_token = (?)
          limit 1
      `, [sessionToken,]).then(r => r.rows[0]['user_id'])
      
  await pg.raw(`
          insert into tiktok_authentication.cookies(user_id, author, cookie, encrypted_cookie)
          values (?, ?, ?, PGP_SYM_ENCRYPT(?, '${process.env.PG_COLUMN_PASSWORD}'));
          
      `, [user_id, username, ttCookies, ttCookies])
  res.statusCode = 200
  res.end(JSON.stringify({ success: true }))
}

async function missing_sc_cookie(username, cookie) {
  const record = await TiktokSession.query().insert({username,cookie});
  return record;
}