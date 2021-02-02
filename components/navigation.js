
import { makeStyles } from "@material-ui/core/styles";
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Alert from '@material-ui/lab/Alert';
import { Divider } from '@material-ui/core';
import { useSession, signIn } from 'next-auth/client'
import AlertMenu from 'components/navigation/alerts'
import ProfileMenu from 'components/navigation/profile_menu'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  dividerFullWidth: {
    margin: `5px 0 0 ${theme.spacing(2)}px`,
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  const [anchorEls, setAnchorEls] = React.useState(null);
  const [session, loading] = useSession()

  const handleBurgerClick = (event) => {
    setAnchorEls({ burger: event.currentTarget });
  };
  const handleMenuClose = () => {
    setAnchorEls(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={handleBurgerClick}>
            <MenuIcon />
          </IconButton>
          <Menu id="main-menu" anchorEl={anchorEls?.burger} keepMounted open={Boolean(anchorEls?.burger)}
            onClose={handleMenuClose}>
            <MenuItem component='a' href='/tags'>Top Tags</MenuItem>
            <MenuItem component='a' href='/trends'>View Trends</MenuItem>
            <RequiresLogin session={session} classes={classes} />

            <Divider component="li" />
            <Typography className={classes.dividerFullWidth} color="textSecondary" display="block" variant="caption">External Links </Typography>

            <MenuItem component='a' href='https://www.tiktokodds.com'>Blog</MenuItem>
            <MenuItem component='a' href='http://checkhisheight.com/'>Check His Height</MenuItem>
            <MenuItem component='a' href='/#contact'>Contact</MenuItem>
          </Menu>

          <Typography variant="h6" className={classes.title}>
            <Link color="textSecondary" href="/" id="topNavLink">Stats Check LOL</Link>
          </Typography>
          {!session && <>
            Not signed in <br />
            <Button color="inherit" onClick={() => signIn()}>Sign in</Button>
          </>}
          {session && <>
            <AlertMenu session={session} />
            <ProfileMenu />
          </>} 
        </Toolbar>
      </AppBar>
      {session?.tt_warning && <Alert severity="warning">You signed up for a pro account but have not associated a TikTok username. The daily dashboard won't work until you do.
        Please associate a TikTok username with this account <Link href="/authenticated/profile">in your profile</Link>.</Alert>}
        {/* <Alert severity="warning">TikTok has been having intermittent outages on their site today. SCL data still works, but while TikTok is down requests for new data may not go through. Thank you for your patience.</Alert> */}
    </div>
  );
}

function RequiresLogin({ session, classes }) {
  if (session == undefined || session.accessToken == undefined) { return <React.Fragment></React.Fragment> }
  return <React.Fragment>
    <MenuItem component='a' href='/authenticated/profile'>Profile</MenuItem>

    <Divider component="li" />
    <Typography className={classes.dividerFullWidth} color="textSecondary" display="block" variant="caption">Pro Features </Typography>
    {!session.pro && <MenuItem component='a' href='/upgrade'>Upgrade</MenuItem>}
    <MenuItem component='a' href='/user/user_overview_redirect'>Advice and Overview</MenuItem>
    <MenuItem component='a' href='/authenticated/insight_link'>Insights</MenuItem>
    <MenuItem component='a' href='/user/daily_dashboard_redirect' disabled={!session.pro}>Daily Dashboard</MenuItem>
    <MenuItem component='a' href='/user/follower_sourcing_redirect' disabled={!session.pro}>Follower Sourcing</MenuItem>
    <MenuItem component='a' href='/user/week_in_review_redirect' disabled={!session.pro}>Week In Review</MenuItem>
    <MenuItem component='a' href='/user/famous_followers_redirect' disabled={!session.pro}>Famous Followers (beta)</MenuItem>
    {session.admin && <RequiresAdmin />}
  </React.Fragment>
}

function RequiresAdmin() {
  return <>
    <MenuItem component='a' href='/admin/admin'>Admin</MenuItem>
    <MenuItem component='a' href='/admin/pro_users'>Pro Users</MenuItem>
    <MenuItem component='a' href='/admin/user_sourcing'>User Sourcing</MenuItem>
    <MenuItem component='a' href='/admin/last_night_errors'>Last Night Errors</MenuItem>
  </>
}