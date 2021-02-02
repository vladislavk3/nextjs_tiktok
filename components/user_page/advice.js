import ErrorIcon from '@material-ui/icons/Error';
import BenTable from 'components/benTable'
import Container from '@material-ui/core/Container';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { green } from '@material-ui/core/colors';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import { sum } from 'mathjs'
import { Link } from '@material-ui/core';

export default function Advice({ advice, pro, name }) {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-14 center-input">
            <Typography variant="h4">Automated Advice</Typography>
          </div>
        </div>

      </div>
      <Container maxWidth="md" component="main">
        <BenTable data={createAdvice(advice, name)}
          keyField='zzBenKeyField'
          formatFunction={formatterPro(pro)}
          hideDownload
          headerFormatter={k => k.text} />
      </Container>
    </>
  )
}

const createAdvice = (advice, name) => {
  if(!advice) return []

  return Object.keys(advices).map(k => {
    return {
      ...advices[k](advice.filter(x => x.attribute == k)[0], name),
      zzBenKeyField: k
    }
  })
}

const significance_text = (data) => {
  const significant_link = <a href="https://en.wikipedia.org/wiki/Statistical_significance">signficant</a>
  const details = <span>
    (One-way ANOVA F = {data?.value?.f?.toLocaleString() || 'N/A'}
      , data log-transformed)
    </span>

  if (data.value.f > 5.15) return <span> This difference would generally be considered {significant_link} {details} </span>
  if (sum(data.value.details.map(x => x.count)) < 90) return <span> There is not enough data to tell if this difference is {significant_link} {details} </span>
  return <span> However, this difference is not {significant_link} {details} </span>
}

