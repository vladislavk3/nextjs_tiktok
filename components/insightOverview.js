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
import { mean, sum } from 'mathjs'
const useStyles = makeStyles(styles);

export default function InsightOverview({insights}) {
    if(!insights?.loaded) { return <div></div>}
    if(!insights?.insights || insights?.insights?.error)  { return <div></div>}
    if(insights.insights.length == 0)  { return <div></div>}

    const classes = useStyles();

    return (
        <div className="container">
          <GridContainer>
              {getSummary(insights.insights).map(card => {
                return <StatsCard title={card.title} value={card.value} classes={classes} 
                    icon={card.icon || "visibility"} color="info" subtitle={card.subtitle} key={card.title + card.subtitle}/>
              })}
          </GridContainer>
        </div>
    )
}

function getSummary(insights) {
    const watch_3 = insights.slice(0, 3).map(i => +i['Watch %'])
    const total_watch = sum(insights.map(i => i['Total Views'] * i['Avg Watch Time'])) / 60 / 60
    const total_views = sum(insights.map(i => +i['Total Views']))
    return [
        {'title': '% Watch Time', 'subtitle': 'Last Video', value: insights[0]['Watch %'].toLocaleString(undefined, {maximumFractionDigits: 0}), 'icon': 'schedule'},
        {'title': '% Watch Time', 'subtitle': 'Last 3 Videos (Average)', value: mean(watch_3).toLocaleString(undefined, {maximumFractionDigits: 0}), 'icon': 'schedule'},
        {'title': 'Total Watch Time', 'subtitle': 'Last 100 Videos (' + total_watch.toLocaleString(undefined, {maximumFractionDigits: 0}) + ' hours)' , value: formatTime(total_watch), 'icon': 'schedule'},
        {'title': 'Total Views', 'subtitle': 'Last 100 Videos', value: abbreviateNumber(total_views)},
    ]
}

function abbreviateNumber(value) {
  var newValue = value;
  if (value >= 1000) {
      var suffixes = ["", "k", "m", "b","t"];
      var suffixNum = Math.floor( (""+value).length/3 );
      var shortValue = '';
      for (var precision = 2; precision >= 1; precision--) {
          shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
          var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
          if (dotLessShortValue.length <= 2) { break; }
      }
      if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
      newValue = shortValue+suffixes[suffixNum];
  }
  return newValue;
}

function formatTime(t) {
  if(t < 24) { return t.toLocaleString(undefined, {maximumFractionDigits: 1}) + " hours"}
  if(t < 24*30) { return (t/24).toLocaleString(undefined, {maximumFractionDigits: 1}) + " days"}
  if(t < 24*30*12) { return (t/24/30).toLocaleString(undefined, {maximumFractionDigits: 1}) + " months"}
  if(t < 24*30*12*10) { return (t/24/30/12).toLocaleString(undefined, {maximumFractionDigits: 1}) + " years"}
  if(t < 24*30*12*10*10) { return (t/24/30/12/10).toLocaleString(undefined, {maximumFractionDigits: 1}) + " decades"}
  return (t/24/30/12/10/10).toLocaleString(undefined, {maximumFractionDigits: 1}) + " centuries"
}

function StatsCard({title, value, classes, icon, color, tooltip, subtitle}) {
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
      </CardHeader><CardFooter stats>
        <div className={classes.stats}>
          {subtitle}
        </div>
      </CardFooter>
    </Card>  
  </GridItem>
}
