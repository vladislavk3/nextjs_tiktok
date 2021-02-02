const fs = require('fs')
const path = require('path')

exports.seed = function(knex) {
  return;
  const directory = 'seeds/tokboard.tar/data/songs/';
  const songs = fs.readdirSync(directory).map(fileName => {
      const full_file = path.join(directory, fileName)
      const data = fs.readFileSync(full_file, 'utf8');
      try { 
      const parsed = exports.parseJson(JSON.parse(data))
      return parsed
      } catch (e){
        console.log(e)
        console.log(full_file)
      }
  }).filter(s => s.song_id)
  // Deletes ALL existing entries
  return knex('tiktok_next.tokboard_song').del()
    .then(function () {
      // Inserts seed entries
      return knex('tiktok_next.tokboard_song').insert(songs);
    });
};

exports.parseJson = function(data) {
  const plays = data.stats == undefined ? 0 : +(data.stats['0'].totalPlayCount)
  return {
    song_id: data.id,
    title: data.title,
    author: data.authorName,
    plays,
    tags: JSON.stringify(data.tags),
    peak_day: findBiggest(data.dailyStats)
  }
}

function findBiggest(dailyStats){
  if(!dailyStats) { return null; }
  const biggest_ts = dailyStats.reduce((biggest, d) => {
    return (biggest[1] > d[1]) ? biggest : d
  }, [0,0,0])[0]
  return new Date(biggest_ts * 1000)
}