const advices = {
  tag: (_data, name) => (
    {
      '': 'idea',
      'Message': <Typography><strong>Tag Advice.</strong> See which of your tags are most successful. <Link href={"/user/" + name + "/tag_advice"}>View tag advice</Link>.</Typography>
    }
  ),
  followers: () => (
    {
      '': 'idea',
      'Message': <Typography><strong>Follower Attribution</strong>. See which videos are driving new followers. <Link href={"/user/follower_sourcing_redirect"}>View follower attribution</Link>.</Typography>
    }
  ),
  insights: () => (
    {
      '': 'idea',
      'Message': <Typography><strong>Insight Analytics</strong>. See where your views are coming from, watch time, and more. <Link href={"/authenticated/insight_link"}>View insights</Link>.</Typography>
    }
  ),
  avg_sound_lag: (data) => {
    if (data.value.avg_lag > 0) {
      return {
        '': 'bad',
        'Message': <Typography>You have {data.value.n} video(s) which used popular sounds, and they were
                used an average of {data.value.avg_lag?.toLocaleString(undefined, { maximumFractionDigits: 0 })} days after they hit peak popularity.
                To get ahead of trends more quickly, consider using <a href="https://www.tokboard.com">TokBoard</a>.
                </Typography>
      }
    } else {
      return {
        '': 'good',
        'Message': <Typography>You have {data.value.n} video(s) which used popular sounds, and they were
                used an average of {data.value.avg_lag} days before they hit peak popularity.
                Nice job!</Typography>
      }
    }
  },

  fyp: (data) => {
    if (data.value.n > 0) {
      return {
        '': 'bad',
        'Message': <Typography>You have {data.value.n} video(s) which used tags like #fyp or #xyzabc.
                      These tags aren't very helpful and should be avoided.</Typography>
      }
    } else {
      return {
        '': 'good',
        'Message': <Typography>You don't have any video(s) which used tags like #fyp or #xyzabc. Nice job!</Typography>
      }
    }
  },

  video_too_short: (data) => {
    if (data.value.n > 0) {
      return {
        '': 'bad',
        'Message': <Typography>You have {data.value.n} video(s) which were shorter than five seconds.
                      These videos will not be shown on the FYP, and should be avoided
                      unless you are trying to create videos that only your followers can see.</Typography>
      }
    } else {
      return {
        '': 'good',
        'Message': <Typography>You don't have any video(s) which were shorter than five seconds.
        These videos will not be shown on the FYP, and should be avoided
      unless you are trying to create videos that only your followers can see. Nice job!</Typography>
      }
    }
  },

  optimal_duration: (data, name) => {
    if(!data) return {
      '': 'idea',
      'Message': 'Optimal duration: no data'
    }

    const best = data.value.details.sort((x, y) => y.average_views - x.average_views)[0]
    const duration_definitions = { 'short': '5-20', 'medium': '20-40', 'long': '40-60' }
    return {
      '': 'idea',
      'Message': <div>
        <Typography gutterBottom>
          Your best-performing videos are of <strong>{best.duration_category} duration
          ({duration_definitions[best.duration_category]} seconds).</strong>
          {significance_text(data, name)}.
        </Typography>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Duration</TableCell>
                <TableCell># Videos</TableCell>
                <TableCell>Average Views</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(duration_definitions).map(duration => {
                const r = data.value.details.filter(x => x.duration_category == duration)[0]
                return <TableRow key={duration}>
                  <TableCell>
                    <span style={{ textTransform: 'capitalize' }}>{duration}</span> ({duration_definitions[duration]} seconds)
                      </TableCell>
                  <TableCell>
                    {r === undefined ? 0 : r.count.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {r === undefined ? 'N/A' : r.average_views.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </TableCell>
                </TableRow>
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    }
  },

  optimal_time: (data) => {
    if(!data?.value?.details) return {
      '': 'idea',
      'Message': 'Optimal time: no data'
    }
    const best = data.value.details.sort((x, y) => y.average_views - x.average_views)[0]
    if(!best.time_category) return {
      '': 'idea',
      'Message': 'Optimal time: no data'
    }
    const time_windows = [('0-4'), ('4-8'), ('8-12'), ('12-16'), ('16-20'), ('20-24')]
    const current_time_zone = new Date().toLocaleTimeString(undefined, { timeZoneName: 'short' }).split(' ')[2]
    /*
    const translate = (x) => (new Date(Date.UTC(0,0,0, x))).getHours()
    const sort_by_local = (x, y) => translate(x.split('-')[0]) - translate(y.split('-')[0]) 
    */
    const translate_time = (v) => {
      const hours = v.split('-')
      return <span>{hours[0]}:00-{hours[1]}:00 {current_time_zone}</span>
      /*
      TikTok claims the times are in UTC but they actually seem to be in local time?
      return <span>{translate(hours[0])}:00-{translate(hours[1])}:00 {current_time_zone} ({v} UTC)</span>
      */
    }
    return {
      '': 'idea',
      'Message': <div>
        <Typography gutterBottom>
          Your best-performing videos are during the <strong>{translate_time(best.time_category)} time block</strong>.
          {significance_text(data)}.
        </Typography>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Time of Day</TableCell>
                <TableCell># Videos</TableCell>
                <TableCell>Average Views</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {time_windows.map(time => {
                const r = data.value.details.filter(x => x.time_category == time)[0]
                return <TableRow key={time}>
                  <TableCell>
                    <span >{translate_time(time)}</span>
                  </TableCell>
                  <TableCell>
                    {r === undefined ? 0 : r.count.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {r === undefined ? 'N/A' : r.average_views.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </TableCell>
                </TableRow>
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    }
  },
}

function formatterPro(pro) {
  if (pro) { return columnFormatter; }

  const publicAdvice = (k) => ['tag', 'followers', 'insights'].includes(k)

  return (columnName) => {
    if (columnName == '') {
      return (v, r) => publicAdvice(r['zzBenKeyField']) ? <TrendingUpIcon color="primary" /> : <ErrorIcon color="error" /> 
    }
    return (v, r) => {
      if (r['zzBenKeyField'] == 'tag') return v;
      if (publicAdvice(r['zzBenKeyField'])) return <span>{v} <i>Only available to <Link href="/upgrade">pro users</Link>.</i></span>;
      let category;
      switch (r['zzBenKeyField']) {
        case 'avg_sound_lag': category = 'Trending Sound Usage'; break;
        case 'fyp': category = 'FYP Tag Usage'; break;
        case 'video_too_short': category = '5 Second Rule Violations'; break;
        case 'optimal_duration': category = 'Best Video Duration'; break;
        case 'optimal_time': category = 'Best Time of Day'; break;
      }
      return <>
        <Typography variant="body1"><strong>{category}</strong>: <Typography variant="body1" component="span" style={{ color: '#999' }}>
          <i>Advice is only available to <Link href="/upgrade">pro users</Link>.</i></Typography></Typography>
      </>
    }
  }
}

const columnFormatter = (columnName) => {
  if (columnName == '') {
    return (v) => {
      if (v === 'bad') return <ErrorIcon color="error" />
      if (v === 'good') return <CheckCircleIcon style={{ color: green[500] }} />
      return <TrendingUpIcon color="primary" />
    }
  }
  return (v) => v
}