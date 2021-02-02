import GridItem from "components/dashboard/Grid/GridItem.js";
import GridContainer from "components/dashboard/Grid/GridContainer.js";
import Link from '@material-ui/core/Link'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

export default function Instructions () {
    return (<>
        <Grid container justify="center">
        <Grid item xs={3} sm={3} lg={3}>
            <h2>Insights</h2>
        </Grid>
        </Grid>
        <Grid container justify="center">
        <Grid item xs={11} lg={6}>
            <p>It looks like you haven't authenticated with TikTok yet. Please follow these instructions: </p>
            <ol>
                <li>Install either the <Link href="https://addons.mozilla.org/en-US/firefox/addon/tiktok-statscheck/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search">Firefox</Link> or 
                &nbsp;<Link href="https://chrome.google.com/webstore/detail/stats-check-lol/lkfkonafecnnhhjpmbelngpplhfkhnkg?hl=en">Chrome extension</Link>. Please note that
                mobile browsers do not support extensions, so you will need to do this on a desktop.</li>
                <li>Inside the browser in which you installed the extension, navigate to <a href="www.tiktok.com">TikTok.com</a></li>
                <li>Log into TikTok</li>
                <li>While being logged into both statschecklol.com and tiktok.com, click the little stats check icon:</li>
                <img src="/img/firefox_urlbar.PNG" style={{maxWidth: "100%"}}/>
                <li>You should get an alert saying that your information has been synchronized:</li>
                <img src="/img/plugin_success.png" style={{maxWidth: "100%"}}/>
                <li>Navigate to <Link href="https://www.statschecklol.com/authenticated/insights"></Link> and click the "fetch new data" button.</li>
                <li>It might take one or two minutes, but you should eventually hopefully see something like this:</li>
                <img src="/img/insights_sshot.png" style={{maxWidth: "100%"}}/>
            </ol>
        </Grid>
        </Grid>
        </>
    )
}