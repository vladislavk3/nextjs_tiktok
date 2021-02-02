import { get_data, transform_videos, transform_author } from '../../../../../../pages/api/tiktok_pull/user/[name]/videos'
import { pg } from 'helpers/db'
import { Video } from 'models/video'

const VIDEOS = {
  collector: [
    {
      author: {
        avatarLarger: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/0590ca7ca3d4778ac9d407a49ae0031c~c5_1080x1080.jpeg?x-expires=1608426000&x-signature=39j1105o%2BWpIUBbijIxHeC2lYKs%3D',
        avatarMedium: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/0590ca7ca3d4778ac9d407a49ae0031c~c5_720x720.jpeg?x-expires=1608426000&x-signature=3pSg38gktrG5HyfKQAzHq1svPYc%3D',
        avatarThumb: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/0590ca7ca3d4778ac9d407a49ae0031c~c5_100x100.jpeg?x-expires=1608426000&x-signature=r7mjY6aWh9fsAJNzlWEwOLAAKPg%3D',
        commentSetting: 0,
        duetSetting: 0,
        ftc: false,
        id: '6807910729762669574',
        nickname: 'Jordan Scott 🦋',
        openFavorite: false,
        privateAccount: false,
        relation: 0,
        secUid: 'MS4wLjABAAAAvFVEV4ThgsBdXCWQ1yLqkVlZjgxDW9NVnoArfwGDtIawAaglXu_uNlMBJSJOorMl',
        secret: false,
        signature: '#TwoPrettyBestFriends\n        MERCH LINK⤵️',
        stitchSetting: 0,
        uniqueId: 'jayrscottyy',
        verified: false
      },
      authorStats: {
        diggCount: 1732,
        followerCount: 1400000,
        followingCount: 27,
        heart: 30900000,
        heartCount: 30900000,
        videoCount: 151
      },
      createTime: 1604176444,
      desc: 'facts Tinka Butt I only see you🥺❤️',
      digged: false,
      duetEnabled: true,
      duetInfo: { duetFromId: '0' },
      forFriend: false,
      id: '6889885218962951430',
      isAd: false,
      itemCommentStatus: 0,
      itemMute: false,
      music: {
        album: '',
        authorName: 'Jordan Scott 🦋',
        coverLarge: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/0590ca7ca3d4778ac9d407a49ae0031c~c5_1080x1080.jpeg?x-expires=1608426000&x-signature=39j1105o%2BWpIUBbijIxHeC2lYKs%3D',
        coverMedium: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/0590ca7ca3d4778ac9d407a49ae0031c~c5_720x720.jpeg?x-expires=1608426000&x-signature=3pSg38gktrG5HyfKQAzHq1svPYc%3D',
        coverThumb: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/0590ca7ca3d4778ac9d407a49ae0031c~c5_100x100.jpeg?x-expires=1608426000&x-signature=r7mjY6aWh9fsAJNzlWEwOLAAKPg%3D',
        duration: 10,
        id: '6889885265632971526',
        original: true,
        playUrl: 'https://sf16-va.tiktokcdn.com/obj/musically-maliva-obj/6889885077178682117.mp3',
        title: 'original sound'
      },
      officalItem: false,
      originalItem: false,
      privateItem: false,
      secret: false,
      shareEnabled: true,
      showNotPass: false,
      stats: {
        commentCount: 13300,
        diggCount: 267000,
        playCount: 2900000,
        shareCount: 11100
      },
      stickersOnItem: [{ stickerText: [Array], stickerType: 4 }],
      stitchEnabled: true,
      video: {
        cover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/dddbaca786574b78b8529bb555ccf911?x-expires=1608361200&x-signature=vTgnDQ%2F0UEo%2FlJ3AYqM5N4Mn0Z8%3D',
        downloadAddr: 'https://v16-web.tiktok.com/video/tos/useast2a/tos-useast2a-pve-0068/36eb19549f0248a59139d8fd90959a8d/?a=1988&br=2748&bt=1374&cd=0%7C0%7C1&cr=0&cs=0&cv=1&dr=0&ds=3&er=&expire=1608361869&l=202012190110590101890660240B146B4E&lr=tiktok_m&mime_type=video_mp4&policy=2&qs=0&rc=am55N3hscWd2eDMzNzczM0ApNmZmaDo1Mzw4N2Y2OzwzNGdhNjZlai5oaGJfLS1iMTZzc2NhX140YjEvYmBfLmM2YS06Yw%3D%3D&signature=0a15da58836c5384b586ccffcadd9371&tk=tt_webid_v2&vl=&vr=',
        duration: 10,
        dynamicCover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/4fc34ba8399e4d0fa95ac21a506b7956_1604176447?x-expires=1608361200&x-signature=Myj%2B0RkSecNOhygT%2Fi%2B7iNQtO08%3D',
        height: 1024,
        id: 'awesome',
        originCover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/0a1f841422894abea0244d6088616bc3_1604176445?x-expires=1608361200&x-signature=8lLXIHJVxhY8%2Bsq0MUfHbqcF5tU%3D',
        playAddr: 'https://v16-web.tiktok.com/video/tos/useast2a/tos-useast2a-pve-0068/36eb19549f0248a59139d8fd90959a8d/?a=1988&br=2748&bt=1374&cd=0%7C0%7C1&cr=0&cs=0&cv=1&dr=0&ds=3&er=&expire=1608361869&l=202012190110590101890660240B146B4E&lr=tiktok_m&mime_type=video_mp4&policy=2&qs=0&rc=am55N3hscWd2eDMzNzczM0ApNmZmaDo1Mzw4N2Y2OzwzNGdhNjZlai5oaGJfLS1iMTZzc2NhX140YjEvYmBfLmM2YS06Yw%3D%3D&signature=0a15da58836c5384b586ccffcadd9371&tk=tt_webid_v2&vl=&vr=',
        ratio: '720p',
        reflowCover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/116cfa8fc0c9782909a29ada4bd11142?x-expires=1608361200&x-signature=cajJ1LTPRe5dg5M7zRJZflsFYzE%3D',
        shareCover: [
          '',
          'https://p16-sign-va.tiktokcdn.com/tos-maliva-p-0068/0a1f841422894abea0244d6088616bc3_1604176445~tplv-tiktok-play.jpeg?x-expires=1608361200&x-signature=ZVnSkgjeLsYm4dEqTni3bK%2FRJ8g%3D',
          'https://p16-sign-va.tiktokcdn.com/tos-maliva-p-0068/0a1f841422894abea0244d6088616bc3_1604176445~tplv-tiktok-play2.jpeg?x-expires=1608361200&x-signature=%2BCCC4eMn%2BabJ%2B8DIlcR0zLKWgZ0%3D'
        ],
        width: 576
      },
      vl1: false,
      videoMeta: {
        cover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/dddbaca786574b78b8529bb555ccf911?x-expires=1608361200&x-signature=vTgnDQ%2F0UEo%2FlJ3AYqM5N4Mn0Z8%3D',
        downloadAddr: 'https://v16-web.tiktok.com/video/tos/useast2a/tos-useast2a-pve-0068/36eb19549f0248a59139d8fd90959a8d/?a=1988&br=2748&bt=1374&cd=0%7C0%7C1&cr=0&cs=0&cv=1&dr=0&ds=3&er=&expire=1608361869&l=202012190110590101890660240B146B4E&lr=tiktok_m&mime_type=video_mp4&policy=2&qs=0&rc=am55N3hscWd2eDMzNzczM0ApNmZmaDo1Mzw4N2Y2OzwzNGdhNjZlai5oaGJfLS1iMTZzc2NhX140YjEvYmBfLmM2YS06Yw%3D%3D&signature=0a15da58836c5384b586ccffcadd9371&tk=tt_webid_v2&vl=&vr=',
        duration: 10,
        dynamicCover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/4fc34ba8399e4d0fa95ac21a506b7956_1604176447?x-expires=1608361200&x-signature=Myj%2B0RkSecNOhygT%2Fi%2B7iNQtO08%3D',
        height: 1024,
        id: 'awesome',
        originCover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/0a1f841422894abea0244d6088616bc3_1604176445?x-expires=1608361200&x-signature=8lLXIHJVxhY8%2Bsq0MUfHbqcF5tU%3D',
        playAddr: 'https://v16-web.tiktok.com/video/tos/useast2a/tos-useast2a-pve-0068/36eb19549f0248a59139d8fd90959a8d/?a=1988&br=2748&bt=1374&cd=0%7C0%7C1&cr=0&cs=0&cv=1&dr=0&ds=3&er=&expire=1608361869&l=202012190110590101890660240B146B4E&lr=tiktok_m&mime_type=video_mp4&policy=2&qs=0&rc=am55N3hscWd2eDMzNzczM0ApNmZmaDo1Mzw4N2Y2OzwzNGdhNjZlai5oaGJfLS1iMTZzc2NhX140YjEvYmBfLmM2YS06Yw%3D%3D&signature=0a15da58836c5384b586ccffcadd9371&tk=tt_webid_v2&vl=&vr=',
        ratio: '720p',
        reflowCover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/116cfa8fc0c9782909a29ada4bd11142?x-expires=1608361200&x-signature=cajJ1LTPRe5dg5M7zRJZflsFYzE%3D',
        shareCover: [
          '',
          'https://p16-sign-va.tiktokcdn.com/tos-maliva-p-0068/0a1f841422894abea0244d6088616bc3_1604176445~tplv-tiktok-play.jpeg?x-expires=1608361200&x-signature=ZVnSkgjeLsYm4dEqTni3bK%2FRJ8g%3D',
          'https://p16-sign-va.tiktokcdn.com/tos-maliva-p-0068/0a1f841422894abea0244d6088616bc3_1604176445~tplv-tiktok-play2.jpeg?x-expires=1608361200&x-signature=%2BCCC4eMn%2BabJ%2B8DIlcR0zLKWgZ0%3D'
        ],
        width: 576
      },
      commentCount: 13300,
      diggCount: 267000,
      playCount: 2900000,
      shareCount: 11100,
      musicMeta: {
        album: '',
        authorName: 'Jordan Scott 🦋',
        coverLarge: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/0590ca7ca3d4778ac9d407a49ae0031c~c5_1080x1080.jpeg?x-expires=1608426000&x-signature=39j1105o%2BWpIUBbijIxHeC2lYKs%3D',
        coverMedium: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/0590ca7ca3d4778ac9d407a49ae0031c~c5_720x720.jpeg?x-expires=1608426000&x-signature=3pSg38gktrG5HyfKQAzHq1svPYc%3D',
        coverThumb: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/0590ca7ca3d4778ac9d407a49ae0031c~c5_100x100.jpeg?x-expires=1608426000&x-signature=r7mjY6aWh9fsAJNzlWEwOLAAKPg%3D',
        duration: 10,
        id: '6889885265632971526',
        original: true,
        playUrl: 'https://sf16-va.tiktokcdn.com/obj/musically-maliva-obj/6889885077178682117.mp3',
        title: 'original sound',
        musicId: '6889885265632971526'
      },
      authorMeta: {
        avatarLarger: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/0590ca7ca3d4778ac9d407a49ae0031c~c5_1080x1080.jpeg?x-expires=1608426000&x-signature=39j1105o%2BWpIUBbijIxHeC2lYKs%3D',
        avatarMedium: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/0590ca7ca3d4778ac9d407a49ae0031c~c5_720x720.jpeg?x-expires=1608426000&x-signature=3pSg38gktrG5HyfKQAzHq1svPYc%3D',
        avatarThumb: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/0590ca7ca3d4778ac9d407a49ae0031c~c5_100x100.jpeg?x-expires=1608426000&x-signature=r7mjY6aWh9fsAJNzlWEwOLAAKPg%3D',
        commentSetting: 0,
        duetSetting: 0,
        ftc: false,
        id: '6807910729762669574',
        nickname: 'Jordan Scott 🦋',
        openFavorite: false,
        privateAccount: false,
        relation: 0,
        secUid: 'MS4wLjABAAAAvFVEV4ThgsBdXCWQ1yLqkVlZjgxDW9NVnoArfwGDtIawAaglXu_uNlMBJSJOorMl',
        secret: false,
        signature: '#TwoPrettyBestFriends\n        MERCH LINK⤵️',
        stitchSetting: 0,
        uniqueId: 'jayrscottyy',
        verified: false,
        name: 'jayrscottyy'
      },
      hashtags: [
        {
          awemeId: '',
          end: 127,
          id: '',
          name: 'effectivealtruism',
          isCommerce: false,
          secUid: '',
          start: 109,
          type: 1,
          userId: '',
          userUniqueId: ''
        },
        {
          awemeId: '',
          end: 136,
          id: '',
          name: 'history',
          isCommerce: false,
          secUid: '',
          start: 128,
          type: 1,
          userId: '',
          userUniqueId: ''
        },
        {
          awemeId: '',
          end: 136,
          id: '',
          name: '',
          isCommerce: false,
          secUid: '',
          start: 128,
          type: 1,
          userId: '',
          userUniqueId: ''
        }
      ],
      text: 'facts Tinka Butt I only see you🥺❤️'
    }
  ]
}

