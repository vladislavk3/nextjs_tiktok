import Card from "../../../components/dashboard/Card/Card.js";
import CardHeader from "../../../components/dashboard/Card/CardHeader.js";
import CardIcon from "../../../components/dashboard/Card/CardIcon.js";
import GridItem from "../../../components/dashboard/Grid/GridItem.js";
import GridContainer from "../../../components/dashboard/Grid/GridContainer.js";
import Tooltip from '@material-ui/core/Tooltip';
import {Icon,Link} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import { useState,useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/nextjs-material-dashboard/views/dashboardStyle.js";
import VideosTable from '../../../components/videosTable'
import InsightOverview from 'components/insightOverview'
import Error from 'components/error'
import InsightsErrorHandler from 'components/insights/insights_error_handler'
import {insightsAuthentication} from 'helpers/auth'
import {pg} from 'helpers/db'

const useStyles = makeStyles(styles);

function safeGet(m, k) {
    if (m == undefined || m[k] == undefined) { return 'N/A'; }
    return m[k].toLocaleString(undefined, { maximumFractionDigits: 0 })
}

export default function DailyDashboard({ name, authenticated }) {
    if(!authenticated.valid) return <InsightsErrorHandler error={authenticated} />
    const classes = useStyles();
    const [insights, setInsights] = useState({});
    const [dailyInfo, setDailyInfo] = useState({});
    
    async function getInsights () {
        const insights = await fetch('/api/tiktok_user/' + name + '/fetch_insights').then(r => r.json());
        const info = {
            loaded: true,
            insights: insights
        } 
        setInsights(info);
    }    
    async function getDaily() {
        let results;
        results = await fetch('/api/tiktok_user/' + name + '/daily_videos').then(r => r.json());
        if(!results.cached.fetched_today) {
            const _update = await fetch('/api/tiktok_pull/user/' + name + '/videos?count=100')
        }
        results = await fetch('/api/tiktok_user/' + name + '/daily_videos').then(r => r.json());
        setDailyInfo({loaded: true, ...results});
    }
    useEffect(() => {
        getDaily();
        getInsights();
    }, [name])
    
    return (
        <div className="container">
            <h1>{formatName(name)}'s Daily Dashboard</h1>
            {(dailyInfo?.loaded && (!dailyInfo?.videos || dailyInfo?.videos.length == 0)) && <Alert severity="warning">It looks like this might be your first day. Please check back tomorrow once we have more data.</Alert>}
            <Overview summary={dailyInfo.summary} classes={classes}/>
            <InsightOverview insights={insights}/>
            <GridContainer justify="center">
                <GridItem xs={12} sm={6} lg={6}>
                    <h2>{formatName(name)}'s Most Viewed Videos in the Past Day</h2>
                </GridItem>
            </GridContainer>
            {(!dailyInfo?.loaded || dailyInfo?.videos?.length > 0) && <VideosTable data={dailyInfo.videos} username={name}/>}
            {(dailyInfo?.loaded && (!dailyInfo?.videos || dailyInfo?.videos.length == 0)) && 
                <Error message={<>It looks like this might be your first day. Please check back tomorrow once we have more data</>}/>}
            <GridContainer justify="center">
                <GridItem xs={12} sm={6} lg={6}>
                    <i>Last fetched: {dailyInfo?.summary && dailyInfo?.summary['Last Fetched']}. Data refreshed once every 24 hours.</i>
                </GridItem>
            </GridContainer>
        </div>
    )
}

const Overview = ({summary, classes}) => {
    if(!summary) return <></>
    const num = (key) => safeGet(summary, key)

    const DeltaCard = ({ title, icon, color }) => <StatsCard title={title} value={num(title)} classes={classes} icon={icon} color={color} />
    return <><GridContainer>
            <GridItem xs={12} sm={6} lg={4}>
                <Card>
                    <CardHeader color="dark" stats icon>
                        <CardIcon color="dark">
                            <img src={"data:image/png;base64," + summary['avatar_medium']} />
                        </CardIcon>
                        <p className={classes.cardCategory}>
                            {summary['bio']}
                        </p>
                    </CardHeader>
                </Card>
            </GridItem>
        </GridContainer>
        <GridContainer>
            <DeltaCard title="Views Since Yesterday" icon="visibility" color="info" />
            <DeltaCard title="Likes Since Yesterday" icon="favorite" color="danger" />
            <DeltaCard title="Followers Since Yesterday" icon="account_box" color="dark" />
            <DeltaCard title="Videos Since Yesterday" icon="assessment" color="dark" />
        </GridContainer>
        </>
}

export async function getServerSideProps(context) {
    return await insightsAuthentication(pg, context)    
}

const formatName = (name) => {
    if (name[0] == '@') { return name; }
    return '@' + name;
}

function StatsCard({ title, value, classes, icon, color, tooltip }) {

    const CardTitle = () => {
        if (tooltip) {
            return <Tooltip title={tooltip} arrow>
                <p className={classes.cardCategory}>{title}</p>
            </Tooltip>
        }
        return <p className={classes.cardCategory}>{title}</p>
    }
    return <GridItem xs={12} sm={6} md={3}>
        <Card>
            <CardHeader color={color} stats icon>
                <CardIcon color={color}>
                    <Icon>{icon}</Icon>
                </CardIcon>
                <CardTitle />
                <h3 className={classes.cardTitle}>
                    {value}
                </h3>
            </CardHeader>
        </Card>
    </GridItem>
}

