
exports.up = function(knex) {
  return knex.schema.raw(`
  create materialized view tiktok_next.insights_delta as (
    with latest_videos as (
      select user_videos.* from tiktok.user_videos
      inner join (
        select video_id, fetchedat::date "day", Max(fetchedat) fetchedat
        from tiktok.user_videos
        Group by video_id, fetchedat::date
      ) q using (video_id, fetchedat)
    )
    ,latest as (
      select insights.*, likes, shares, comments, soundid from tiktok_next.insights
      inner join (
        select video_id, created_at::date "day", Max(created_at) created_at
        from tiktok_next.insights
        Group by video_id, created_at::date
      ) q using (video_id, created_at)
      inner join latest_videos on latest_videos.video_id = insights.video_id 
        and latest_videos.fetchedat::date = insights.created_at::date
    )
    ,ordered as (
      SELECT *
      , row_number() over (partition by video_id order by created_at desc) rn
      FROM latest
    )
    ,delta as (
      SELECT late.video_id, late.author, 
      late.total_views, late.total_views - early.total_views delta_total_views,
      late.total_views * late.fyp_percent fyp_views, late.total_views * late.fyp_percent - early.total_views * early.fyp_percent delta_fyp_views,
      late.total_views * (1 - late.fyp_percent) non_fyp_views, late.total_views * (1 - late.fyp_percent) - early.total_views * (1 - early.fyp_percent) delta_non_fyp_views,
      late.unique_views, late.unique_views - early.unique_views delta_unique_views,
      late.watch_time, late.watch_time - early.watch_time delta_watch_time,
    late.watch_time / late.duration watch_percent, late.watch_time / late.duration - early.watch_time / early.duration delta_watch_percent,
      late.followers, late.followers - early.followers delta_followers,
      late.sound_percent, late.sound_percent - early.sound_percent delta_sound_percent,
      late.fyp_percent, late.fyp_percent - early.fyp_percent delta_fyp_percent,
      late.hashtag_percent, late.hashtag_percent - early.hashtag_percent delta_hashtag_percent,
      late.profile_percent, late.profile_percent - early.profile_percent delta_profile_percent,
      late.created_at,
      extract (days from late.created_at - late.video_created_at) days_after_creation,
    late.likes, late.likes - early.likes delta_likes
      FROM ordered late
      inner join ordered early on early.video_id = late.video_id and early.rn +1 = late.rn
    )
    select * 
    from delta 
    where delta_fyp_views > 100
  )
  `);
};

exports.down = function(knex) {
  return knex.schema.raw(`drop materialized view tiktok_next.insights_delta`);
};
