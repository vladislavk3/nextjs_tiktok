import { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import Loader from 'components/loader'
import Plot from 'components/plot'
import Typography from "@material-ui/core/Typography";

export default function User() {
    const [insights, setInsights] = useState();

    async function getInsights() {
        const trends = await fetch('/api/average_views').then(r => r.json());
        setInsights({ loaded: true, trends });
    }

    useEffect(() => {
        getInsights();
    }, [])

    return (<React.Fragment>
        <Container justify="center" maxWidth="lg" style={{ textAlign: 'center' }}>
            {!insights?.loaded && <Loader />}
            <Typography variant="h2">TikTok-Wide View Trends</Typography>
            <Plot results={insights?.trends} xChoice="Date" yChoice="1-Week Moving Average" plotType='bar' />

            <Container justify="center" maxWidth="sm">
                <br />
                <Typography variant="body1">
                    This shows the average number of views a sample of TikTok users
                    got across all of their videos on a given day. It is normalized so that 1 is average for each person.
                </Typography>
            </Container>
        </Container>
    </React.Fragment>
    )
}