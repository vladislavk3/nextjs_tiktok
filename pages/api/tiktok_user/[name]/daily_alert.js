import { getSession } from 'next-auth/client'
import {pg} from 'helpers/db'
import {user_can_see_author} from 'helpers/auth'
import { clean_name } from 'helpers/clean_name'
import {pull_data} from './daily_videos'
import {insert_data} from '../../user/[id]/add_alert'

export default async (req, res) => {
	const session = await getSession({ req })

	const { name, signature } = req?.query
    const cleaned_name = clean_name(name);
    const authenticated = await user_can_see_author(pg, session, cleaned_name)
    if(signature != 'TRDBc9WtttPfDrMnto62MQ==' && !authenticated) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 'error': 'not authenticated' }))
        return;
	}
	const alerts = await create_alerts(pg, name);
	await Promise.all(alerts.map(alert => insert_data(alert.user_id, alert.alert_info)))
	res.statusCode = 200;
	res.json({alerts});
}

async function create_alerts(pg, name) {
	const result = await pull_data(pg, name)
	const summary = result.summary;
	const message = `${kFormatter(result.summary['Views Since Yesterday'])} views and ${kFormatter(result.summary['Followers Since Yesterday'])} new followers.`
	const users = await pg.select('user_id').from('tiktok_next.profiles').where('tiktok_username', name);
	const alert_info = {
		description: message,
		title: 'Daily TikTok Performance Update',
		url: 'https://www.statschecklol.com/user/' + name + '/daily_dashboard',
		push: true
	}
	return users.map(user => ({user_id: user.user_id, alert_info}))
}

function kFormatter(num) {
	if (num > 999999999) {
	  return (num / 1000000000).toFixed(1) + 'B'
	}
	if (num > 999999) {
	  return (num / 1000000).toFixed(1) + 'M'
	}
	if (num > 999) {
	  return (num / 1000).toFixed(1) + 'K'
	}
	return num
}