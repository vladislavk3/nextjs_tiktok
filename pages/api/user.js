// todo: delete this file

export default async (req, res) => {
    const name = req.query['name']
    const user_res = await fetch(`${process.env.API_USER}name=${name}`)
    const videos = await user_res.json()
    const tag_res = await fetch(`${process.env.API_TAG}author=${name}`)
    const tags = await tag_res.json()

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ videos, tags, name }))
}