const headers = {
  'X-ACCOUNT-KEY': process.env.TIKAPI_USER,
  'X-API-KEY': process.env.TIKAPI_KEY
}

const fetch = require("node-fetch")

export async function user_videos(count, name, max_time = 9999999999999) {
  if (count > 50) count = 50; //TODO
  let author_results;
  try {
    author_results = await fetch('https://api.tikapi.io/public/check?username=' + name, { headers }).then(r => r.json())
    const { id, secUid } = author_results.userInfo.user;
    const videos = await fetch(`https://api.tikapi.io/user/feed?count=${count}&id=${id}&secUid=${secUid}&max_time=${max_time}`, { headers }).then(r => r.json())
    videos.collector = videos.items.map(i => ({
      ...i, videoMeta: i.video, ...i.stats,
      musicMeta: { ...i.music, musicId: i.music.id },
      authorMeta: { ...i.author, name: i.author.uniqueId },
      hashtags: i.textExtra?.map(e => ({ id: e.hashtagId == '' ? undefined : e.hashtagId, name: e.hashtagName })),
      text: i.desc
    }))
    return { videos, author_results: author_results.userInfo }
  } catch (error) {
    console.error('Failed TikApi response', author_results)
    throw error
  }
}