const AUTHOR = {
  itemList: [],
  stats: {
    diggCount: 0,
    followerCount: 1400000,
    followingCount: 27,
    heart: 30900000,
    heartCount: 30900000,
    videoCount: 151
  },
  user: {
    avatarLarger: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/0590ca7ca3d4778ac9d407a49ae0031c~c5_1080x1080.jpeg?x-expires=1608426000&x-signature=39j1105o%2BWpIUBbijIxHeC2lYKs%3D',
    avatarMedium: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/0590ca7ca3d4778ac9d407a49ae0031c~c5_720x720.jpeg?x-expires=1608426000&x-signature=3pSg38gktrG5HyfKQAzHq1svPYc%3D',
    avatarThumb: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/0590ca7ca3d4778ac9d407a49ae0031c~c5_100x100.jpeg?x-expires=1608426000&x-signature=r7mjY6aWh9fsAJNzlWEwOLAAKPg%3D',
    bioLink: { link: 'https://my.bio/jayscottyy', risk: 3 },
    commentSetting: 0,
    createTime: 1592937951,
    duetSetting: 0,
    ftc: false,
    id: '6807910729762669574',
    nickname: 'Jordan Scott 🦋',
    openFavorite: false,
    privateAccount: false,
    relation: 0,
    secUid: 'MS4wLjABAAAAvFVEV4ThgsBdXCWQ1yLqkVlZjgxDW9NVnoArfwGDtIawAaglXu_uNlMBJSJOorMl',
    secret: false,
    shortId: '0',
    signature: '#TwoPrettyBestFriends\n        MERCH LINK⤵️',
    stitchSetting: 0,
    uniqueId: 'jayrscottyy',
    verified: false
  }
}

