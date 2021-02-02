import FormControl from '@material-ui/core/FormControl';
import {TextField, Container} from '@material-ui/core';
import {List, ListItem, ListItemText, FormControlLabel, Switch, Button   } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import GridItem from "components/dashboard/Grid/GridItem.js";
import GridContainer from "components/dashboard/Grid/GridContainer.js";
import { useState,useEffect } from "react";
import {  getSession} from 'next-auth/client'
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import BenTable from 'components/benTable'

const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
    typography: {
        padding: theme.spacing(2),
    },
    invitedHolder: {
        textAlign: 'center',
        marginTop: '30px',
        overflow: 'auto'
    }
  }));


var pg = require('knex')({
    client: 'pg',
    connection: process.env.DB_URL,
    searchPath: ['knex', 'public', 'tiktok', 'tiktok_authentication'],
    pool: {min: 0, idleTimeoutMillis: 1000}
});

export default function User( {profile }) {
  const classes = useStyles();
    if(!profile) { return <Error/>}
  const [state, set_state] = React.useState({...profile, open: false })
  const handleLocal = (e) => handleSubmit(state, set_state, e)
  const change = (n) => (e) => set_state({...state, [n]: e.target.value})
  const buttonReference = React.useRef();
  return (
      <>
    <GridContainer justify='center'>
        <form className={classes.root} noValidate autoComplete="off" onSubmit={handleLocal}> 
            <GridItem xs={12} sm={12} lg={8}><TextField label="User ID" defaultValue={state.user_id} onChange={change('user_id')} style={{display: 'none'}}/></GridItem>
            <GridItem xs={12} sm={12} lg={8}><TextField label="Email Address" defaultValue={state.email} onChange={change('email')} /></GridItem>
            <GridItem xs={12} sm={12} lg={8}><TextField label="Name" defaultValue={state.name} onChange={change('name')} /></GridItem>
            <GridItem xs={12} sm={12} lg={8}><TextField label="TikTok Username" defaultValue={state.tiktok_username} onChange={change('tiktok_username')} /></GridItem>
            <GridItem xs={12} sm={12} lg={8}>
                <FormControlLabel
                    control={<Switch checked={state.receive_emails} name="receive_emails" color="primary"
                                onChange={(e) => set_state({receive_emails: e.target.checked})} />}
                    label="Receive email notifications" />
            </GridItem>
            <GridItem xs={12} sm={12} lg={8}><Button variant="contained" color="primary" type="submit" ref={buttonReference}>Save</Button></GridItem>
            <Popover open={state.open} anchorEl={buttonReference.current} anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
                    transformOrigin={{ vertical: 'top',  horizontal: 'center', }}>
                <Typography className={classes.typography}>Profile changes saved.</Typography>
            </Popover>
        </form>
    </GridContainer>    
    </>
  )
}

const Error = () => {
    return (
    <GridContainer justify='center'><GridItem xs={5} sm={4} lg={4}>
        <h2>Error: you are not currently signed in. Please log in first.</h2>
    </GridItem></GridContainer>
    )
}

export async function getServerSideProps({ params, req }) {
    const session = await getSession({ req })
    if(!session || !(session.user_id)) { return { props: {} } }

    const profile = await pg.raw(`
        select tiktok_username, email, receive_emails, name, user_id, invite_code, max_invites, used
        from tiktok_next.profiles 
        inner join tiktok_authentication.sessions using (user_id)
        left join (select token, count(1) used from tiktok_next.account_approved group by token) q on q.token = profiles.invite_code
        where access_token = (?)`, [session.accessToken]).then(r => r.rows[0])
    
    return {
        props: { profile }, // will be passed to the page component as props
    }
}

async function handleSubmit(state, set_state, event) {
    event.preventDefault();
    const res = await fetch('/api/user/' + state.user_id + '/update', {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(state)
    })
    set_state({...state, open: true})
    setTimeout(() => set_state({...state, open: false}), 2000)
}

