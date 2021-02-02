
import InputSection from '../components/input.js'
import { makeStyles } from '@material-ui/core/styles';
import { signIn, useSession } from 'next-auth/client'
import { Button, Container, Link, Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexFlow: "column",
    height: "70vh",
    justifyContent: "center",
    //backgroundImage: "url('/img/joakim-honkasalo-ssvjJLB6wIw-unsplash.jpg')"
  },
  headerHolder: {
    textAlign: 'center'
  },

  buttonHolder: {
    '& > *': {
      margin: theme.spacing(1),
    },
    marginTop: '10px'
  }
}));
export default function Home() {
  const classes = useStyles();
  const [ session, loading ] = useSession()
  if(!session) return <LoggedOutHome/>
  return (
    <div >
        <div className={classes.headerHolder}>
          <h1>Stats Check Lol</h1>
        </div>
        <InputSection defaultSearchType="users"/>
    </div>
  )
}

const LoggedOutHome = () => {
  const classes = useStyles();
  return (
    <div >
        <div className={classes.headerHolder}>
          <Typography variant="h2">Stats Check Lol</Typography>
          <Container maxWidth="sm" gutterBottom>
          <Typography variant="body1" gutterBottom>Analyze your TikTok account and get recommendations about the best time to post, the optimal tags to use, and more.</Typography>
          <Typography variant="body1" >Please either <Link href="#" onClick={() => signIn()}>sign in</Link> or <Link href="#" onClick={() => signIn()}>create an account</Link> to 
          start pulling data.</Typography>
          </Container>
          <Container maxWidth="sm" className={classes.buttonHolder}>
            <Button variant="contained" color="primary" onClick={() => signIn()}>Sign in</Button>
            <Button variant="contained" color="primary" onClick={() => signIn()}>Create Account</Button>
          </Container>
        </div>
    </div>
  )
}
