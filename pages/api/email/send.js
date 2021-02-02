import { getSession } from 'next-auth/client'
import { pg } from 'helpers/db'
import { clean_name } from 'helpers/clean_name'
import { generate_summary } from 'components/insights/weekly_summary'
import { get_insights_history } from 'pages/api/tiktok_user/[name]/insights_history'
import { get_video_history } from 'pages/api/tiktok_user/[name]/video_history'
import { getFollowers } from 'pages/api/tiktok_user/[name]/follower_info'
const mailgun = require("mailgun-js");
const DOMAIN = '';
const mg = mailgun({apiKey: process.env.MAILGUN, domain: DOMAIN});

export default async (req, res) => {
  const session = await getSession({ req })

  const { username, email, signature } = req?.query

  if (!session && signature != 'TRDBc9WtttPfDrMnto62MQ==') {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 'error': 'no TikTok cookie found' }))
    return;
  }
  const cleaned = clean_name(username)
  const variables = await generate_variables(cleaned);

  const data = {
      from: 'Ben <noreply@.com>',
      to: email,
      subject: '@' + cleaned + '\'s TikTok week in review ',
      template: 'react',
      'h:X-Mailgun-Variables': JSON.stringify({
        'new_followers': variables.totalNewFollowers || '[unknown - insights not installed]',
        'total_views': variables.totalViews == 0 ? '[unknown - insights not installed]' : variables.totalViews,
        'tiktok_username': '@' + cleaned,
        'most_popular_video_id': variables.bestVideo.video_id,
        'most_popular_video_caption': variables.bestVideo.description,
        'most_popular_video_views': parseInt(variables.bestVideo.views)?.toLocaleString(undefined, { maximumFractionDigits: 0 }),
        'most_followers_video_id': variables.bestFollowerVideo.video_id,
        'most_followers_video_caption': variables.bestFollowerVideo.Caption,
        'most_followers_video_followers': variables.bestFollowerVideo['Estimated New Followers Generated'],
        'mostShares': makeNumbersPretty(variables.mostShares),
        'mostLikes': makeNumbersPretty(variables.mostLikes),
        'mostComments': makeNumbersPretty(variables.mostComments),
        'mostViews': makeNumbersPretty(variables.mostViews),
        'not_pro': !variables.bestFollowerVideo?.video_id
      })
  };
  await mg.messages().send(data, function (error, body) {
    res.statusCode = 200
    res.json({error, body, data});
  });  
}

const makeNumbersPretty = (array) => {
  return array.map(r=> ({
    ...r,
    'likes': parseInt(r['likes']).toLocaleString(undefined, { maximumFractionDigits: 0 }),
    'shares': parseInt(r['shares']).toLocaleString(undefined, { maximumFractionDigits: 0 }),
    'comments': parseInt(r['comments']).toLocaleString(undefined, { maximumFractionDigits: 0 }),
    'views': parseInt(r['views']).toLocaleString(undefined, { maximumFractionDigits: 0 }),
  }))
}

async function generate_variables(name) {
  const history = await get_insights_history(name, true)
  const videos = await get_video_history(name)
  const followers = await getFollowers(pg, name, Math.round((Date.now() - 604800000) / 1000))
  const info = {
      name,
      history,
      videos,
      followers
  }
  const summary = generate_summary(info)
  return summary;
}