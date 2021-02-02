import { pg } from 'helpers/db'


export default async (req, res) => {
  const start = parseInt(req.query['start'])
  const stop =  parseInt(req.query['stop'])
  for(var idx=start; idx < stop; idx++) {
    const results = await fetch('https://tikrank.com/sbox/block-result?=&country=0&year=0&sort=0&q=&sbox-block=result_influencer&page=' + idx).then(r => r.json())
    await pg('tiktok_next.top_accounts').insert({data: results})
    console.log(idx)
  }
  // const result = await pg.raw(query).then(r => r.rows)
  res.statusCode = 200
  res.json(true);
}