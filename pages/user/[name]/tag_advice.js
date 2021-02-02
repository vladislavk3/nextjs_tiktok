import BootstrapTable from 'react-bootstrap-table-next';
import GridItem from "components/dashboard/Grid/GridItem.js";
import GridContainer from "components/dashboard/Grid/GridContainer.js";
import { useState, useEffect } from "react";
import { useSession, getSession } from 'next-auth/client'
import Loader from '../../../components/loader'
import Error from '../../../components/error'
import { makeStyles } from "@material-ui/core/styles";
import BenTable from 'components/benTable'
const useStyles = makeStyles(theme => ({
    container: {
        marginTop: '50px'
    }
}));

export default function Tags({ name, tagUrl }) {
    const classes = useStyles();
    const [data, setData] = useState({});
    const [session, loading] = useSession()
    useEffect(() => {
        async function doFetch() {
            if (!session) { return; }
            try {
                const tag_res = await fetch(tagUrl)
                const tags = await tag_res.json()
                setData({ ...data, tags })
                const advice = await fetch('/api/user/' + name + '/tag_advice').then(r => r.json())
                setData({ ...data, tags, advice })
            } catch (error) {
                setData({ ...data, error: { hasError: true, text: error } })
            }
        }
        doFetch();
    }, [name, session?.pro])

    return <div className={classes.container}>
        <GridContainer justify='center'>
            <GridItem xs={10} sm={10} lg={6}>
                <h1>Tag Advice</h1>
            </GridItem>
        </GridContainer>
        <GridContainer justify='center'>
            <GridItem xs={10} sm={10} lg={6}>
                <h2>@{name}'s 10 Most Frequently Used Tags</h2>
            </GridItem>
        </GridContainer>
        <GridContainer justify='center'>
            <GridItem xs={10} sm={10} lg={6}>
                <BenTable data={data.tags} keyField="Name" formatFunction={columnFormatter} />
            </GridItem>
        </GridContainer>
        <Intro name={name} />
        <GridContainer justify='center'>
            <GridItem xs={10} sm={10} lg={7}>
                <BenTable data={data.advice} keyField="Tag Name" formatFunction={columnFormatter} />
            </GridItem>
        </GridContainer>
    </div>
}

const columnFormatter = (columnName) => {
    if (columnName == 'Tag Name' || columnName === 'Name') {
        return (v) => (<a href={`/tag/${v}`}>{v}</a>)
    }
    return (v) => {        
        return v?.toLocaleString(undefined, { maximumFractionDigits: 0 });
    }
}

function Intro({ name }) {
    return (
        <GridContainer justify='center'>
            <GridItem xs={8} sm={8} lg={6}>
                <h1>@{name}'s Most Successful Tags</h1>
                <p>This page lists tags ordered by an estimate of the average number of views videos produced by @{name} using that tag get.</p>
                <p>Note this is not simply looking at the observed average number of views, because that list would be dominated by tags which have only been used once or twice but got a lot of views when they were used.
            Instead, this considers how many times the tag has been used when deciding how much to "trust" the average number. (Technically, it does a Bayesian update, modeling views as lognormally distributed.)</p>
            </GridItem>
        </GridContainer>
    )
}


export async function getServerSideProps({ params }) {
    const name = params['name']
    const tagUrl = `${process.env.API_TAG}author=${name}`;
    return {
        props: { name, tagUrl }, // will be passed to the page component as props
    }
}
