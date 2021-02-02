import { makeStyles } from '@material-ui/core/styles';
import { signIn, useSession } from 'next-auth/client'
import { Link } from '@material-ui/core'

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
  }
}));
export default function SignInCheck(props) {
  const classes = useStyles();
  const [ session, loading ] = useSession()
  if(!session) return <LoggedOutHome/>
  return props.children
}

const LoggedOutHome = () => {
  const classes = useStyles();
  return (
    <div >
        <div className={classes.headerHolder}>
          <h1>Stats Check Lol</h1>
          <p>During the beta program only specific users have access to this site. </p>
          <p>Please either <Link href="#" onClick={() => signIn()}>sign in</Link> or <Link href="#" onClick={() => signIn()}>create an account</Link> to proceed.</p>
        </div>
    </div>
  )
}