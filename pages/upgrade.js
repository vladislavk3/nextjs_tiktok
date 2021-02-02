import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/StarBorder';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ConfirmationModal from '../components/upgrade/confirmation_modal';
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
  darkRow: {
    width: '100%',
    background: 'radial-gradient(ellipse at center,#585858 0,#232323 100%)',
    color: '#FFF'
  },
  darkRowText: {
    color: 'rgba(255, 255, 255,0.76)'
  },
  darkRowHeader: {
    color: '#FFF'
  },
  sshot: {
    borderRadius: '7px',
    width: '100%'
  },
  firstHero: {
    width: '100vw',
    height: '80vh',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  darkLink: {
    color: '#FFF'
  }
}));

export default function Pricing() {
  const classes = useStyles();
  const [modal, setModal] = useState(false);

  return (
    <React.Fragment>
      <Container component="main" className={classes.heroContent + ' ' + classes.firstHero}>
        <Typography component="h1" variant="h1" align="center" color="textPrimary" gutterBottom>
          Pro Account
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" component="p">
          Take your TikTok success to the next level
        </Typography>
      </Container>

      <div className={classes.darkRow}>
        <Container maxWidth="lg" component="main" className={classes.heroContent}>
          <Grid container spacing={4}>
            <Grid container item xs={12} lg={7}>
              <img src="/img/followers_sourcing.PNG" className={classes.sshot} />
            </Grid>
            <Grid container item xs={12} lg={4} justify="center">
              <Typography component="h3" variant="h3" align="center" >
                Which videos are your followers coming from?
            </Typography>
              <Typography variant="body1" align="center" component="p">
                Follower sourcing estimates the number of followers coming from each video.
            </Typography>
            </Grid>
          </Grid>
        </Container>
      </div>

      <div className={''}>
        <Container maxWidth="lg" component="main" className={classes.heroContent}>
          <Grid container spacing={4}>
            <Grid container item xs={12} lg={4} justify="center">
              <Typography component="h3" variant="h3" align="center">
                How many views did you get last night?
            </Typography>
              <Typography variant="body1" align="center" component="p">
                Daily dashboards keep you up-to-date and on target for your goals.
            </Typography>
            </Grid>
            <Grid container item xs={12} lg={7}>
              <img src="/img/db_overview.png" className={classes.sshot} />
            </Grid>
          </Grid>
        </Container>
      </div>


      <div className={classes.darkRow}>
        <Container maxWidth="lg" component="main" className={classes.heroContent}>
          <Grid container>
            <Grid container item xs={12} lg={7}>
              <img src="/img/daily_video_list.png" className={classes.sshot} />
            </Grid>
            <Grid container item xs={12} lg={4} justify="center">
              <Typography variant="h3" align="center" component="h3">
                Is that video from last month trending again?
        </Typography>
              <Typography variant="body1" align="center" component="p">
                Recent TikTok algorithm changes mean that older videos are more frequently put into rotation. No longer
                are you able to just track the performance of your most recent few videos – the majority of your views may
                becoming from videos that are weeks or even months old.
        </Typography>
              <Typography variant="body1" align="center" component="p">
                Pro accounts solve this with a daily dashboard showing how many views each of your 100 most recent videos have received
                in the past day. A live example can be
          found <Link href="/user/charlidamelio/daily_dashboard">here</Link>.
        </Typography>
            </Grid>
          </Grid>
        </Container>
      </div>

      <div className={''}>
        <Container maxWidth="lg" component="main" className={classes.heroContent}>
          <Grid container spacing={4}>
            <Grid container item xs={12} lg={7} justify="center">
              <Typography variant="h4" align="center" component="h4">What's the #1 most important metric for the recommendation algorithm?</Typography>
              <Typography variant="h4" align="center" component="h4">Watch Time</Typography>
              <Typography variant="p" align="center" component="p">
                The Pro Insights browser extension pulls watch time, letting you track this key metric on a daily basis.
            </Typography>
            </Grid>
            <Grid container item xs={12} lg={4}>
              <img src="/img/watch_time.png" className={classes.sshot} />
            </Grid>
          </Grid>
        </Container>
      </div>

      <div className={classes.darkRow}>
        <Container maxWidth="lg" component="main" className={classes.heroContent}>
          <Grid container>
            <Grid container item xs={12} lg={7}>
              <img src="/img/insights_table.png" className={classes.sshot} /></Grid>
            <Grid container item xs={12} lg={4} justify="center">
              <Typography variant="h2" align="center" component="h2">Do you know where your views are coming from?</Typography>
              <Typography variant="p" align="center" component="p">
                Are your views coming from the For You Page? Hashtags? Sounds? With the Pro Insights browser extension
                you can pull all this data on a per-video basis, letting you precisely identify the source of your success.
        </Typography>
            </Grid>
          </Grid>
        </Container>
      </div>

      <div className={''}>
        <Container maxWidth="sm" component="main" className={classes.heroContent}>
          <Typography component="h2" variant="h2" align="center" gutterBottom>
            All Profits go to Charity
        </Typography>
          <Typography variant="p" align="center" component="p">
            As with all my projects, all profits are donated, mostly to <Link href="https://www.effectivealtruism.org/" >effective altruism</Link> charities.
        </Typography>
        </Container>
      </div>

      {/* Hero unit */}
      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          Pricing
        </Typography>
      </Container>
      {/* End hero unit */}

      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardHeader
                title="Free"
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                className={classes.cardHeader}
              />
              <CardContent>
                <div className={classes.cardPricing}>
                  <Typography component="h2" variant="h3" color="textPrimary">
                    $0
                    </Typography>
                  <Typography variant="h6" color="textSecondary">
                    /mo
                    </Typography>
                </div>
                <ul>
                  {[
                    'Fetch 10 videos for any user',
                    'Tag advice',
                    'Tag synonyms',
                    'Top tags',
                    'TikTok-wide view trends'
                  ].map(v =>
                    <Typography component="li" variant="subtitle1" align="center" key={v}>{v}</Typography>
                  )}
                </ul>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardHeader
                title="Pro"
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                subheader="For Power Users"
                action={<StarIcon />}
                className={classes.cardHeader}
              />
              <CardContent>
                <div className={classes.cardPricing}>
                  <Typography component="h2" variant="h3" color="textPrimary">
                    $29.99
                    </Typography>
                  <Typography variant="h6" color="textSecondary">
                    /mo
                    </Typography>
                </div>
                <ul>
                  {[
                    'Fetch 500 videos for any user',
                    'Tag advice',
                    'Sound advice',
                    'Duration advice',
                    'Time of day advice',
                    'Automatic daily fetch',
                    'Tag synonyms',
                    'Top tags',
                    'TikTok-wide view trends',
                    'Insights extension',
                    'Daily dashboard',
                    'Follower sourcing',
                    'Week in Review',
                    'Famous Followers',
                    'Weekly email'
                  ].map(v =>
                    <Typography component="li" variant="subtitle1" align="center" key={v}>{v}</Typography>
                  )}
                </ul>
              </CardContent>
              <CardActions>
                <Button fullWidth variant='contained' color="primary" href='#' onClick={() => setModal(true)}>
                  Get started
                  </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={12} md={4}>
            <Card>
              <CardHeader
                title="Enterprise"
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                className={classes.cardHeader}
              />
              <CardContent>
                <div className={classes.cardPricing}>
                  <Typography component="h2" variant="h3" color="textPrimary">
                    Custom
                    </Typography>
                </div>
                <ul>
                  <Typography component="li" variant="subtitle1" align="center">If there's  something special you would like, please feel free to contact us</Typography>
                </ul>
              </CardContent>
              <CardActions>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <ConfirmationModal open={modal} handleClose={() => setModal(false)} />
    </React.Fragment>
  );
}