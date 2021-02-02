import { makeStyles } from '@material-ui/core/styles';
import { providers, signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import GridItem from "components/dashboard/Grid/GridItem.js";
import GridContainer from "components/dashboard/Grid/GridContainer.js";
import { TextField, Checkbox } from '@material-ui/core';
import { Typography, Popover, Button, FormControlLabel, Link } from '@material-ui/core'
import adminCheck from 'components/adminCheck'
import Error from 'components/error'
import { getSession } from 'next-auth/client'
// import {numberFormatter} from 'components/benTable'
import BenTable from 'components/benTable'
const useStyles = makeStyles(theme => ({
    typography: {
        padding: theme.spacing(2),
    },
}));
var pg = require('knex')({
    client: 'pg',
    connection: process.env.DB_URL,
    searchPath: ['knex', 'public', 'tiktok', 'tiktok_authentication'],
    pool: {min: 0, idleTimeoutMillis: 1000}
});

function Admin({ error, ad }) {
    if (error) { return <Error message="You are not authorized to see this page." /> }
    const classes = useStyles();
    const router = useRouter()
    const [state, setState] = React.useState({ email: 'benjamin.tyler.west@gmail.com', success: false, failure: false })
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!state.checked) {
            setState({ ...state, tos: true })
            setTimeout(() => setState({ ...state, tos: false }), 2000)
            return
        }
        const res = await fetch('/api/user/validate_user?token=' + state.token + '&tos=true')
        if (res.ok) {
            router.push('/')
        } else {
            setState({ ...state, open: true })
            setTimeout(() => setState({ ...state, open: false }), 2000)
        }
    }
    const buttonReference = React.useRef();

    return (
        <>
        <GridContainer justify='center'>
            <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <TextField label="Email" defaultValue={state.email} onChange={e => setState({ ...state, email: e.target.value })} />
                <Button variant="contained" color="primary" ref={buttonReference}>Delete Videos</Button>
                    <Button variant="contained" color="primary" onClick={deleteUser(state, setState)} ref={buttonReference}>Delete User</Button>
                    <Popover open={state.success} anchorEl={buttonReference.current} anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
                        transformOrigin={{ vertical: 'top', horizontal: 'center', }}>
                        <Typography className={classes.typography}>Success.</Typography>
                    </Popover>
                    <Popover open={state.failure} anchorEl={buttonReference.current} anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
                        transformOrigin={{ vertical: 'top', horizontal: 'center', }}>
                        <Typography className={classes.typography}>Failed.</Typography>
                    </Popover>
            </form>
            
        </GridContainer>
        <BenTable data={ad} keyField="Summary Type" formatFunction={BenTable.numberFormatter}/>
        </>
    )
}

export async function getServerSideProps({ req }) {
    const session = await getSession({ req })
    if (!session?.admin) { return { props: { error: true } } }
    const ad = await getAdminData()
    return { props: { error: false, ad } }
}

const deleteUser = (state, setState) => async (e) => {
    const res = await fetch('/api/admin/clear_ben?email=' + state.email)
    if (res.ok) {
        setState({ ...state, success: true })
        setTimeout(() => setState({ ...state, success: false }), 2000)
    } else {
        setState({ ...state, failure: true })
        setTimeout(() => setState({ ...state, failure: false }), 2000)
    }
}

const getAdminData = async () => {
    const ad = await pg.raw(`
        SELECT 'cookies' "Summary Type", count(1)::text, '' "Extra" FROM tiktok_authentication.cookies
        union
        SELECT 'users' "Summary Type", count(1)::text, '' FROM tiktok_authentication.users
        union
        SELECT 'stats_users' "Summary Type", count(1)::text, '' FROM tiktok.stats_users
        union
        SELECT 'user_videos ' "Summary Type", count(1)::text, '' FROM tiktok.user_videos
        union
        SELECT 'tag_data' "Summary Type", count(1)::text, '' FROM tiktok.tag_data
        union
        SELECT 'insights' "Summary Type", count(1)::text, '' FROM tiktok_next.insights
        union
        SELECT 'auth_events' "Summary Type", count(1)::text, '' FROM tiktok_next.authentication_events
        union
        SELECT 'pro users' "Summary Type", count(author)::text, array_to_string(array_agg(author), ', ') 
        FROM tiktok_next.pro_authors
        union
        SELECT 'pro users w/o videos from today' "Summary Type", count(1)::text, array_to_string(array_agg(author), ', ') 
        FROM (
            select distinct author
            from tiktok_next.pro_authors
            where author not in (
                select distinct author
                from tiktok.user_videos
                where user_videos.fetchedat::date = (now())::date
            )            
        ) t
        union
        SELECT 'insights from today' "Summary Type", count(iauth) || '/' || count(author), array_to_string(array_agg(author), ', ') 
        FROM (
            select distinct author, q.author iauth
            from tiktok_authentication.cookies      
            left join (
                select distinct author
                from tiktok_next.insights
                where created_at::date = (now())::date
            ) q using (author)
            inner join tiktok_next.pro_authors using (author) 
            where author not in ('lilweehag', 'undefined')
        ) t
        union
        SELECT 'pro users w cookies w/o insights from today' "Summary Type", count(author)::text, array_to_string(array_agg(author), ', ') 
        FROM (
            select distinct author
            from tiktok_authentication.cookies    
            inner join tiktok_next.pro_authors using (author) 
            where author not in ('lilweehag', 'undefined')
            and author not in (
                select distinct author
                from tiktok_next.insights
                where created_at::date = (now())::date
            )
        ) t
    `).then(r => r.rows)
    return ad
}

export default Admin;