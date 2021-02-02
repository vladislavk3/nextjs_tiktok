import Loader from 'components/loader'
import Error from 'components/error'
import {Link, Container} from '@material-ui/core'
import { getSession, signIn } from 'next-auth/client'
import {TiktokSession} from 'models/tiktok_session'
import {Cookie} from 'models/cookie'
import { makeStyles } from '@material-ui/core/styles';
import Cookies from 'cookies'

const useStyles = makeStyles((theme) => ({
  obviousLink: {
      textDecoration: 'underline'
  }
}));

export default function User( { error }) { 
    const classes = useStyles(); 
    if(error == 'not_logged_in') { 
        return <Container  maxWidth="md">
            <h1>Please <Link href="#" onClick={signIn} className={classes.obviousLink}>login</Link> or <Link href="#" onClick={signIn} className={classes.obviousLink}>create an account</Link> to use this feature</h1>
            <p>In order for us to pull data from TikTok, you must create a Stats Check LOL account using your Google account.</p>
        </Container> 
    }
    if(error == 'no_username') { 
        const message = <span>Please associate a TikTok username with this account <Link href="/authenticated/profile">in your profile</Link> before using this feature.</span>
        return <Error message={message}/> 
    }
    return <Container  maxWidth="md">
    <h1>Thanks for authenticating your account!</h1>
    <p>You can start fetching TikTok data from the <Link href="/authenticated/insight_link">insights page</Link></p>.
</Container> 
}

export async function getServerSideProps({ params, req, res }) {
    const session_id = params['session_id']    
    const session = await getSession({ req })
    if(!session) { 
        // set a cookie so that the new user page knows to redirect back to here
        const cookies = new Cookies(req, res)
        cookies.set('tiktok_session_id', session_id, {httpOnly: false})
        return { props: {error: 'not_logged_in'}}
    }
    if(session_id == 'na') { return { props: {}}}
    const tiktok_session = await TiktokSession.query().findById(session_id);
    await Cookie.query().insert({
        user_id: session.user_id,
        author: tiktok_session.username,
        cookie: tiktok_session.cookie
    })
    return { props: {}, }
}
