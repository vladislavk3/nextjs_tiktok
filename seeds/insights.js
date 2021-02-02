
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return /*knex('tiktok_authentication.cookies').del()
    .then(function () {
      // Inserts seed entries
      return*/ knex('tiktok_authentication.cookies').insert([
        {id: 1, user_id: 1, author: 'benthamite', cookie: 'abc', encrypted_cookie: knex.raw(`PGP_SYM_ENCRYPT('abc', '${process.env.PG_COLUMN_PASSWORD}')`)},
      ]).then(() => {
        return knex('tiktok_next.insights').insert([
          insight(1, 100, 10, new Date(new Date().setDate(new Date().getDate()-1))),
          insight(2, 200, 10, new Date(new Date().setDate(new Date().getDate()-1))),
          insight(1, 200, 20, new Date()),
          insight(2, 400, 20, new Date()),
        ])
      })
    //});
};

function insight(video_id, total_views, followers, created_at) {
  return  {
  video_id,
  author: "benthamite",
  description: "want to join the beta for the #algorithim dashboard?",
  total_views,
  unique_views: "6531",
  duration: "58979",
  watch_time: "22310.91",
  followers,
  video_created_at: "2020-10-01 03:47:19+00",
  created_at,
  sound_percent: "0",
  fyp_percent: "0.6741708",
  follow_percent: "0.2291195",
  hashtag_percent: "0",
  profile_percent: "0.08978287",}
  
}