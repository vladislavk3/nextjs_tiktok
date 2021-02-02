
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE if not exists tiktok.stats_users
(
    fetch_time timestamp with time zone NOT NULL,
    name text COLLATE pg_catalog."default",
    follower_count bigint,
    video_count bigint,
    like_count bigint,
    avatar_medium text COLLATE pg_catalog."default",
    bio text COLLATE pg_catalog."default"
)
  `)
};

exports.down = function(knex) {
  
};
