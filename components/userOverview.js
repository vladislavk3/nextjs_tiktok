import Card from "components/dashboard/Card/Card.js";
import CardHeader from "components/dashboard/Card/CardHeader.js";
import CardIcon from "components/dashboard/Card/CardIcon.js";
import CardBody from "components/dashboard/Card/CardBody.js";
import CardFooter from "components/dashboard/Card/CardFooter.js";
import GridItem from "components/dashboard/Grid/GridItem.js";
import GridContainer from "components/dashboard/Grid/GridContainer.js";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/nextjs-material-dashboard/views/dashboardStyle.js";
import Tooltip from "@material-ui/core/Tooltip"
import Alert from '@material-ui/lab/Alert';
import {Link} from "@material-ui/core";
import { useSession,  signin } from 'next-auth/client'

const useStyles = makeStyles(styles);

function safeGet(m, k){
  if(m == undefined || m[k] == undefined) { return 'N/A'; }
  return (+m[k]).toLocaleString(undefined, {maximumFractionDigits: 0})
}

function getEr(summary) {
  if(summary == undefined) { return 'N/A'}
  return (summary['Eng. Rate (Followers)'] * 100).toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "%"
}

export default function UserOverview({summary, name, authorStats}) {
    const classes = useStyles();
    const num = (key) => safeGet(summary, key)
    const anum = (key) => safeGet(authorStats, key)
    const er = getEr(summary)
    const [ session, loading ] = useSession()
    const onlyTen = !(session?.pro);

    return (
        <div className="container">
          <h1>{formatName(name)}</h1>
          {onlyTen && <Alert severity="warning">To keep my costs low, free accounts can only fetch 10 videos. 
            Please consider <Link href="/upgrade">upgrading</Link> to fetch more – all profits go to charity!</Alert>}
          <GridContainer>
            <GridItem xs={12} sm={6}>
              <Card>
                <CardHeader color="dark" stats icon>
                  <CardIcon color="dark">
                  <img src={"data:image/png;base64,"+ authorStats?.avatar_medium }/>
                  </CardIcon>
                  <p className={classes.cardCategory}>
                  {authorStats?.bio}
                  </p>
                </CardHeader>
              </Card>                
            </GridItem>
          </GridContainer>
          <GridContainer>
              <StatsCard title="Average Views" value={num('Average Views')} classes={classes} icon="visibility" color="info" recent onlyTen={onlyTen}/>
              <StatsCard title="Average Likes" value={num('Average Likes')} classes={classes} icon="favorite" color="danger" recent onlyTen={onlyTen}/>
              <StatsCard title="Eng. Rate (Followers)" value={er} classes={classes} icon="grade" color="success" recent tooltip="Average (Likes + Comments + Shares) / Followers. Top creators average 5-15%." onlyTen={onlyTen}/>
              <StatsCard title="View Std. Deviation" value={num('View Standard Deviation')} classes={classes} icon="assessment" color="warning"  recent onlyTen={onlyTen}/>
              <StatsCard title="Followers" value={anum('follower_count')} classes={classes} icon="account_box" color="dark"/>
              <StatsCard title="Number of Videos" value={anum('video_count')} classes={classes} icon="assessment" color="dark"/>
              <StatsCard title="Total Likes" value={anum('like_count')} classes={classes} icon="favorite" color="dark"/>
              <StatsCard title="Median Views" value={num('Median Views')} classes={classes} icon="assessment" color="dark"/>
          </GridContainer>
        </div>
    )}

const formatName = (name) => {
  if(name[0] == '@') { return name; }
   return '@' + name;
}

function StatsCard({title, value, classes, icon, color, recent, tooltip, onlyTen}) {
    const CardTitle = () => {
      if(tooltip){
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
      {(() => {if(recent){
      return <CardFooter stats>
        <div className={classes.stats}>
          Last {onlyTen ? 10 : 14} videos
        </div>
      </CardFooter>
      }})()}
    </Card>  
  </GridItem>
}
