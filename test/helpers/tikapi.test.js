import { user_videos } from '../../helpers/tik_api'

const RECEIVED = {
  author: {
    avatarLarger: 'https://p16-sign-va.tiktokcdn.com/musically-maliva-obj/1661542008230917~c5_1080x1080.jpeg?x-expires=1608429600&x-signature=wYomZtovkNjfX%2Fv4nwmfXFhzVU0%3D',
    avatarMedium: 'https://p16-sign-va.tiktokcdn.com/musically-maliva-obj/1661542008230917~c5_720x720.jpeg?x-expires=1608429600&x-signature=xIdSGdk0abm6Y79N%2BAGq0KJ38WI%3D',
    avatarThumb: 'https://p16-sign-va.tiktokcdn.com/musically-maliva-obj/1661542008230917~c5_100x100.jpeg?x-expires=1608429600&x-signature=LsGNBH7uWrNa9Xy3EO9RmQUqD1o%3D',
    commentSetting: 0,
    duetSetting: 0,
    ftc: false,
    id: '6639029544903655430',
    nickname: 'Benthamite',
    openFavorite: false,
    privateAccount: false,
    relation: 0,
    secUid: 'MS4wLjABAAAAS4R8H3h-69lL3jigTPIlptkPCtBx7gtzQCneX73lZ3L4r6jm7VD9gfWUUoAoFfZj',
    secret: false,
    signature: 'push-pin = poetry',
    stitchSetting: 0,
    uniqueId: 'benthamite',
    verified: false
  },
  authorStats: {
    diggCount: 10600,
    followerCount: 47300,
    followingCount: 222,
    heart: 1100000,
    heartCount: 1100000,
    videoCount: 223
  },
  challenges: [
    {
      coverLarger: '',
      coverMedium: '',
      coverThumb: '',
      desc: '',
      id: '1630594348812293',
      isCommerce: false,
      profileLarger: '',
      profileMedium: '',
      profileThumb: '',
      title: 'effectivealtruism'
    },
    {
      coverLarger: '',
      coverMedium: '',
      coverThumb: '',
      desc: '',
      id: '15690',
      isCommerce: false,
      profileLarger: '',
      profileMedium: '',
      profileThumb: '',
      title: 'history'
    }
  ],
  createTime: 1579803442,
  desc: '"Everything was awful for a very long time, and then the industrial revolution happened" - Luke Muehlhauser. #effectivealtruism #history',
  digged: false,
  duetEnabled: true,
  duetInfo: { duetFromId: '0' },
  forFriend: false,
  id: '6785204109579504902',
  isAd: false,
  itemCommentStatus: 0,
  itemMute: false,
  music: {
    album: 'Lalala',
    authorName: 'Y2K & bbno$',
    coverLarge: 'https://p16-sg.tiktokcdn.com/aweme/720x720/tos-alisg-i-0000/0ec14b2a2161432ea4cbfe7475b087b5.jpeg',
    coverMedium: 'https://p16-sg.tiktokcdn.com/aweme/200x200/tos-alisg-i-0000/0ec14b2a2161432ea4cbfe7475b087b5.jpeg',
    coverThumb: 'https://p16-sg.tiktokcdn.com/aweme/100x100/tos-alisg-i-0000/0ec14b2a2161432ea4cbfe7475b087b5.jpeg',
    duration: 44,
    id: '6699935602407639814',
    original: false,
    playUrl: 'https://sf16-sg.tiktokcdn.com/obj/tiktok-obj/2cac209fced9582d9da110734578bd47.mp3',
    title: 'Lalala'
  },
  officalItem: false,
  originalItem: false,
  privateItem: false,
  secret: false,
  shareEnabled: true,
  showNotPass: false,
  stats: { commentCount: 1, diggCount: 37, playCount: 612, shareCount: 7 },
  stitchEnabled: true,
  textExtra: [
    {
      awemeId: '',
      end: 127,
      hashtagId: '',
      hashtagName: 'effectivealtruism',
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
      hashtagId: '',
      hashtagName: 'history',
      isCommerce: false,
      secUid: '',
      start: 128,
      type: 1,
      userId: '',
      userUniqueId: ''
    }
  ],
  video: {
    cover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/e942d0e8442f41d5a88cbeb52c1e0424_1579803445?x-expires=1608364800&x-signature=KwEz%2Fgbjwhhn5e%2B3l7aPP1BOgt4%3D',
    downloadAddr: 'https://v16-web.tiktok.com/video/tos/useast2a/tos-useast2a-ve-0068/56b2e09b66f044cb845b8ceb49bea151/?a=1988&br=214&bt=107&cd=0%7C0%7C0&cr=0&cs=0&dr=0&ds=3&er=&expire=1608366852&l=2020121902340201019018601449167381&lr=tiktok_m&mime_type=video_mp4&policy=2&qs=0&rc=M3N3dzw5aGR4cjMzNjczM0ApZDdkaWhmNDs2N2g0N2Y0N2c1X3A2Lm9iM2hfLS1fMTZzczQvNmJgYTZjYS0tLl4wMmI6Yw%3D%3D&signature=6848cd9f32d7a546806831c9f73dc941&tk=tt_webid_v2&vl=&vr=',
    duration: 10,
    dynamicCover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/095976dcfd1e49129eff7b48ff8f3098_1579803445?x-expires=1608364800&x-signature=JwRi0Y4HEFV72J%2BvugKlKJEo%2Fbw%3D',
    height: 480,
    id: 'awesome',
    originCover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/be6b637dcd874f7b923c140aed43a265_1579803445?x-expires=1608364800&x-signature=E3UiN0jYkcaepqUVFklQdrIuELQ%3D',
    playAddr: 'https://v16-web.tiktok.com/video/tos/useast2a/tos-useast2a-ve-0068/56b2e09b66f044cb845b8ceb49bea151/?a=1988&br=214&bt=107&cd=0%7C0%7C0&cr=0&cs=0&dr=0&ds=3&er=&expire=1608366852&l=2020121902340201019018601449167381&lr=tiktok_m&mime_type=video_mp4&policy=2&qs=0&rc=M3N3dzw5aGR4cjMzNjczM0ApZDdkaWhmNDs2N2g0N2Y0N2c1X3A2Lm9iM2hfLS1fMTZzczQvNmJgYTZjYS0tLl4wMmI6Yw%3D%3D&signature=6848cd9f32d7a546806831c9f73dc941&tk=tt_webid_v2&vl=&vr=',
    ratio: '720p',
    reflowCover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/e942d0e8442f41d5a88cbeb52c1e0424_1579803445?x-expires=1608364800&x-signature=KwEz%2Fgbjwhhn5e%2B3l7aPP1BOgt4%3D',
    shareCover: [
      '',
      'https://p16-sign-va.tiktokcdn.com/tos-maliva-p-0068/be6b637dcd874f7b923c140aed43a265_1579803445~tplv-tiktok-play.jpeg?x-expires=1608364800&x-signature=ns%2FNblWLp9irtUdFtSDW4FdHz5A%3D',
      'https://p16-sign-va.tiktokcdn.com/tos-maliva-p-0068/be6b637dcd874f7b923c140aed43a265_1579803445~tplv-tiktok-play2.jpeg?x-expires=1608364800&x-signature=EEkb%2B%2FFqc1SA2jt95ne74e43LdA%3D'
    ],
    width: 864
  },
  vl1: false,
  videoMeta: {
    cover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/e942d0e8442f41d5a88cbeb52c1e0424_1579803445?x-expires=1608364800&x-signature=KwEz%2Fgbjwhhn5e%2B3l7aPP1BOgt4%3D',
    downloadAddr: 'https://v16-web.tiktok.com/video/tos/useast2a/tos-useast2a-ve-0068/56b2e09b66f044cb845b8ceb49bea151/?a=1988&br=214&bt=107&cd=0%7C0%7C0&cr=0&cs=0&dr=0&ds=3&er=&expire=1608366852&l=2020121902340201019018601449167381&lr=tiktok_m&mime_type=video_mp4&policy=2&qs=0&rc=M3N3dzw5aGR4cjMzNjczM0ApZDdkaWhmNDs2N2g0N2Y0N2c1X3A2Lm9iM2hfLS1fMTZzczQvNmJgYTZjYS0tLl4wMmI6Yw%3D%3D&signature=6848cd9f32d7a546806831c9f73dc941&tk=tt_webid_v2&vl=&vr=',
    duration: 10,
    dynamicCover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/095976dcfd1e49129eff7b48ff8f3098_1579803445?x-expires=1608364800&x-signature=JwRi0Y4HEFV72J%2BvugKlKJEo%2Fbw%3D',
    height: 480,
    id: 'awesome',
    originCover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/be6b637dcd874f7b923c140aed43a265_1579803445?x-expires=1608364800&x-signature=E3UiN0jYkcaepqUVFklQdrIuELQ%3D',
    playAddr: 'https://v16-web.tiktok.com/video/tos/useast2a/tos-useast2a-ve-0068/56b2e09b66f044cb845b8ceb49bea151/?a=1988&br=214&bt=107&cd=0%7C0%7C0&cr=0&cs=0&dr=0&ds=3&er=&expire=1608366852&l=2020121902340201019018601449167381&lr=tiktok_m&mime_type=video_mp4&policy=2&qs=0&rc=M3N3dzw5aGR4cjMzNjczM0ApZDdkaWhmNDs2N2g0N2Y0N2c1X3A2Lm9iM2hfLS1fMTZzczQvNmJgYTZjYS0tLl4wMmI6Yw%3D%3D&signature=6848cd9f32d7a546806831c9f73dc941&tk=tt_webid_v2&vl=&vr=',
    ratio: '720p',
    reflowCover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/e942d0e8442f41d5a88cbeb52c1e0424_1579803445?x-expires=1608364800&x-signature=KwEz%2Fgbjwhhn5e%2B3l7aPP1BOgt4%3D',
    shareCover: [
      '',
      'https://p16-sign-va.tiktokcdn.com/tos-maliva-p-0068/be6b637dcd874f7b923c140aed43a265_1579803445~tplv-tiktok-play.jpeg?x-expires=1608364800&x-signature=ns%2FNblWLp9irtUdFtSDW4FdHz5A%3D',
      'https://p16-sign-va.tiktokcdn.com/tos-maliva-p-0068/be6b637dcd874f7b923c140aed43a265_1579803445~tplv-tiktok-play2.jpeg?x-expires=1608364800&x-signature=EEkb%2B%2FFqc1SA2jt95ne74e43LdA%3D'
    ],
    width: 864
  },
  commentCount: 1,
  diggCount: 37,
  playCount: 612,
  shareCount: 7,
  musicMeta: {
    album: 'Lalala',
    authorName: 'Y2K & bbno$',
    coverLarge: 'https://p16-sg.tiktokcdn.com/aweme/720x720/tos-alisg-i-0000/0ec14b2a2161432ea4cbfe7475b087b5.jpeg',
    coverMedium: 'https://p16-sg.tiktokcdn.com/aweme/200x200/tos-alisg-i-0000/0ec14b2a2161432ea4cbfe7475b087b5.jpeg',
    coverThumb: 'https://p16-sg.tiktokcdn.com/aweme/100x100/tos-alisg-i-0000/0ec14b2a2161432ea4cbfe7475b087b5.jpeg',
    duration: 44,
    id: '6699935602407639814',
    original: false,
    playUrl: 'https://sf16-sg.tiktokcdn.com/obj/tiktok-obj/2cac209fced9582d9da110734578bd47.mp3',
    title: 'Lalala',
    musicId: '6699935602407639814'
  },
  authorMeta: {
    avatarLarger: 'https://p16-sign-va.tiktokcdn.com/musically-maliva-obj/1661542008230917~c5_1080x1080.jpeg?x-expires=1608429600&x-signature=wYomZtovkNjfX%2Fv4nwmfXFhzVU0%3D',
    avatarMedium: 'https://p16-sign-va.tiktokcdn.com/musically-maliva-obj/1661542008230917~c5_720x720.jpeg?x-expires=1608429600&x-signature=xIdSGdk0abm6Y79N%2BAGq0KJ38WI%3D',
    avatarThumb: 'https://p16-sign-va.tiktokcdn.com/musically-maliva-obj/1661542008230917~c5_100x100.jpeg?x-expires=1608429600&x-signature=LsGNBH7uWrNa9Xy3EO9RmQUqD1o%3D',
    commentSetting: 0,
    duetSetting: 0,
    ftc: false,
    id: '6639029544903655430',
    nickname: 'Benthamite',
    openFavorite: false,
    privateAccount: false,
    relation: 0,
    secUid: 'MS4wLjABAAAAS4R8H3h-69lL3jigTPIlptkPCtBx7gtzQCneX73lZ3L4r6jm7VD9gfWUUoAoFfZj',
    secret: false,
    signature: 'push-pin = poetry',
    stitchSetting: 0,
    uniqueId: 'benthamite',
    verified: false,
    name: 'benthamite'
  },
  hashtags: [
    { id: undefined, name: 'effectivealtruism' },
    { id: undefined, name: 'history' }
  ],
  text: '"Everything was awful for a very long time, and then the industrial revolution happened" - Luke Muehlhauser. #effectivealtruism #history'
}

