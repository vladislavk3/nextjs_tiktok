
import { makeStyles } from "@material-ui/core/styles";
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Alert from '@material-ui/lab/Alert';
import PersonIcon from '@material-ui/icons/Person';
import NotificationsIcon from '@material-ui/icons/Notifications';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import {
    useSession,
    signIn,
    signout
} from 'next-auth/client'
import { useState, useEffect } from "react";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '36ch',
        backgroundColor: theme.palette.background.paper,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        color: '#FFF'
    },
    inline: {
        display: 'inline',
    },
}));

export default function AlertMenu({ session }) {
    if (session == undefined || session.accessToken == undefined) { return <React.Fragment></React.Fragment> }
    const classes = useStyles();
    const [menuData, setMenuData] = React.useState(null);
    const [alertData, setAlertData] = React.useState(null);

    const handleClick = (event) => {
        setMenuData({ target: event.currentTarget });
        //Mark notifications as seen once they open the menu
        fetch('/api/user/' + session?.user_id + '/alerts_seen',
            {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(alertData?.alerts?.map(a => a.alert_id))
            }
        ).then(() => {
            setAlertData({ alerts: alertData?.alerts?.map(a => { a.seen = true; return a }) })
        })
    };
    const handleMenuClose = () => {
        setMenuData(null);
    };

    useEffect(() => {
        async function getAlerts() {
            if (!session?.user_id) { return; }
            const alerts = await fetch('/api/user/' + session?.user_id + '/alerts').then(r => r.json());
            setAlertData({ alerts })
        }
        getAlerts()
    }, [session?.user_id])

    return (
        <>
            <IconButton onClick={handleClick} >
                <Badge edge="start" className={classes.menuButton}
                    aria-label="menu"
                    badgeContent={alertData?.alerts?.filter(a => !a.seen)?.length}
                    color="secondary">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu id="alerts-menu" anchorEl={menuData?.target} keepMounted open={Boolean(menuData?.target)}
                onClose={handleMenuClose}>
                <List className={classes.root}>
                    {alertData?.alerts?.map(alert => {
                        const created_at = new Date(alert.created_at)
                        return <React.Fragment key={alert.alert_id}>
                            <ListItem alignItems="flex-start" selected={!alert.seen}>
                                <ListItemText
                                    primary={<div dangerouslySetInnerHTML={{__html: alert.description}}/>}
                                    secondary={
                                        <>{created_at.toLocaleDateString() + ' '}
                                            {created_at.toLocaleTimeString()}</>
                                    }
                                />
                            </ListItem>
                            <Divider component="li" />
                        </React.Fragment>
                    })}
                </List>
            </Menu>
        </>
    );
}