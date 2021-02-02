const TikTokScraper = require('tiktok-scraper');
import { getSession } from 'next-auth/client'
import { pg } from 'helpers/db'
import { clean_name } from 'helpers/clean_name'

export default async (req, res) => {
  const session = await getSession({ req })

  const { name, signature, fetchOnly, fetchType, verifyFp } = req?.query

  if (!session && signature != 'TRDBc9WtttPfDrMnto62MQ==') {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 'error': 'no TikTok cookie found' }))
    return;
  }

  let result;
  const name_cleaned = clean_name(name)

  const verifies = JSON.parse(process.env.VERIFY_FP)
  const verify = verifies[Math.floor(Math.random() * verifies.length)];
  const hashtag_info = await TikTokScraper.getHashtagInfo(name_cleaned, { verifyFp: verifyFp || verify })

  if (!fetchOnly && (!fetchType || fetchType == 'get_or_save_tag')) { result = await insert_tag(hashtag_info) }
  if ((!fetchType || fetchType == 'store_top_videos')) {
    const videos = await TikTokScraper.hashtag(hashtag_info.challenge.id, { number: 100, verifyFp: verifyFp || verify })
    result = !fetchOnly && await insert_videos(videos)
  }
  result = result || true;
  res.statusCode = 200
  res.json(result);
}

async function insert_videos(results) {
  const parsed = results.collector.flatMap(r =>
    r?.hashtags?.map(tag => ({
      tag_name: tag.name,
      fetch_time: pg.raw('now()'),
      video_id: r.id
    }))
  );

  if (!parsed || parsed.length == 0) {
    console.error('no results', results);
    return;
  }

  await pg.raw(`
    ? ON CONFLICT (video_id, tag_name)
    DO NOTHING
    returning tag_name`, [pg('tiktok.video_tag').insert(parsed)])

  const new_tags = await pg.raw(`
      select name from (${parsed.reduce(a => ` ${a} (?),`, 'VALUES').slice(0, -1)}) s(name)
      where name not in (
        select name 
        from tiktok.tag_data 
      ) 
    `, parsed.map(t => t['tag_name']))

  return new_tags.rows?.map(t => t['name'])
}

async function insert_tag(r) {
  const parsed = {
    fetch_time: pg.raw(`now()`),
    name: r.challenge.title,
    video_count: r.stats.videoCount,
    view_count: r.stats.viewCount,
    challenge_id: r.challenge.id
  }

  return (await pg.raw('? returning *', [pg('tiktok.tag_data').insert(parsed)])).rows
}