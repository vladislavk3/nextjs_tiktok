import { getSession } from 'next-auth/client'

export default async (req, res) => {
  const session = await getSession({ req })
  if (!session) {
    res.statusCode = 500
    res.send(JSON.stringify({ 'error': 'not_logged_in', session: session }));
    return;
  }

  const { code } = req?.query

  res.statusCode = 200
  res.json(valid_code(code));
}

export function valid_code(code) {
  const cartesian =
  (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat()))).map(v => v.join(''))
  const clean = code?.trim()?.toLowerCase()
  if(['wavewyld', 'vegan', 
            ...cartesian(['johny', 'johnny'], ['blue', 'blu'], ['eyes'])]
            .includes(clean)) {
              return 10;
            }
  if (clean == 'famous') {
    return 5;
  }
  return false;
}
