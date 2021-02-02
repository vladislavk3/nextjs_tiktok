import GridItem from "components/dashboard/Grid/GridItem.js";
import GridContainer from "components/dashboard/Grid/GridContainer.js";
import Error from "components/error";
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import BenTable from 'components/benTable'
import Link from '@material-ui/core/Link';
import FavoriteIcon from '@material-ui/icons/Favorite';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ShareIcon from '@material-ui/icons/Share';
import CommentIcon from '@material-ui/icons/Comment';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Tooltip from '@material-ui/core/Tooltip';
import { Typography } from "@material-ui/core";

export default function ResultsSection({ videos, tags, username, pro, fetchPro }) {
  return (
    <section id="results">
      {pro && 
      <Container>
        <GridContainer justify="flex-end">
          <GridItem >
            <Button color="primary" onClick={fetchPro} variant="contained">Fetch Last 500 Videos</Button>
          </GridItem>
        </GridContainer>
      </Container>}
      <Container style={{textAlign: 'center'}}>
        <Typography variant="h4">Raw Data</Typography>
      </Container>
      {videos?.length > 0 && <BenTable data={videos} formatFunction={(k) => columnFormatter(username, k)}
        keyField='id' headerFormatter={headerFormatter} hiddenColumns={['id']}/>}
      {videos?.length == 0 && <Error message="No data found. Are you sure that you have public videos?"/>}
    </section>
  )
}

const columnFormatter = (username, columnName) => {
  if (columnName == 'Name') {
    return (v) => (<a href={`/tag/${v}`}>{v}</a>)
  }
  if (columnName == 'Eng. Rate (Followers)' || columnName == 'Eng. Rate (Views)') {
    return (v) => Math.round(v) + '%'
  }
  if (columnName == 'Sound') {
    return (v) => <div dangerouslySetInnerHTML={{ __html: v }} />
  }
  if (columnName == 'Description') {
    return (v,r) => <Link href={'https://www.tiktok.com/@' + username + '/video/' + r?.id}>{v || '(no caption)'}</Link>
  }
  return (v) => {
    if (Number.isInteger(v)) {
      return v.toLocaleString();
    } else {
      return v;
    }
  }
}

const headerFormatter = (column) => {
  const k = column.text
  const table = {
    'Likes': <FavoriteIcon/>,
    'Views': <VisibilityIcon/>,
    'Shares': <ShareIcon/>,
    'Comments': <CommentIcon/>,
    'Duration (s)': <AccessTimeIcon/>
  }
  if(k in table) { 
    return <Tooltip title={k} aria-label={k} enterTouchDelay={100} placement='bottom'>{table[k]}</Tooltip>
  }
  return k
}