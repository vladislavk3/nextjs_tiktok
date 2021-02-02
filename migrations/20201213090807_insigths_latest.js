
exports.up = function(knex) {
  return knex.schema.raw(`
  
 create materialized view tiktok_next.insights_latest_joined as (
    with latest_videos as (
      select user_videos.* from tiktok.user_videos
      inner join (
        select video_id, fetchedat::date "day", Max(fetchedat) fetchedat
        from tiktok.user_videos
        Group by video_id, fetchedat::date
      ) q using (video_id, fetchedat)
    )
    ,latest as (
      select insights.* from tiktok_next.insights
      inner join (
        select video_id, created_at::date "day", Max(created_at) created_at
        from tiktok_next.insights
        Group by video_id, created_at::date
      ) q using (video_id, created_at)
    )
      SELECT late.*
	 , latest_videos.likes, latest_videos.comments, latest_videos.shares
		, late.total_views / nullif(latest_videos.likes, 0) latest_vpl
		, late.total_views / nullif(latest_videos.likes + latest_videos.comments + latest_videos.shares, 0) latest_vpe
	 , late.watch_time / late.duration watch_percent
      FROM latest late
      inner join latest_videos on latest_videos.video_id = late.video_id 
        and latest_videos.fetchedat::date = late.created_at::date
  )
  `);
};

exports.down = function(knex) {
  return knex.schema.raw(`drop materialized view tiktok_next.insights_latest_joined;`);
};