const RECEIVED_AUTHOR = {
  itemList: [],
  stats: {
    diggCount: 0,
    followerCount: 47300,
    followingCount: 222,
    heart: 1100000,
    heartCount: 1100000,
    videoCount: 223
  },
  user: {
    avatarLarger: 'https://p16-sign-va.tiktokcdn.com/musically-maliva-obj/1661542008230917~c5_1080x1080.jpeg?x-expires=1608429600&x-signature=wYomZtovkNjfX%2Fv4nwmfXFhzVU0%3D',
    avatarMedium: 'https://p16-sign-va.tiktokcdn.com/musically-maliva-obj/1661542008230917~c5_720x720.jpeg?x-expires=1608429600&x-signature=xIdSGdk0abm6Y79N%2BAGq0KJ38WI%3D',
    avatarThumb: 'https://p16-sign-va.tiktokcdn.com/musically-maliva-obj/1661542008230917~c5_100x100.jpeg?x-expires=1608429600&x-signature=LsGNBH7uWrNa9Xy3EO9RmQUqD1o%3D',
    bioLink: { link: 'linktr.ee/benthamite', risk: 3 },
    commentSetting: 0,
    createTime: 1545770264,
    duetSetting: 0,
    ftc: false,
    id: '6639029544903655430',
    nickname: 'Benthamite',
    openFavorite: false,
    privateAccount: false,
    relation: 0,
    secUid: 'MS4wLjABAAAAS4R8H3h-69lL3jigTPIlptkPCtBx7gtzQCneX73lZ3L4r6jm7VD9gfWUUoAoFfZj',
    secret: false,
    shortId: '0',
    signature: 'push-pin = poetry',
    stitchSetting: 0,
    uniqueId: 'benthamite',
    verified: false
  }
}

