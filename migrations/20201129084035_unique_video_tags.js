const TABLE_NAME = 'tiktok.video_tag'

exports.up = function (knex) {
  return knex.schema.table(TABLE_NAME, function (t) {
    t.increments();
  }).then(() => knex.raw(`
    delete
    FROM tiktok.video_tag v
    using tiktok.video_tag t
    where v.video_id = t.video_id
    and v.tag_name = t.tag_name
    and (v.fetch_time < t.fetch_time
          or v.fetch_time is null
          or v.id < t.id)
  `)).then(() =>
    knex.schema.table(TABLE_NAME, function (t) {
      t.unique(['video_id', 'tag_name'], 'video_tag_unique');
      t.datetime('fetch_time').defaultTo(knex.fn.now()).alter();
    })
  )
};

exports.down = function (knex) {
  return knex.schema.table(TABLE_NAME, function (t) {
    t.dropUnique(['video_id', 'tag_name'], 'video_tag_unique');
  });
};
