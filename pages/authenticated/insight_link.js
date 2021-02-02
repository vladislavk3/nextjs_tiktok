
import GridContainer from "components/dashboard/Grid/GridContainer.js";
import GridItem from "components/dashboard/Grid/GridItem.js";
import {Link} from '@material-ui/core'
import { getSession } from 'next-auth/client'
import { get_cookie } from 'helpers/auth'
import Instructions from 'components/insights/instructions'
export default function User( { pro }) {  

    if(pro) { return <Instructions/> }
    return (
        <GridContainer justify='center'>
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSetl5O0bHH4YOyzV0it54qFuajQKj5in-avYX4mvcfZXGuwag/viewform?embedded=true" 
            width="640" height="1436" frameBorder="0" marginHeight="0" marginWidth="0">Loading…</iframe>
        </GridContainer>
    )
}

export async function getServerSideProps({ params , req, res}) {
    var pg = require('knex')({
        client: 'pg',
        connection: process.env.DB_URL,
        searchPath: ['knex', 'public', 'tiktok', 'tiktok_authentication'],
        pool: {min: 0, idleTimeoutMillis: 1000}
    });
    const session = await getSession({ req })
    if(session == undefined) {return {props: { }}}
    const { cookie, author } = await get_cookie(pg, session.accessToken)
    if(cookie == undefined) {return {props: { pro: session?.pro }}}
    res.writeHead(302, { Location: '/user/' + author + '/insights'});
    res.end();
    return { props: { }, }
}
