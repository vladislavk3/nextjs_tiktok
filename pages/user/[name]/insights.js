import UserOverview from 'components/userOverview.js'
import { useState, useEffect } from "react";
import GridItem from "components/dashboard/Grid/GridItem.js";
import GridContainer from "components/dashboard/Grid/GridContainer.js";
import { std, mean, median } from 'mathjs'
import Button from '@material-ui/core/Button';
import InsightOverview from 'components/insightOverview'
import { Link, Container } from "@material-ui/core";
import { get_author_cookie } from 'helpers/auth'
import BenTable from 'components/benTable'
import InsightsErrorHandler from 'components/insights/insights_error_handler'
import {insightsAuthentication} from 'helpers/auth'
import {pg} from 'helpers/db'

export default function User({ author, summary, name, fetchUrl, authenticated }) {
    if(!authenticated?.valid) return <InsightsErrorHandler error={authenticated} />
    const [insights, setInsights] = useState({});
    async function getInsights() {
        const insights = await fetch('/api/tiktok_user/' + name + '/fetch_insights').then(r => r.json());
        const info = {
            loaded: true,
            insights: insights
        }
        setInsights(info);
    }
    async function fetchNewInsights() {
        setInsights({ 'loading': true })
        try {
            await fetch(fetchUrl);
            getInsights();
        } catch (e) {
            setInsights({ 'error': e })
        }
    }

    useEffect(() => {
        getInsights();
    }, [name])

    return (<React.Fragment>
        <GridContainer justify='center'>
            <GridItem xs={12} sm={12} lg={8}>
                <UserOverview summary={summary} name={name} authorStats={author} />
            </GridItem>
        </GridContainer>
        <InsightOverview insights={insights} />
        <GridContainer justify='center'>
            <GridItem xs={12} sm={12} lg={8}>
                <GridContainer justify='space-between'>
                    <GridItem xs={3} sm={3} lg={3}>
                        <h2>Insights</h2>
                    </GridItem>
                    <GridItem xs={2} sm={2} lg={2}>
                        <Button color="primary" onClick={fetchNewInsights} variant="contained">Fetch Last 500 Videos</Button>
                    </GridItem>
                </GridContainer>
            </GridItem>
        </GridContainer>
        <Container justify="center" maxWidth="lg">
            <DataStuff insights={insights} name={name} />
        </Container>
    </React.Fragment>
    )
}

const columnFormatter = (username, columnName) => {
    if (columnName == 'Description') {
        return (v, r) => <Link href={'https://www.tiktok.com/@' + username + '/video/' + r?.video_id}>{v || '[no caption]'}</Link>
    }
    return (v) => {
        if (v === undefined || v === null) return '';
        return v.toLocaleString(undefined, { maximumFractionDigits: 0 });
    }
}

export async function getServerSideProps(context) {
    return await insightsAuthentication(pg, context, async (pg, context) => {    
        const { params } = context
        const author = params['name']
        const { cookie } = await get_author_cookie(pg, author)

        const videos = await pg.raw(`
            select video_id, description, likes "Likes", views "Views", shares, comments "Comments", duet_enabled, stitch_enabled, duration, self_liked, create_time
            from tiktok.user_videos
            inner join (
                select video_id, max(fetchedat) fetchedat
                from tiktok.user_videos
                group by video_id
            ) q using (video_id, fetchedat)
            where author = (?)
            order by create_time desc
            limit 100`, [author]).then(r => r.rows)

        const authorStats = await pg.raw(`
            select name "Name", follower_count, video_count, like_count, avatar_medium, bio 
            from tiktok.stats_users 
            where name = (?)
            order by fetch_time desc`,
            [author]).then(r => r.rows)
        const summary = summary_statistics(videos, authorStats[0])
        const name = author
        const fetchUrl = `${process.env.API_INSIGHTS}name=${name}&cookie=${cookie}&count=500`
        const authorInfo = authorStats.length === 0 ? {} : authorStats[0]
        return {
            props: { author: authorInfo, summary, name, fetchUrl }, // will be passed to the page component as props
        }
    })
}

function summary_statistics(videos, author_stats) {
    if (videos == undefined || videos.length == 0) {
        return {
            'Average Views': 'N/A',
            'Average Likes': 'N/A',
            'View Standard Deviation': 'N/A',
            'Eng. Rate (Followers)': 'N/A',
            'Median Views': 'N/A'
        }
    }
    const recent = videos.slice(0, 14)
    const recent_views = recent.map(r => parseInt(r['Views']))
    const average_views = mean(recent_views)
    const average_likes = mean(recent.map(r => r['Likes']))
    const sd_views = std(recent_views)
    const average_comments = mean(recent.map(r => r['Comments']))
    const er = (average_likes + average_comments) / author_stats['follower_count']
    const median_views = median(videos.map(r => parseInt(r['Views'])))
    return {
        'Average Views': average_views,
        'Average Likes': average_likes,
        'View Standard Deviation': sd_views,
        'Eng. Rate (Followers)': er,
        'Median Views': median_views
    }
}

function DataStuff({ insights, name }) {
    if (insights == undefined || Object.keys(insights).length === 0 || insights['loading']) return <Loading />
    if (insights.error != undefined) return <Error e={insights.error} />
    if (insights.loaded && Object.keys(insights.insights).length === 0) return <NoData />

    return <BenTable data={insights.insights} keyField='video_id'
        formatFunction={(c) => columnFormatter(name, c)}  hiddenColumns={['video_id']} />

}

function NoData() {
    return <GridContainer>
        <GridItem xs={12} sm={12} lg={8}>
            <p>It looks like no data has been fetched yet. Please click the button to fetch your data from TikTok.</p>
        </GridItem>
    </GridContainer>
}

function Loading() {
    return (
        <GridContainer>
            <GridItem xs={12} sm={12} lg={8} style={{ 'textAlign': "center" }}>
                Please wait, it can take a minute or longer to pull all the data.
            </GridItem>
            <GridItem xs={12} sm={12} lg={8}>
                <div className="loader-holder">
                    <div className="loader"></div>
                </div>
            </GridItem>
        </GridContainer>
    )
}

function Error(e) {
    return (
        <div className="row">
            <div className="col-lg-14 center-input">
                <h2>Error loading. Are you signed in? ({JSON.stringify(e)})</h2>
            </div>
        </div>
    )
}
