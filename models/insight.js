const { Model } = require('objection')

class Insight extends Model {
  static get tableName() {
    return 'tiktok_next.insights';
  }
}

module.exports.Insight = Insight;

export  async function fetch_insights(access_token) {
    const v = await cookie(access_token)
    const r = await get_insights(v['author'], v['cookie'])
    return r
  }

  async function cookie(access_token) {
      const r = await pg.raw(`
              select cookie, author
              from tiktok_authentication.cookies
              inner join sessions using (user_id)
              where sessions.access_token = (?)
              limit 1
          `, [access_token,])
      return r.rows[0]
  }

export async function get_insights(name, cookie) {
      const user_res = await fetch(`${process.env.API_INSIGHTS}name=${name}&cookie=${cookie}&count=3`).then(r => r.json())
      return user_res
  }