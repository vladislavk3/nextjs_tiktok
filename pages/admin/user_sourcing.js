import Error from 'components/error'
import { getSession } from 'next-auth/client'
import BenTable from 'components/benTable'
import {pg} from '../../helpers/db'

function Admin({ error, ad }) {
    if (error) { return <Error message="You are not authorized to see this page." /> }

    return (
        <>
        <BenTable data={ad} keyField="email" />
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
    SELECT profiles.email, count(1) total, sum(case when users.pro then 1 else 0 end) pro, array_to_string(
        array_agg(case when users.pro then users.email else null end), ',')
    FROM tiktok_authentication.users
    inner join tiktok_next.account_approved a on a.user_id = users.id
    inner join tiktok_next.profiles on token = invite_code
    group by profiles.email
    order by (3) desc, (2) desc
    `).then(r => r.rows)
    return ad
}

export default Admin;