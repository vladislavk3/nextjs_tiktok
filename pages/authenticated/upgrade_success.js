import GridContainer from "components/dashboard/Grid/GridContainer.js";
import GridItem from "components/dashboard/Grid/GridItem.js";
import { getSession, useSession } from 'next-auth/client'
import { useState, useEffect } from "react";

export default function UpgradeSuccess({ name }) {

    useEffect(() => {
        async function doFetch() {            
            if (name) {
                // trigger so daily dashboard has data
                const x = await fetch('/api/tiktok_user/' + name + '/videos?count=100&pro=true')
            }
        }
        doFetch();
    }, [])

    return (
        <div>
            <GridContainer justify='center'>
                <GridItem xs={12} sm={12} lg={6}>
                    <h1>Thanks for upgrading {name}!</h1>
                </GridItem>
            </GridContainer>

            <GridContainer justify='center'>
                <GridItem xs={12} sm={12} lg={6}>
                    <p>You now have access to a daily dashboard (automatically refreshed at midnight Pacific Time).</p>
                </GridItem>
            </GridContainer>
        </div>
    )
}

export async function getServerSideProps({ params, req, res }) {
    const session = await getSession({ req })
    if (!session) { return { props: {}, } }
    const user = await get_user(session)
    if (!user || user.length == 0 || !user[0]) { return { props: {}, } }
    
    const name = user[0].tiktok_username
    return { props: { name }, }
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
