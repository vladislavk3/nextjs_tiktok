const { Model } = require('objection')
import {pg} from '../helpers/db'
Model.knex(pg);

class User extends Model {
  static get tableName() {
    return 'tiktok_authentication.users';
  }
}

export {User}