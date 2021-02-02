
exports.up = function(knex) {
    return knex.schema.raw(`
    create or replace view tiktok_next.latest_videos
    as
    select user_videos.*
    from tiktok.user_videos
    inner join (
        select video_id, max(fetchedat) fetchedat
        from tiktok.user_videos
        group by video_id
    ) latest using (video_id, fetchedat);
    `);
  };
  
  exports.down = function(knex) {
    return knex.schema.raw(`
    drop view tiktok_next.latest_videos;
    `);
  };
  