const { Model } = require('objection')
import {pg} from 'helpers/db'
Model.knex(pg);

class Cookie extends Model {
  static get tableName() {
    return 'tiktok_authentication.cookies';
  }
}

export {Cookie}