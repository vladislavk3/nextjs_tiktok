import ResultsSection from '../../components/results.js'
import InputSection from '../../components/input.js'
import ScriptSection from '../../components/scripts.js'
import UserOverview from '../../components/userOverview.js'
import { useState, useEffect } from "react";
import { useSession, getSession } from 'next-auth/client'
import auth from '../../helpers/auth'
import Advice from 'components/user_page/advice'
import Plot from 'components/plot'
import Grid from "@material-ui/core/Grid";
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { clean_name } from 'helpers/clean_name'

const useStyles = makeStyles((theme) => ({
    darkRow: {
      background: 'radial-gradient(ellipse at center,#eee,#fff 100%)',
    },
  }));

export default function User({ name, userUrl }) {
    const [data, setData] = useState({});
    const [session, loading] = useSession()
    const classes = useStyles();

    async function fetchPro() {
        const _new = await fetch('/api/tiktok_pull/user/' + name + '/videos?count=500')
        doFetch()
    }
    async function doFetch() {
        try {
            window.ben = window.ben || {};
            if (window.ben.pro == session?.pro && window.ben.name == name) { return; }
            window.ben.pro = session?.pro;
            window.ben.name = name;

            const count = session?.pro ? 100 : 10;
            let videos;
            const cached_result = await fetch('/api/tiktok_user/' + name + '/videos?count=' + count + '&pro=' + session?.pro).then(r => r.json())
            if (cached_result.cached) {
                videos = cached_result
            } else {
                // const new_results = await fetch(userUrl + '&count=' + count)
                const fetch_url = '/api/tiktok_pull/user/' + name + '/videos?count=' + count
                const try_again = () => fetch(fetch_url + '&attempt=2')
                const _new = await fetch(fetch_url).then(r => r.ok ? r : try_again())
                videos = await fetch('/api/tiktok_user/' + name + '/videos?count=' + count).then(r => r.json())
            }
            const advice = await fetch('/api/tiktok_user/' + name + '/auto_advice').then(r => r.json())
            videos.results = cleanDates(videos.results)
            setData({ videos, name, advice, pro: window.ben.pro })
        } catch (error) {
            console.log(error)
            setData({ error: { hasError: true, text: error } })
        }
    }

    useEffect(() => {
        if (navigator.locks) { navigator.locks.request(name + session?.pro, doFetch) }
        else { doFetch(); }
    }, [name, session?.pro])



    return (
        <div style={{ display: 'inline' }}>
            <InputSection name={name} cached={data?.videos?.cached && !(data?.videos?.recently_fetched)} defaultSearchType='users' />
            <DataStuff name={name} data={data} fetchPro={fetchPro} classes={classes}/>
            <ScriptSection />
        </div>
    )
}

export async function getServerSideProps({ params, req, res }) {
    const session = await getSession({ req })
    const valid = await auth(session, req.url, res)
    if (!valid) { return {}; }
    const name = clean_name(params['name'])
    const userUrl = `${process.env.API_USER}name=${name}`;
    return {
        props: { name, userUrl }, // will be passed to the page component as props
    }
}

function DataStuff({ name, data, fetchPro, classes }) {
    const { videos, error, advice, pro } = data;
    if (error != undefined && error.hasError) return <Error e={error.text} />
    if (!videos || data.name != name) return <Loading />

    return <div>
        <UserOverview summary={videos.summary} name={name} authorStats={videos.author} />
        <Grid container alignContent="center" alignItems="center" justify="center"
            className={classes.darkRow}>
            <Grid item xs={12} lg={5}>
                <Advice advice={advice} pro={pro} name={name} />
            </Grid>
            <Grid item xs={12} lg={5} style={{textAlign: 'center'}}>
                <Typography variant="h4">Chart Analysis</Typography>
                <Plot results={videos.results} xChoice='Likes' yChoice='Views' />
            </Grid>
        </Grid>
        <ResultsSection videos={videos.results} username={name} pro={pro} fetchPro={fetchPro} />
    </div>
}

function Error(e) {
    return (
        <div className="row">
            <div className="col-lg-14 center-input">
                <h3>We could not find that user. Are you sure you typed their name correctly?</h3>
            </div>
        </div>
    )
}

function Loading() {
    return (
        <React.Fragment>
            <div className="row">
                <div className="col-lg-3 center-input ">
                    <p>Please wait. We fetch thousands of data points about each account, so it can take a minute or longer to pull all the data.</p>
                </div>
            </div>
            <div className="row">
                <div className="loader-holder">
                    <div className="loader"></div>
                </div>
            </div>
        </React.Fragment>
    )
}

const cleanDates = (videos) => {
    return videos?.map(v => {
        const create_date = v['Create Date']
        v['Create Date'] = new Date(create_date).toLocaleDateString()
        v['Create Time'] = new Date(create_date).toLocaleTimeString()
        return v;
    })
}