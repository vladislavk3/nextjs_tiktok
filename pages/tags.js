import BootstrapTable from 'react-bootstrap-table-next';
import GridItem from "components/dashboard/Grid/GridItem.js";
import GridContainer from "components/dashboard/Grid/GridContainer.js";
import BenTable from 'components/benTable'

var pg = require('knex')({
  client: 'pg',
  connection: process.env.DB_URL,
  searchPath: ['knex', 'public', 'tiktok'],
  pool: { min: 0, idleTimeoutMillis: 1000 }
});

export default function Tags({ stats }) {
  const names = {
    'name': 'Tag Name',
    'estimated_mean': 'Estimated True Mean Views',
    'actual_average': 'Average Views',
    'actual_video_count': 'Number of Videos with Tag'
  }

  const renamed = stats.map(r => {
    return Object.keys(names).map(name => [names[name], r[name]]).reduce((ac, r) => {
      ac[r[0]] = r[1]
      return ac
    }, {})
  })
  
  return <div className="container">
    <Intro />
    <BenTable data={renamed} keyField='name'
      formatFunction={columnFormatter} />
  </div>
}


const columnFormatter = (columnName) => {
  if (columnName == 'Tag Name') {
    return (v) => (<a href={`/tag/${v}`}>{v}</a>)
  }
  return (v) => {
    return (+v).toLocaleString(undefined, { maximumFractionDigits: 0 });
  }
}

function Intro() {
  return (
    <GridContainer justify='center'>
      <GridItem xs={8} sm={8} lg={8}>
        <h1>Most Successful Tags</h1>
        <p>This page lists tags ordered by an estimate of the average number of views videos in that tag get.</p>
        <p>Note this is not simply looking at the observed average number of views, because that list would be dominated by tags which have only been used once or twice but got a lot of views when they were used.
            Instead, this considers how many times the tag has been used when deciding how much to "trust" the average number. (Technically, it does a Bayesian update, modeling views as lognormally distributed.)</p>
      </GridItem>
    </GridContainer>
  )
}

const query = `
  with global_stats as (
  select avg(average_views) global_average, variance(average_views) global_variance
    from
    (
      select log(nullif((view_count / nullif(video_count,0)), 0)) average_views
      from tiktok.tag_data
    ) q
  )
  select name, power(10, new_mean) estimated_mean, actual_average, actual_video_count
  from (
    select name,
      (1 / ((1 / global_variance) + (video_count / global_variance))) * 
      ((global_average / global_variance) + (average_views * video_count) / global_variance) new_mean,  
    actual_average, 
    actual_video_count
    from (
      select log(nullif(view_count / nullif(video_count,0), 0)) average_views, view_count, video_count / 50000 video_count, name,
        view_count / nullif(video_count,0) actual_average, video_count actual_video_count
      from (select *, row_number() over (partition by name order by fetch_time desc) rn from tiktok.tag_data) t
      where video_count is not null
      and video_count != 0
      and t.rn = 1
    ) vd
    inner join global_stats on true
  ) q
  order by (2) desc  nulls last
  limit 25
`
export async function getServerSideProps({ params }) {
  const r = await pg.raw(query)
  var stats = r.rows
  return {
    props: { stats }, // will be passed to the page component as props
  }
}