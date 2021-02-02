import { Link } from "@material-ui/core";
import BenTable from 'components/benTable'
import Loader from 'components/loader'
export default function VideosTable({ data, username }) {
    if(!data || data.length == 0) { return <Loader/> }
    return (
        <BenTable data={data} keyField='video_id'
          formatFunction={c => columnFormatter(username, c)} 
          hiddenColumns={['video_id']}/>
    )
}

const columnFormatter = (username, columnName) => {
    if(columnName == 'Description' || columnName == "Summary Type") {
      return (v, r) => <Link href={'https://www.tiktok.com/@' + username + '/video/' + r['video_id']}>{v || '[no caption]'}</Link>;
    }
    if(columnName == 'video_id') {
      return (v) =>  1;
    }
    return (v) => {
        return parseInt(v).toLocaleString();
    }  
  }