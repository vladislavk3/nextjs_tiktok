import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import Adapters from "next-auth/adapters"
var Url = require('url-parse');
const { Model } = require('objection');
var pg = require('knex')({
  client: 'pg',
  connection: process.env.DB_URL,
  searchPath: ['knex', 'public', 'tiktok', 'tiktok_authentication'],
  pool: { min: 0, idleTimeoutMillis: 1000 }
});
Model.knex(pg);

// Extend the built-in models using class inheritance
class User extends Adapters.TypeORM.Models.User.model {
  // You can extend the options in a model but you should not remove the base
  // properties or change the order of the built-in options on the constructor
  constructor(name, email, image, emailVerified) {
    super(name, email, image, emailVerified)
  }
}

const UserSchema = {
  name: "User",
  target: User,
  columns: {
    ...Adapters.TypeORM.Models.User.schema.columns,
    admin: {
      type: "bool",
      nullable: true,
    },
    pro: {
      type: "bool",
      nullable: true,
    },
  },
}

const UserWrapper = { model: User, schema: UserSchema }
const useSecureCookies = process.env.NEXTAUTH_URL.startsWith('https://')
const cookiePrefix = useSecureCookies ? '__Secure-' : ''
const hostName = Url(process.env.NEXTAUTH_URL).hostname
const options = {
  // Configure one or more authentication providers
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    // ...add more providers here
  ],

  // A database is optional, but required to persist accounts in a database
  adapter: Adapters.TypeORM.Adapter(
    // The first argument should be a database connection string or TypeORM config object
    process.env.DB_URL,
    // The second argument can be used to pass custom models and schemas
    {
      models: {
        User: UserWrapper
      },
    }),
  callbacks: {
    session: async (session, user, sessionToken) => {
      try {
        //if(!user || !session) { return Promise.resolve(session); }
        const affilates = []
        session.admin = user.admin || (user.email == 'xodarap00@gmail.com')
        session.affiliate = session.admin || affilates.includes(user.email)
        session.pro = user.pro
        session.user_id = user.id
        session.tt_warning = session.pro && (await userOk(user.id))
      } catch (e) {
        console.log('=== SESSION CHANGE ERROR ===')
        console.log(e)
      }
      return Promise.resolve(session)
    },
    signIn: async (user, account, profile) => {
      try {
        //first login
        if (!user?.id) { return Promise.resolve(true) }

        class AuthenticationEvent extends Model {
          static get tableName() {
            return 'tiktok_next.authentication_events';
          }
        }

        return AuthenticationEvent.query().insert({
          'user_id': user.id,
          'event': 'signin'
        }).then(() => true).catch(() => true)
      } catch (e) {
        console.log('=== LOGIN ERROR ===')
        console.log(e)
        return Promise.resolve(true);
      }
    }
  },
  pages: {
    newUser: '/authentication/new_user'
  },
  events: {
    createUser: createProfile
  },
  cookies: {
    sessionToken: 
    {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
        domain: hostName == 'localhost' ? hostName : '.' + hostName // add a . in front so that subdomains are included 
      }
    },
  },
}

async function createProfile(message) {
  const randomChoice = (arr) => arr[Math.floor(arr.length * Math.random())];
  const words = ['stretching', 'his', 'hand', 'up', 'to', 'reach', 'the', 'stars', 'too', 'often', 'man', 'forgets', 'the', 'flowers', 'at', 'his', 'feet',
    "said", "truth", "is", "that", "it", "the", "greatest", "happiness", "of", "the", "greatest", "number", "that", "the", "measure", "of", "right", "and", "wrong",
    "number", "is", "the", "foundation", "of", "morals", "and", "legislation", "age", "we", "live", "in", "a", "busy", "age", "in", "which", "knowledge", "is", "rapidly", "advancing", "towards", "perfection"].concat(
      'baby , back , bad , bag , balance , ball , band , base , basin , basket , bath , beautiful , because , bed , bee , before , behavior , belief , bell , bent , berry , between , bird , birth , bit , bite , bitter , black , blade , blood , blow , blue , board , boat , body , boiling , bone , book , boot , bottle , box , boy , brain , brake , branch , brass , bread , breath , brick , bridge , bright , broken , brother , brown , brush , bucket , building , bulb , burn , burst , business , but , butter , button , by'.split(' , ')
    ).concat(
      'cake , camera , canvas , card , care , carriage , cart , cat , cause , certain , chain , chalk , chance , change , cheap , cheese , chemical , chest , chief , chin , church , circle , clean , clear , clock , cloth , cloud , coal , coat , cold , collar , color , comb , come , comfort , committee , common , company , comparison , complete , competition , complex , condition , connection , conscious , control , cook , copper , copy , cord , cork , cotton , cough , country , cover , cow , crack , credit , crime , cruel , crush , cry , cup , current , curtain , curve , cushion , cut'.split(' , ')
    ).concat(
      'damage , danger , dark , daughter , day , dead , dear , death , debt , decision , deep , degree , delicate , dependent , design , desire , destruction , detail , development , different , digestion , direction , dirty , discovery , discussion , disease , disgust , distance , distribution , division , do , dog , door , doubt , down , drain , drawer , dress , drink , driving , drop , dry , dust'.split(' , ')
    ).concat(
      'ear , early , earth , east , edge , education , effect , egg , elastic , electric , end , engine , enough , equal , error , even , event , ever , every , example , exchange , existence , expansion , experience , expert , eye'.split(' , ')
    ).concat(
      'face , fact , fall , false , family , far , farm , fat , father , fear , feather , feeble , feeling , female , fertile , fiction , field , fight , finger , fire , first , fish , fixed , flag , flame , flat , flight , floor , flower , fly , fold , food , foolish , foot , for , force , fork , form , forward , fowl , frame , free , frequent , friend , from , front , fruit , full , future'.split(' , ')
    )
  const invite_code = randomChoice(words) + randomChoice(words) + randomChoice(words)
  await pg.raw(`insert into tiktok_next.profiles(
    user_id, email, name, invite_code)
    VALUES (?, ?, ?, ?)
    on conflict do nothing`,
    [message.id, message.email, message.name, invite_code])
}

async function userOk(user_id) {
  var pg = require('knex')({
    client: 'pg',
    connection: process.env.DB_URL,
    searchPath: ['knex', 'public', 'tiktok', 'tiktok_authentication'],
    pool: { min: 0, idleTimeoutMillis: 1000 }
  });

  const res = await pg.raw(`
      select tiktok_username
      from  tiktok_next.profiles
      where user_id = (?)`, [user_id]).then(r => r.rows)
  const found = res && (res.length > 0) && (!!res[0]['tiktok_username'])
  return !found
}

export default (req, res) => NextAuth(req, res, options)
