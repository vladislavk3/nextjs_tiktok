import GridItem from "components/dashboard/Grid/GridItem.js";
import GridContainer from "components/dashboard/Grid/GridContainer.js";
import { getSession } from 'next-auth/client'
import Instructions from 'components/insights/instructions'
import { Link, Container, Typography } from "@material-ui/core";
import BenTable from 'components/benTable'
import { makeStyles } from '@material-ui/core/styles';
import Error from 'components/error'
import { useState, useEffect } from "react";
import InsightsErrorHandler from 'components/insights/insights_error_handler'
import { insightsAuthentication } from 'helpers/auth'
import { pg } from 'helpers/db'


const useStyles = makeStyles((theme) => ({
  firstHero: {
    marginTop: '50px'
  }
}));

export default function FollowerSourcing({ name, authenticated }) {
  if(!authenticated.valid) return <InsightsErrorHandler error={authenticated} />
  const classes = useStyles();
  const [videos, setVideos] = useState();
  const getVideos = async () => {
    const results = await fetch('/api/tiktok_user/' + name + '/follower_sourcing').then(r => r.json())
    setVideos(results)
  }
  useEffect(() => {
    getVideos()
  }, [])

  return (<React.Fragment>
    <GridContainer justify='center'>
      <GridItem xs={12} sm={12} lg={8}>
        {/*
                TODO
                <UserOverview summary={summary}  name={name} authorStats={author}/>
                */}
      </GridItem>
    </GridContainer>
    <Container maxWidth="md" justify='center' className={classes.firstHero} >
      <Typography component="h2" variant="h2" align="center" color="textPrimary" gutterBottom >Follower Sourcing</Typography>
      <Typography component="p" variant="body1" align="center" color="textPrimary" gutterBottom >
        This page displays the five videos which accumulated you the most followers each day.
        Please note that the algorithm is not retroactive, i.e. results can only be calculated for days which insights have been fetched.
            </Typography>
      <Typography component="p" variant="body1" align="center" color="textPrimary" gutterBottom >
        This algorithm works by estimating followers based on non-follower views. As such, it requires the Insights extension, in order
        to identify which views came from existing followers.
            </Typography>
    </Container>
    <GridContainer justify="center">
      {(videos?.length == 0) &&
        <Typography component="p" variant="h5" align="center" color="textPrimary" gutterBottom >
          We aren't able to  find any data for this account. Have you used the insights plug-in for at least two days?
                </Typography>}
      {(!videos || videos?.length > 0) &&
        <BenTable data={videos} keyFieldFunction={r => r.video_id + r.Date}
          formatFunction={columnFormatter(name)}
          hiddenColumns={['video_id']} />}
    </GridContainer>
  </React.Fragment>
  )
}

export async function getServerSideProps(context) {
  return await insightsAuthentication(pg, context)
}

const columnFormatter = username => columnName => {
  if (columnName == 'Caption') {
    return (v, r) => <Link href={'https://www.tiktok.com/@' + username + '/video/' + r?.video_id}>{v || '[no caption]'}</Link>
  }
  if (columnName == 'Date') {
    return (v) => (new Date(v)).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })
  }
  return (v) => {
    if (Number.isInteger(v)) {
      return v.toLocaleString();
    } else {
      return v;
    }
  }
}