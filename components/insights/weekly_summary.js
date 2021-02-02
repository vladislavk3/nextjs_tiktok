import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/nextjs-material-dashboard/views/dashboardStyle.js";
import { Link, Typography } from "@material-ui/core";
import VideocamIcon from '@material-ui/icons/Videocam';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import { sum } from "mathjs";
import Plot from 'components/plot'
import Grid from "@material-ui/core/Grid";
import BenTable from 'components/benTable'

const useStyles = makeStyles(styles);

function safeMax(h, k) {
  const goodInteger = (i) => Number.isInteger(i) ? i : parseInt(i);
  if (h == undefined || h.length == 0) return {}
  var biggest = h.reduce((m, v) => { return goodInteger(m[k]) < goodInteger(v[k]) ? v : m })
  return {
    ...biggest,
    'pretty_value': (goodInteger(biggest[k])).toLocaleString(undefined, { maximumFractionDigits: 0 }),
    'pretty_date': (new Date(biggest['Date'])).toLocaleDateString()
  }
}

// Used by both email and browser weekly summary
export function generate_summary({ name, history, videos, followers }) {
  const lastWeekDate = new Date(Date.now() - 604800000)
  // const videosThisWeek = videos.results.filter(v => new Date(v['Create Date']) >= lastWeekDate)
  const lastWeek = history.filter(v => new Date(v['Date']) >= lastWeekDate)
  const totalNewFollowers = lastWeek.length > 0 ? (lastWeek[0]['Followers'] - lastWeek[lastWeek.length - 1]['Followers']).toLocaleString(undefined, { maximumFractionDigits: 0 }) : undefined
  const totalViews = (sum(lastWeek.map(v => v['Video Views']))).toLocaleString(undefined, { maximumFractionDigits: 0 })
  const bestVideo = safeMax(videos, 'views')
  const bestFollowerVideo = safeMax(followers, 'Estimated New Followers Generated')
  const mostLikes = videos.sort((a, b) => b['likes'] - a['likes']).slice(0, 3)
  const mostShares = videos.sort((a, b) => b['shares'] - a['shares']).slice(0, 3)
  const mostComments = videos.sort((a, b) => b['comments'] - a['comments']).slice(0, 3)
  const mostViews = videos.sort((a, b) => b['views'] - a['views']).slice(0, 3)

  return {
    totalNewFollowers, totalViews,
    bestVideo,
    bestFollowerVideo
    , mostLikes
    , mostShares
    , mostComments
    , mostViews
  }
}

function createList({ name, totalNewFollowers, totalViews,
  bestVideo,
  bestFollowerVideo }) {
  if (!bestVideo) return [];
  return [
    { key: 'new followers', icon: <PersonAddIcon />, content: "You gained " + totalNewFollowers + " new followers." },
    { key: 'new views', icon: <VideocamIcon />, content: "Your videos had " + totalViews + " total views." },
    {
      key: 'new Most', icon: <TrendingUpIcon />, content: <span>Your most-viewed video in the last week was <Link href={'https://www.tiktok.com/@' + name + '/video/' + bestVideo['video_id']}>{bestVideo['description'] || '(untitled)'}</Link>.
              It had {bestVideo['pretty_value']} total views. (Keep in mind that many of your views may come from videos created more than one week ago.)</span>
    },
    {
      key: 'new Most followers', icon: <TrendingUpIcon />, content: bestFollowerVideo['Estimated New Followers Generated'] ?
        <span>The video we think got you the most followers in the last week
              was <Link href={'https://www.tiktok.com/@' + name + '/video/' + bestFollowerVideo['video_id']}>{bestFollowerVideo['Caption'] || '(untitled)'}</Link>.
              We estimate that you received {bestFollowerVideo['Estimated New Followers Generated'].toLocaleString(undefined, { maximumFractionDigits: 0 })} new followers from it.
              See <Link href={'/user/' + name + '/follower_sourcing'}>follower sourcing</Link> for more.</span>
        :
        <span>No follower data available</span>
    },

  ]
}

const formatFunction = (username) => (k) => {
  if (k=='data') return BenTable.numberFormatter(true);
  return BenTable.linkFormatter(username);
}

export default function WeeklySummary({ name, history, videos, followers }) {
  if (!history || !videos || !followers) { return <></> }
  const classes = useStyles();
  const summary = generate_summary({ name, history, videos, followers })
  return (
    <>
      <Grid container>
        <Grid item xs={12} lg={6}>
          <Typography variant="h3">Week in Review</Typography>
          <List component="nav" aria-label="main mailbox folders">
            {createList({name, ...summary}).map(item =>
              <ListItem key={item.key}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.content} />
              </ListItem>)}
          </List>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Plot results={history} xChoice="Date" yChoice="New Followers" plotType='bar' />
        </Grid>
      </Grid>
      <Grid container>
        {['Views', 'Comments', 'Shares', 'Likes'].map(t => {
          const translation = {
            'Views': 'Viewed', 'Comments': 'Commented', 'Shares': 'Shared', 'Likes': 'Liked'
          }
          const relevant = summary['most' + t].map(v => ({
            video_id: v.video_id,
            description: v.description,
            'data': v[t.toLowerCase()]
          }))
          return <Grid item key={t} item xs={12} lg={6}>
            <Typography variant="h4">Most {translation[t]}</Typography>
            <BenTable data={relevant} keyField='video_id' hiddenColumns={['video_id']}
              formatFunction={formatFunction(name)} hideDownload
              headerFormatter={(k) => k.text == 'data' ? t : '' }
              justify='left'/>
          </Grid>
        }
        )}
      </Grid>
    </>
  )
}