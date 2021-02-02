
import { makeStyles } from "@material-ui/core/styles";
import React from 'react';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Divider } from '@material-ui/core';
import { useSession, signout } from 'next-auth/client'
import PersonIcon from '@material-ui/icons/Person';

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

export default function ProfileMenu() {
  const classes = useStyles();
  const [anchorEls, setAnchorEls] = React.useState(null);
  const [session, loading] = useSession()

  const handleMenuClose = () => {
    setAnchorEls(null);
  };

  const handleProfileClick = (event) => {
    setAnchorEls({ profile: event.currentTarget });
  };

  return (
    <>
      <IconButton edge="start" className={classes.menuButton} color="inherit"
        aria-label="menu" onClick={handleProfileClick}>
        <PersonIcon />
      </IconButton>
      <Menu id="main-menu" anchorEl={anchorEls?.profile} keepMounted open={Boolean(anchorEls?.profile)}
        onClose={handleMenuClose}>
        <MenuItem component='span'>Signed in as< br />{session.user.email}</MenuItem>
        <Divider component="li" />
        <MenuItem component='a' href='/api/checkout/portal' disabled={!session.pro}>Billing</MenuItem>
        <MenuItem component='a' href='/authenticated/profile'>Profile</MenuItem>
        <MenuItem component={Link} href='#' color="inherit" onClick={signout}>Sign out</MenuItem>
      </Menu>
    </>
  );
}