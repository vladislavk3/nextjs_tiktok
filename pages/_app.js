import '../styles/bootstrap.min.css'
import '../styles/animate.min.css'
import '../styles/_mixins.scss'
import '../styles/_base.scss'
import '../styles/main.scss'
import '../styles/theme.bootstrap_4.min.css'
import "../assets/css/nextjs-material-dashboard.css"; import Router from 'next/router';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress
import Navigation from '../components/navigation.js'
import Footer from '../components/footer.js'
import { Provider } from 'next-auth/client'
import { makeStyles } from '@material-ui/core/styles';
import ScriptFooter from 'components/scriptFooter'
import Head from 'next/head'
import CookieConsent from "react-cookie-consent";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexFlow: "column",
    minHeight: "70vh",
    justifyContent: "center",
    //backgroundImage: "url('/img/joakim-honkasalo-ssvjJLB6wIw-unsplash.jpg')"
  },
  headerHolder: {
    textAlign: 'center'
  }
}));

//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start()); Router.events.on('routeChangeComplete', () => NProgress.done()); Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {
  const classes = useStyles();
  return <>
    <Head>
      <title>Stats Check lol</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <Provider session={pageProps.session}>
      <Navigation />
      <CookieConsent>This website uses cookies to enhance the user experience.</CookieConsent>
      <div className={classes.root}>
        <Component {...pageProps} />
      </div>
      <Footer />
      <ScriptFooter />
    </Provider>
  </>
}

export default MyApp
