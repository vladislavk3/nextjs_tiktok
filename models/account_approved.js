const { Model } = require('objection')
import {pg} from '../helpers/db'
Model.knex(pg);

class AccountApproved extends Model {
  static get tableName() {
    return 'tiktok_next.account_approved';
  }
}

export {AccountApproved}