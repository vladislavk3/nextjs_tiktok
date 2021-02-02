const TikTokScraper = require('tiktok-scraper');
const base64 = require('base64-js')
import { getSession } from 'next-auth/client'
import { pg } from 'helpers/db'
import { clean_name } from 'helpers/clean_name'
import { user_videos } from 'helpers/tik_api'

export default async (req, res) => {
  const session = await getSession({ req })

  const { name, count, signature, fetchOnly, attempt } = req?.query

  // const authenticated = await user_can_see_author(pg, session, name) 
  if (!session && signature != 'TRDBc9WtttPfDrMnto62MQ==') {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 'error': 'no TikTok cookie found' }))
    return;
  }

  const name_cleaned = clean_name(name)
  const { videos, author_results } = await get_data(count, name_cleaned, 9999999999999, attempt)
  const { video_parsed, tags, author_parsed } = await transform({ videos, author_results })

  if (fetchOnly) {
    res.statusCode = 200
    res.json(true);
  }

  await insert_author(author_parsed);
  const { new_videos, new_tags } = await insert({ video_parsed, tags });
 
  res.statusCode = 200
  res.json({ author_results, new_videos, new_tags });
}

export async function get_data(count, name, max_time, attempt) {
  const tikApi = attempt == 2;
  if (tikApi) {
    console.log('tikapi')
    return user_videos(count, name, max_time)
  }
  // Choose a random verifyFp    
  const verifies = JSON.parse(process.env.VERIFY_FP)
  const verify = verifies[Math.floor(Math.random() * verifies.length)];
  const videos = await TikTokScraper.user(name, {
    number: count, verifyFp: verify,
    sessionList: JSON.parse(process.env.SESSION_LIST)
  })
    .catch(error => {
      console.error(error)
      console.error(`Error fetching videos for ${name}`)
      console.error(`VerifyFP: ${verify}`)
      if (attempt) {
        throw `Attempt number ${attempt} to fetch videos for ${name}`
      }
      throw error;
    })
  const author_results = await TikTokScraper.getUserProfileInfo(name, { verifyFp: process.env.VERIFY_FP }).catch(error => {
    console.error(`Error fetching User information for ${name}`)
    if (attempt) {
      throw `Attempt number ${attempt} to fetch user information for ${name}`
    }
    throw error;
  })
  return { videos, author_results }
}

export async function transform({ videos, author_results }) {
  const { video_parsed, tags } = transform_videos({ videos });
  const { author_parsed } = transform_author({ author_results });
  author_parsed.avatar_medium = await get_avatar({ author_results })
  return { video_parsed, tags, author_parsed }
}
export function transform_author({ author_results }) {
  const stats = author_results.stats
  const author_parsed = {
    fetch_time: pg.raw(`now()`),
    name: author_results.user.uniqueId,
    follower_count: stats.followerCount,
    video_count: stats.videoCount,
    like_count: stats.heartCount > 0 ? stats.heartCount : stats.heart,
    bio: author_results.user.signature
  }
  return { author_parsed }
}

async function get_avatar({ author_results }) {
  return await fetch(author_results.user.avatarThumb).then(async r => r.blob().then(t =>
    t.arrayBuffer().then(v => {
      const v2 = new Uint8Array(v)
      return base64.fromByteArray(v2)
    })
  ))
}

export function transform_videos({ videos }) {
  const video_parsed = videos.collector.filter(r => r.id && r.id != "").map(r => {
    return {
      video_id: r.id,
      description: r.text,
      create_time: pg.raw(`to_timestamp(${r.createTime})`),
      duration: r.videoMeta.duration,
      likes: r.diggCount,
      shares: r.shareCount,
      comments: r.commentCount,
      views: r.playCount == '' ? null : r.playCount,
      fetchedat: pg.raw(`now()`),
      soundid: r.musicMeta.musicId == '' ? null : r.musicMeta.musicId,
      author: r.authorMeta.name
    }
  })

  const tags = videos.collector.filter(r => r.id && r.id != "").flatMap(r => {
    return r.hashtags?.filter(tag => !!tag.name)?.map(challenge => ({
      video_id: r.id,
      challenge_id: challenge.id,
      tag_name: challenge.name
    }))
  }).filter(r => !!r);

  return { video_parsed, tags }
}

async function insert({ video_parsed, tags }) {
  const new_videos = await pg.raw('? returning *', [pg('tiktok.user_videos').insert(video_parsed)])

  if (tags.length == 0) return { new_videos };
  const new_tags = await pg.raw(`? ON CONFLICT (video_id, tag_name)
                    DO NOTHING returning *`, [pg('tiktok.video_tag').insert(tags)])
  return { new_videos, new_tags }
}

async function insert_author(author_parsed) {
  await pg('tiktok.stats_users').insert(author_parsed)
}