beforeAll(async () => {
});

afterAll(async () => {
  await Video.query().delete();
  await pg.raw(`delete from tiktok.stats_users`);
});

describe("transform Video", () => {
  const { video_parsed, tags } = transform_videos({ videos: VIDEOS, author_results: AUTHOR })
  test("Tag length", () => expect(tags.length).toEqual(2));
  test("Video", () => expect(video_parsed).toEqual([{
    video_id: '6889885218962951430',
    description: 'facts Tinka Butt I only see you🥺❤️',
    create_time: pg.raw(`to_timestamp(1604176444)`),
    duration: 10,
    likes: 267000,
    shares: 11100,
    comments: 13300,
    views: 2900000,
    fetchedat: pg.raw(`now()`),
    soundid: '6889885265632971526',
    author: 'jayrscottyy'
  }]));
});

describe("Integration – Videos – Hashtags ", () => {
  const hashtags = [{ id: '', name: 'effectivealtruism' }, { id: '', name: 'history' }];
  const { tags } = transform_videos({ videos: VIDEOS, author_results: AUTHOR })
  hashtags.forEach(tag => {
    test("tag " + tag.name, () => expect(tags.filter(t => t.tag_name == tag.name && t.challenge_id == tag.id).length).toEqual(1));
  })
  test("empty tag ", () => expect(tags.filter(t => t.tag_name == '').length).toEqual(0));
  console.log(tags)
});

