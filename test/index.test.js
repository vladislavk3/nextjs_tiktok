import { render, screen } from "@testing-library/react";
//import Home from "../pages/index";
import { validToken } from '../pages/api/user/validate_user'
import {AccountApproved} from '../models/account_approved'
const { Model } = require('objection');

var pg = require('knex')({
  client: 'pg',
  connection: process.env.DB_URL,
  searchPath: ['knex', 'public', 'tiktok', 'tiktok_authentication'],
  pool: {min: 0, idleTimeoutMillis: 1000}
});
Model.knex(pg);
class Profile extends Model {
    static get tableName() {
      return 'tiktok_next.profiles';
    }
}
beforeAll(async () => {
    await Profile.query().insert({user_id: 1, invite_code: 'ben'});
    await Profile.query().insert({user_id: 2, invite_code: 'used', max_invites: 2});
    await AccountApproved.query().insert({user_id: 3, token: 'used'});
    await AccountApproved.query().insert({user_id: 4, token: 'used'});
});
afterAll(async () => {
    await Profile.query().delete();
    await AccountApproved.query().delete();
});

describe("Home", () => {
  test("bad code", () => expect(validToken('foo').then(v => v.valid)).resolves.toBeFalsy());
  test("good code", () => expect(validToken('greensuperrice').then(v => v.valid)).resolves.toBeTruthy());
  test("database code", () => expect(validToken('ben').then(v => v.valid)).resolves.toBeTruthy());
  test("used code", () => expect(validToken('used').then(v => v.valid)).resolves.toBeFalsy());
  test("used code", () => expect(validToken('used').then(v => v.reason)).resolves.toEqual('The maximum number of people have already used that code'));
  test("fake code", () => expect(validToken('asdfsad').then(v => v.reason)).resolves.toEqual('Invalid code'));
});