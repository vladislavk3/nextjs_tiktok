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
import VideocamIcon from '@material-ui/icons/Videocam';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles(styles);

function safeMax(h, k){
  if(h ==  undefined) return {}
  var biggest = h.reduce((m, v) => {return m[k] < v[k] ? v : m})
  return {...biggest,
    'pretty_value': (+(biggest[k])).toLocaleString(undefined, {maximumFractionDigits: 0}),
    'pretty_date': (new Date(biggest['Date'])).toLocaleDateString()
  }
}

export default function UserHistoryOverview({name, history, author_stats}) {
    if(!history || !author_stats) { return <></>}
    const classes = useStyles();
    const num = (key) => safeMax(history, key)
    const totalNewFollowers = {
      'pretty_value': (history[0]['Followers'] - history[history.length-1]['Followers']).toLocaleString(undefined, {maximumFractionDigits: 0})
    }

    return (
        <div>
          <h1>{formatName(name)}</h1>
          <GridContainer>
            <GridItem xs={12} sm={6}>
              <Card>
                <CardHeader color="dark" stats icon>
                  <CardIcon color="dark">
                  <img src={"data:image/png;base64,"+ author_stats?.avatar_medium }/>
                  </CardIcon>
                  <p className={classes.cardCategory}>
                  {author_stats?.bio}
                  </p>
                </CardHeader>
              </Card>                
            </GridItem>
          </GridContainer>
          <GridContainer>
              <StatsCard title="Max Daily New Followers" value={num('New Followers')} classes={classes} 
                icon={<PersonAddIcon/>} color="primary"/>
              <StatsCard title="Max Daily Video Views" value={num('Video Views')} classes={classes} 
                icon={<VideocamIcon/>} color="success"/>
              <StatsCard title="Max Daily Profile Views" value={num('Profile Views')} classes={classes} 
                icon={<AccountCircleIcon/>} color="info"/>
                <StatsCard title="New Followers" value={totalNewFollowers} classes={classes} 
                  icon={<PersonAddIcon/>} color="rose" footer="New followers in the past month"/>
          </GridContainer>
        </div>
    )}

const formatName = (name) => {
  if(name[0] == '@') { return name; }
   return '@' + name;
}

function StatsCard({title, value, classes, icon, color, footer, tooltip}) {
    const CardTitle = () => {
      if(tooltip){
        return <Tooltip title={tooltip} arrow>
          <Typography className={classes.cardCategory}>{title}</Typography>
        </Tooltip>
      }
      return <p className={classes.cardCategory}>{title}</p>
    }
    return <GridItem xs={12} sm={6} md={3}>
      <Card>
      <CardHeader color={color} stats icon>
        <CardIcon color={color}>
          {icon}
        </CardIcon>
          <CardTitle />
        <h3 className={classes.cardTitle}>
          {value.pretty_value}
        </h3>
      </CardHeader>
       <CardFooter stats>
        <div className={classes.stats}>
          {footer ? footer : <span>This monthly max occurred on {value.pretty_date}</span>}
        </div>
      </CardFooter>
    </Card>  
  </GridItem>
}
