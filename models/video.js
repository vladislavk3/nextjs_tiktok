const { Model } = require('objection')
import {pg} from '../helpers/db'
Model.knex(pg);

class Video extends Model {
  static get tableName() {
    return 'tiktok.user_videos';
  }

  static get idColumn() {
    return 'video_id';
  }
}

export {Video}