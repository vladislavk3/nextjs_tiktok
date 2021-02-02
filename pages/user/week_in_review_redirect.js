import Loader from 'components/loader'
import Error from 'components/error'
import {Link} from '@material-ui/core'
import { getSession } from 'next-auth/client'

export default function User( { error }) {  
    if(!error) { return <Loader />}

    if(error == 'not_logged_in') { return <Error message="Please log in before accessing this feature."/> }
    if(error == 'no_username') { 
        const message = <span>Please associate a TikTok username with this account <Link href="/authenticated/profile">in your profile</Link> before using this feature.</span>
        return <Error message={message}/> 
    }

    return <Loader />
}

export async function getServerSideProps({ params , req, res}) {
    const session = await getSession({ req })
    const authed = await auth(session, res);
    if(authed.error) { console.log('here'); return { props: { error: authed.error }}}
    
    return { props: { }, }
}

async function auth (session, res) {
    if(!session) { return { error: 'not_logged_in'}; }
    const u = await get_user(session)
    if(u.length == 0 || !u[0]['tiktok_username']) { return { error: 'no_username'} }
    redirect(res, u[0]['tiktok_username'])
    return true;
  };

function redirect(res, tiktok_username) {
    if (res) {
      res.writeHead(302, {
        Location: '/user/' + tiktok_username.toLowerCase() + '/week_in_review'
      });
      res.end();
    }  
}

async function get_user(session) {
    var pg = require('knex')({
        client: 'pg',
        connection: process.env.DB_URL,
        searchPath: ['knex', 'public', 'tiktok', 'tiktok_authentication'],
        pool: {min: 0, idleTimeoutMillis: 1000}
    });

    const res = await pg.raw(`
        select tiktok_username
        from  tiktok_next.profiles
        where user_id = (?)`, [session.user_id]).then(r => r.rows)
    return res
}