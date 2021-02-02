const TABLE_NAME = 'tiktok_next.user_followers'

exports.up = function (knex) {
  return knex.schema.table(TABLE_NAME, function (t) {
    t.increments();
  }).then(() => knex.raw(`
    delete
    FROM tiktok_next.user_followers v
    using tiktok_next.user_followers t
    where v.author = t.author
    and v.following_author = t.following_author
    and v.id < t.id
  `)).then(() =>
    knex.schema.table(TABLE_NAME, function (t) {
      t.unique(['author', 'following_author'], 'user_followers_unique');
    })
  )
};

exports.down = function (knex) {
  return knex.schema.table(TABLE_NAME, function (t) {
    t.dropUnique(['author', 'following_author'], 'user_followers_unique');
  });
};
