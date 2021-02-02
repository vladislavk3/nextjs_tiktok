import { useRouter } from 'next/router'
import GridItem from "components/dashboard/Grid/GridItem.js";
import GridContainer from "components/dashboard/Grid/GridContainer.js";
import BootstrapTable from 'react-bootstrap-table-next';
import Card from "components/dashboard/Card/Card.js";
import CardHeader from "components/dashboard/Card/CardHeader.js";
import CardIcon from "components/dashboard/Card/CardIcon.js";
import CardBody from "components/dashboard/Card/CardBody.js";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/nextjs-material-dashboard/views/dashboardStyle.js";
import InputSection from '../../components/input.js'
import { useState, useEffect } from "react";
import auth from '../../helpers/auth'
import { getSession } from 'next-auth/client'
import BenTable from 'components/benTable'
import Error from 'components/error'

const useStyles = makeStyles(styles);

const Tag = ({ error }) => {
  if (error) { return <Error message="You are not authorized to see this page." /> }

  const router = useRouter()
  const { name } = router.query
  const [tagInfo, setTagInfo] = useState({});

  useEffect(() => {
    async function populate() {
        // first try the cache
        const res = await fetch('/api/tag/' + name)
        if(res.ok){
          const rj = await res.json();
          setTagInfo(rj);
          return;
        }

        //then populate
        setTagInfo({})
        const _newData = await fetch('/api/tiktok_pull/tag/' + name);
        // and retrieve again from cache
        const res2 = await fetch('/api/tag/' + name).then(r => r.json());
        setTagInfo(res2)
    }
    populate();
  }, [name])
  return (
    <div style={{ display: 'inline' }}>
      <section id="contact">
        <div className="container" style={{ 'overflow': 'visible' }}>
          <InputSection name={name} cached={false} defaultSearchType='tags' />
          <div className="row">
            <div className="col-lg-14 center-input">
              <h1>#{name}</h1>
            </div>
          </div>
          <TagResults name={name} data={tagInfo} />
        </div>
      </section>
    </div>
  )
}

function TagResults({ name, data }) {
  if (data == undefined || data.stats == undefined) return <Loading />
  return <React.Fragment>
    <GridContainer justify='center'>
      <Stats stats={data.stats} />
    </GridContainer>

    <div className="row">
      <div className="col-lg-14 center-input">
        <h2>Alternative Tags</h2>
        <p>These tags are frequently used in conjuction with "{name}". Consider whether any of them perform better.</p>
      </div>
    </div>

    <GridContainer justify='center'>
      <GridItem xs={12} sm={12} lg={8}>
        <Alternatives alternatives={data.alternatives} />
      </GridItem>
    </GridContainer>
  </React.Fragment>
}

function kFormatter(num) {
  if (num > 999999999) {
    return (num / 1000000000).toFixed(1) + 'B'
  }
  if (num > 999999) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num > 999) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num
}

const Stats = ({ stats }) => {
  const classes = useStyles();
  const iconMap = {
    'Video Count': 'videocam',
    'View Count': 'visibility',
    'Average Views': 'assessment'
  }
  const colorMap = {
    'Video Count': 'dark',
    'View Count': 'info',
    'Average Views': 'warning'
  }
  return (
    <React.Fragment>
      {Object.keys(stats).map(k => {
        return (<GridItem xs={12} sm={6} md={3} key={k}>
          <Card>
            <CardHeader stats icon>
              <CardIcon color={colorMap[k]}>
                <Icon>{iconMap[k]}</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>{k}</p>
              <h3 className={classes.cardTitle}>
                {kFormatter(stats[k])}
              </h3>
            </CardHeader>
          </Card>
        </GridItem>)
      })}
    </React.Fragment>
  )
}

const columnFormatter = (columnName) => {
  if (columnName == 'Alternative Tag Name') {
    return (v) => (<a href={`/tag/${v}`}>{v}</a>)
  }
  return (v) => {
    return kFormatter(v);
  }
}

const Alternatives = ({ alternatives }) => {
  if (alternatives.length == 0) {
    return <p>No alternatives found. Please check back later when we have processed more data.</p>
  }
  return (
    <BenTable data={alternatives} keyField='Alternative Tag Name'
      formatFunction={columnFormatter} />
  )
}

export async function getServerSideProps({ params, req, res }) {
  const session = await getSession({ req })    
  const valid = await auth (session, req.url, res)
  if(!valid) { return  { props: { error: true} }; }
  return  { props: {} };
}

function Loading() {
  return (
    <React.Fragment>
      <GridContainer justify='center'>
        <GridItem xs={12} sm={12} lg={8}>
          <p>Please wait. We fetch thousands of data points about each account, so it can take a minute or longer to pull all the data.</p>
        </GridItem>
      </GridContainer>

      <GridContainer justify='center'>
        <GridItem xs={12} sm={12} lg={8}>
          <div className="loader-holder">
            <div className="loader"></div>
          </div>
        </GridItem>
      </GridContainer>
    </React.Fragment>
  )
}

export default Tag