describe("transform Author", () => {
  const { author_parsed } = transform_author({ author_results: AUTHOR })
  test("Transformed author", () => expect(author_parsed).toEqual({
    fetch_time: pg.raw(`now()`),
    name: 'jayrscottyy',
    follower_count: 1400000,
    video_count: 151,
    like_count: 30900000,
    bio: '#TwoPrettyBestFriends\n        MERCH LINK⤵️'
  }));
});

describe("Integration test", () => {
  return;
  test('integration', async () => {
    const { videos, author_results } = await get_data(30, 'benthamite', 1579824000000)
    const { video_parsed, tags, author_parsed } = await transform({ videos, author_results })
    test("author", () => expect(author_parsed).toEqual({
      fetch_time: pg.raw(`now()`),
      name: 'benthamite',
      follower_count: 47300,
      video_count: 223,
      like_count: 1100000,
      bio: "push-pin = poetry"
    }));
    test("video", () => expect(video_parsed).toEqual([{
      "video_id": "6785204109579504902",
      "description": "\"Everything was awful for a very long time, and then the industrial revolution happened\" - Luke Muehlhauser. #effectivealtruism #history",
      "duration": 10,
      "likes": 37,
      "shares": 7,
      "comments": 1,
      "views": "612",
      "fetchedat": "2020-12-19T01:37:09.877Z",
      "soundid": "6699935602407639814",
      "author": "benthamite",
      "duet_enabled": null,
      "stitch_enabled": null,
      "self_liked": null,
      "create_time": "2020-01-23T18:17:22.000Z",
      "top_for_tags": null
    }]));
  })
});