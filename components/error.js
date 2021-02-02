import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Container from "@material-ui/core/Container";

export default function Error({ message, notPro }) {
    const toShow = message || 'Error loading data'
    return (<Container maxWidth="md">
        <Grid container justify='center'>
            <Grid item xs={8} sm={8} lg={4}>
                <h2>Error Loading Page</h2>
            </Grid>
        </Grid>
        <Grid container justify='center'>
            <Grid item xs={8} sm={8} lg={4}>
                {notPro ? <UpgradeError /> : toShow}
            </Grid>
        </Grid>
    </Container>
    )
}

function UpgradeError() {
    return <Typography variant="body1">Sorry, this feature is only available to Pro users.
    Please <Link href="/upgrade">upgrade your account</Link> to use it – all proceeds go to charity!</Typography>
}