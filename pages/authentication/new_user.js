import { makeStyles } from '@material-ui/core/styles';
import {  providers, signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import GridItem from "components/dashboard/Grid/GridItem.js";
import GridContainer from "components/dashboard/Grid/GridContainer.js";
import {TextField, Checkbox} from '@material-ui/core';
import {Typography, Popover, Button, FormControlLabel, Link  } from '@material-ui/core'
import cookieCutter from 'cookie-cutter'

const useStyles = makeStyles(theme => ({
  typography: {
      padding: theme.spacing(2),
  },
}));

export default function NewUser() {
  const classes = useStyles();
  const router = useRouter()
  const [ session, loading ] = useSession()
  const [state, setState] = React.useState({open: false, tos: false, checked: false, error_reason: ''})
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!state.checked) {
      setState({...state, tos:true})
      setTimeout(() => setState({...state, tos: false}), 2000)
      return
    }
    const res = await fetch('/api/user/validate_user?tos=true')
    if(res.ok) {
      const tiktok_session_id = cookieCutter.get('tiktok_session_id')
      if(tiktok_session_id != undefined) {
        router.push('/tiktok_redirect/' + tiktok_session_id)
      } else {
        router.push('/')
      }
    } else {
      const parsed = await res.json()
      const { error } = parsed
      setState({...state, open:true, error_reason: error})
      setTimeout(() => setState({...state, open: false}), 2000)
    }
  }

  const handleCheck = e => { setState({...state, checked: e.target.checked})}
  const buttonReference = React.useRef();

  return (<>
      <GridContainer justify='center'>
        <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}> 
            <GridItem xs={12} sm={12} lg={8}>
              <FormControlLabel
                control={<Checkbox checked={state.checked} onChange={handleCheck} name="tos"/>} 
                label={<span>I accept and agree to the <Link href="/static/terms_of_service">Terms of Service</Link> and <Link href="/static/privacy">Privacy Policy</Link> </span>}/>
            
            <GridItem xs={12} sm={12} lg={8}><Button variant="contained" color="primary" type="submit" ref={buttonReference}>Submit</Button></GridItem>
            <Popover open={state.open} anchorEl={buttonReference.current} anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
                    transformOrigin={{ vertical: 'top',  horizontal: 'center', }}>
                <Typography className={classes.typography}>{state.error_reason}</Typography>
            </Popover>
            <Popover open={state.tos} anchorEl={buttonReference.current} anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
                    transformOrigin={{ vertical: 'top',  horizontal: 'center', }}>
                <Typography className={classes.typography}>Acceptance of terms is required.</Typography>
            </Popover>
            </GridItem>
        </form>
      </GridContainer>
      </>
  )
}
