import { getSession } from 'next-auth/client'
import { Link, Container, Typography, Button, Grid } from "@material-ui/core";
import { user_can_see_author } from 'helpers/auth'
import BenTable from 'components/benTable'
import LinearProgressWithLabel from 'components/linear_progress_with_label'
import { makeStyles } from '@material-ui/core/styles';
import { clean_name } from 'helpers/clean_name'
import Error from 'components/error'
import { useState, useEffect } from "react";
import { pg } from 'helpers/db'
const { BlobServiceClient } = require("@azure/storage-blob");
const account = "storageaccountdefaub9fd";
const containerName = "follower-upload";

const useStyles = makeStyles((theme) => ({
  firstHero: {
    marginTop: '50px'
  }
}));

export default function FollowerSourcing({ author, no_cookie, error, upload_url, sas }) {
  const classes = useStyles();
  const [followers, setFollowers] = useState();
  const [completion, setCompletion] = useState(undefined);
  const [completionType, setCompletionType] = useState(undefined);
  var maxLoadedBytes;
  if (no_cookie) { return <Instructions /> }
  if (error) { return <Error notPro /> }
  const getFollowers = async () => {
    const results = await fetch('/api/top_followers/matches?author=' + author).then(r => r.json())
    setFollowers(results)
  }
  useEffect(() => {
    getFollowers()
  }, [])
  const upload = async (event) => {
    setCompletion(0);
    setCompletionType('Uploading')
    const selectedFile = event.target.files[0]
    const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net${sas}`);
    const containerClient = blobServiceClient.getContainerClient(containerName); 
    const blobName = event.target.files[0].name + new Date().getTime();
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadBrowserData(selectedFile, {
      blockSize: 4 * 1024 * 1024, // 4MB block size
      concurrency: 2, 
      onProgress: ev => {
        if(!maxLoadedBytes || ev.loadedBytes > maxLoadedBytes) {
          maxLoadedBytes = ev.loadedBytes;
          setCompletion(100 * (maxLoadedBytes / selectedFile.size))
        }
      }
    });
    setCompletion(1);
    setCompletionType('Processing')
    await fetch(upload_url + '&name=' + author + '&filename=' + blobName, {
      method: 'GET'
    }).then(request => {
      if(!request.ok) {
        alert('upload failed')
      }
    });    
    setCompletion(undefined);
    getFollowers()
  }

  return (<React.Fragment>
    <Container maxWidth="md" justify='center' className={classes.firstHero} >
      <Typography component="h2" variant="h2" align="center" color="textPrimary" gutterBottom >Famous Followers</Typography>
      <Typography component="p" variant="body1" align="center" color="textPrimary" gutterBottom >
        This page displays all of the top 10,000 accounts (by follower count) which follow you.
      </Typography>
    </Container>
    <Container maxWidth="md" justify="left">
      <Instructions upload={upload} classes={classes}/>
      {completion && <LinearProgressWithLabel value={completion} loading_type={completionType}/>}
      {(!followers || followers?.length > 0) &&
        <BenTable data={followers} keyField='User'
          formatFunction={columnFormatter}
          hiddenColumns={['video_id']} />}
    </Container>
  </React.Fragment>
  )
}

export async function getServerSideProps({ params, req }) {
  const session = await getSession({ req })
  const name = clean_name(params['name'])
  if (!user_can_see_author(pg, session, name)) { return { props: { error: true } } }
  const sas = process.env.AZURE_SAS;
  return {
    props: { author: name , upload_url: process.env.API_UPLOAD, sas },
  }
}

const columnFormatter = columnName => {
  if (columnName == 'User') {
    return (v) => <Link href={'https://www.tiktok.com/@' + v}>{v}</Link>
  }
  if (columnName == 'Started Following You') {
    return (v) => (new Date(v)).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: 'numeric' })
  }
  if (columnName == 'Follower Count') {
    return (v) => parseInt(v).toLocaleString()
  }
}

const Instructions = ({upload, classes}) => {
  return <><Container maxWidth="md" justify='center' className={classes.firstHero} >
    <Typography variant="h4" align="center" color="textPrimary" gutterBottom >Instructions</Typography>
    <ol>
      <Typography component="li" variant="body1" color="textPrimary">
        Inside the TikTok app, navigate to your profile page, then tap the three dots in the upper right. Click Privacy ->
        Personalization and data -> download your data -> request data file.
      </Typography>
      <Typography component="li" variant="body1" color="textPrimary">
        It might take a few days to process but when it is done you should receive a notification from TikTok and can download
        it as a zip file.
      </Typography>
      <Typography component="li" variant="body1" color="textPrimary">
        Extract the zip file and upload "Follower List.txt" from the Activity folder.
      </Typography>
    </ol>
    <Grid justify="flex-end" container spacing={6}>
      <Grid item>
        <Button variant="contained" component="label">
          Upload File
          <input type="file" hidden onChange={upload}/>
        </Button>
      </Grid>
    </Grid>
  </Container></>
}