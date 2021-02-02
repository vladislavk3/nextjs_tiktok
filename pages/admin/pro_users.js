import Error from 'components/error'
import { getSession } from 'next-auth/client'
import BenTable from 'components/benTable'
import {pg} from '../../helpers/db'

function Admin({ error, ad }) {
    if (error) { return <Error message="You are not authorized to see this page." /> }
    ad.forEach(a => a["Pro Account Started"] = new Date(a["Pro Account Started"]))
    const formatFunction = (k) => {
        if(k == "Pro Account Started") return (v) => v.toLocaleDateString()
        return (v) => v
    }
    return (
        <>
            <BenTable data={ad} keyField="email" formatFunction={formatFunction}/>
        </>
    )
}

export async function getServerSideProps({ req }) {
    const session = await getSession({ req })
    if (!session?.admin) { return { props: { error: true } } }
    const ad = await getAdminData()
    return { props: { error: false, ad } }
}

const getAdminData = async () => {
    const ad = await pg.raw(`
    select profiles.name, profiles.email, videos, insights
    , case when insights is not null then null
        when cookies.cookie is null then null
        else true
        end concerning
    , to_char(s.created_at, 'YYYY-MM-DD') "Pro Account Started", profiles.tiktok_username
    , to_char(last_login, 'YYYY-MM-DD') last_login
    FROM tiktok_authentication.users 
    inner join tiktok_next.profiles on users.id = profiles.user_id
    
    left join (
        select author, count(1) videos
        from tiktok.user_videos
        where user_videos.fetchedat::date = (now())::date
        group by author
    ) v on v.author = lower(tiktok_next.clean_name(profiles.tiktok_username))
    
    left join (
        select author, count(1) insights
        from tiktok_next.insights
        where created_at::date = (now())::date
        group by author
    ) i on i.author = lower(tiktok_next.clean_name(profiles.tiktok_username))

    left join 
    (
        select user_id, s.created_at
        from tiktok_next.stripe_subscription s
        inner join tiktok_next.stripe_session using (stripe_session_id)
    ) s on s.user_id = users.id

    left join 
    (
        select * 
        from tiktok_authentication.cookies 
        inner join (
            select author, max(created_at) created_at
            from tiktok_authentication.cookies 
            group by author
        ) q using (author, created_at)
    ) cookies on cookies.author = lower(tiktok_next.clean_name(profiles.tiktok_username))

    left join 
    (
        select user_id, Max(created_at) last_login
        from tiktok_next.authentication_events
		group by user_id
    ) authentication_events on authentication_events.user_id = users.id

    where users.pro
    order by s.created_at desc nulls last
    `).then(r => r.rows)
    return ad
}

export default Admin;