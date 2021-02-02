
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE if not exists tiktok.tag_data
(
    name text COLLATE pg_catalog."default" NOT NULL,
    video_count bigint,
    view_count bigint,
    challenge_id bigint,
    fetch_time timestamp with time zone
);
CREATE INDEX if not exists  tag_data_challenge_id
  ON tiktok.tag_data(challenge_id);
  `)
};

exports.down = function(knex) {
  
};
