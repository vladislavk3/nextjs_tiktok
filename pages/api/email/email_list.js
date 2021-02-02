import {pg} from 'helpers/db'
import { getSession } from 'next-auth/client'

const query = `
select tiktok_next.clean_name(profiles.tiktok_username) username, profiles.email
FROM tiktok_authentication.users 
inner join tiktok_next.profiles on users.id = profiles.user_id
where users.pro
and receive_emails
and profiles.tiktok_username is not null
and profiles.email is not null
`

export default async (req, res) => {
    const session = await getSession({ req })
	const { signature } = req?.query
    if(!session && signature != 'TRDBc9WtttPfDrMnto62MQ==') {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 'error': 'no TikTok cookie found' }))
        return;
    }
    
    const result = await pg.raw(query).then(r => r.rows)
    res.statusCode = 200
	res.json(result);
}