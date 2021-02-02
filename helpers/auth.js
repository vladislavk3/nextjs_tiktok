
import { clean_name } from 'helpers/clean_name'
import { getSession } from 'next-auth/client'
import {pg} from 'helpers/db'

export default async function auth (session, n, res) {
    const unathOk = n == '/' || n.match(/^\/((api)|(authentication)).*/)
    if(unathOk) { return true; }
    if(!session) { redirect(res); return false; }
    const v = await validUser(session)
    if(!v) { redirect(res); return false; }
    return true;
  };

function redirect(res) {
    if (res) {
      res.writeHead(302, {
        Location: '/authentication/new_user'
      });
      res.end();
    }  
    return false;
}

async function validUser(session) {
    const res = await pg.raw(`
        select user_id
        from  tiktok_authentication.sessions 
        inner join tiktok_next.account_approved using (user_id)
        where access_token = (?)`, [session.accessToken]).then(r => r.rows)
    return res.length > 0
}

async function get_cookie(pg, access_token) {
  const r = await pg.raw(`
          select pgp_sym_decrypt(encrypted_cookie::bytea, '${process.env.PG_COLUMN_PASSWORD}') as cookie, author
          from tiktok_authentication.cookies
          inner join sessions using (user_id)
          where sessions.access_token = (?)
          order by cookies.created_at desc
          limit 1
      `, [access_token,]).then(r => r.rows[0]) || {}
  return r
}

// note: assumes authenticationn has been performed
async function get_author_cookie(pg, author) {
  const r = await pg.raw(`
          select pgp_sym_decrypt(encrypted_cookie::bytea, '${process.env.PG_COLUMN_PASSWORD}') as cookie, author
          from tiktok_authentication.cookies
          where author = ?
          and encrypted_cookie is not null
          order by cookies.created_at desc
          limit 1
      `, [author,]).then(r => r.rows[0]) || {}
      
  return r
}

async function named_ssp({params, req, res}) {
  const session = await getSession({ req })
  if(!session) return redirect(res);
  const name = params['name']
  if(!(await user_can_see_author(pg, session, name))) return redirect(res);
  return true;
}

async function user_can_see_author(pg, session, requested_author, verbose) {
  const result = await user_can_see_author_verbose(pg, session, requested_author)
  if(! verbose) return result.valid ;
  return result
}
async function user_can_see_author_verbose(pg, session, requested_author){
  if(!session?.accessToken) { return {valid: false, reason: 'not_logged_in'} }
  if(session.admin) return {valid: true};

  const {author} = await get_cookie(pg, session.accessToken)
  if(clean_name(requested_author) == clean_name(author)) { return {valid: true} }

  if(! author){
    return {valid: false, reason: 'no_cookies'}
  }
  return {valid: false, reason: 'wrong_user'}
}

async function isCurrentUser(id, session) {
  const res = await pg.raw(`
      select user_id
      from  tiktok_authentication.sessions 
      where access_token = (?)`, [session.accessToken]).then(r => r.rows[0])
  return (parseInt(res['user_id']) == parseInt(id))
}

export async function insightsAuthentication( pg, context, callBack = async () => ({}) ) {
  const { req, params, res } = context;
  const session = await getSession({ req })
  if(!session) return redirect(res);
  if(!session.pro) return {props: {authenticated: {valid: false, reason: 'pro'}}}
  const name = clean_name(params['name']);
  const authenticated = await user_can_see_author(pg, session, name, true)
  const additional = authenticated.valid ? await callBack(pg, context) : {}
  return {props: {name, authenticated, ...additional.props}}
}


export {get_cookie, auth, named_ssp, get_author_cookie, user_can_see_author, isCurrentUser};