let videos_loaded, author_results_loaded;

beforeAll(async () => {
  const mock = true;
  if (mock) {
    const { videos, author_results } = await (async () => ({ videos: { collector: [RECEIVED] }, author_results: RECEIVED_AUTHOR }))()
    videos_loaded = videos;
    author_results_loaded = author_results;
  } else {
    const { videos, author_results } = await user_videos(30, 'benthamite', 1579824000000)
    videos_loaded = videos;
    author_results_loaded = author_results;
  }
}, 30000);

describe("Integration – Author – basic", () => {
  const stats = {
    diggCount: 0,
    followerCount: 47300,
    followingCount: 222,
    heart: 1100000,
    heartCount: 1100000,
    videoCount: 223
  }
  for (const [key, value] of Object.entries(stats)) {
    test("Stats " + key, () => expect(author_results_loaded.stats[key]).toEqual(value));
  }
})

describe("Integration – Author – User", () => {
  const stats = {
    uniqueId: 'benthamite',
    signature: 'push-pin = poetry'
  }
  for (const [key, value] of Object.entries(stats)) {
    test("Stats " + key, () => expect(author_results_loaded.user[key]).toEqual(value));
  }
})

describe("Integration – Videos – basic", () => {
  const stats = {
    diggCount: 37,
    shareCount: 7,
    commentCount: 1,
    playCount: 612,
    id: '6785204109579504902',
    text: '"Everything was awful for a very long time, and then the industrial revolution happened" - Luke Muehlhauser. #effectivealtruism #history',
  }
  for (const [key, value] of Object.entries(stats)) {
    test("Stats " + key, () => expect(videos_loaded.collector[0][key]).toEqual(value));
  }
})

describe("Integration – Videos – Hashtags ", () => {
  const hashtags = [{ id: undefined, name: 'effectivealtruism' }, { id: undefined, name: 'history' }];
  hashtags.forEach(tag => {
    test("tag " + tag.name, () => expect(videos_loaded.collector[0].hashtags.filter(t => t.name == tag.name && t.id == tag.id).length).toEqual(1));

  })
});

describe("Integration – Videos – Deeper ", () => {
  const deeper = {
    musicMeta: { musicId: '6699935602407639814' },
    authorMeta: { name: 'benthamite' },
  }
  for (const [key, value] of Object.entries(deeper)) {
    for (const [skey, svalue] of Object.entries(value)) {
      test("Stats " + skey, () => expect(videos_loaded.collector[0][key][skey]).toEqual(svalue));
    }
  }
});