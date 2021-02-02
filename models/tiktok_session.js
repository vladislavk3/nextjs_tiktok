const { Model } = require('objection')
import {pg} from 'helpers/db'
Model.knex(pg);

class TiktokSession extends Model {
  static get tableName() {
    return 'tiktok_next.tiktok_session';
  }
}

export {TiktokSession}