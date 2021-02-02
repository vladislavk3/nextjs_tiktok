import {useState} from 'react'
import {useRouter} from 'next/router'
import { MenuItem, Select } from '@material-ui/core'
import GridItem from "components/dashboard/Grid/GridItem.js";
import GridContainer from "components/dashboard/Grid/GridContainer.js";

export default function InputSection({name, cached, defaultSearchType}) {
    const router = useRouter()
    const [query, setQuery] = useState(name)
    const [queryType, setQueryType] = useState(defaultSearchType)
 
    const handleParam = setValue => e => setValue(e.target.value)
 
    const handleSubmit = preventDefault(() => {
        if(query === undefined || query == '') { return; }
        const re = (queryType == 'tags') ? /^#?\w+$/ : /^@?[\w_0-9.]+$/;

        if(!re.test(query)) { 
            document.getElementById('userError').setAttribute('style', 'display:block');
            return;
        } else {
            document.getElementById('userError').setAttribute('style', 'display:none');
        }
        const rootUrl = (queryType == 'tags') ? '/tag/' : '/user/';

        router.push({
            pathname: rootUrl + cleanQuery(query)
        })
    })

    const handleQueryChange = (e) => {
        handleParam(setQueryType)(e);
        setQuery('');
    }

    return (
        <section className="" id="about">
            <div className="container">
                <div className="row">
                    <div className="col-sm-5 center-input">  
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">    
                                <label htmlFor="username">
                                    {(queryType == 'tags') ? 'Tag Name' : 'Username'}
                                </label>
                                <GridContainer>
                                    <GridItem xs={12} sm={6} lg={8}>
                                        <input type="text" className="form-control" id="username" aria-describedby="emailHelp"
                                        placeholder={(queryType == 'tags') ? '#fyp' : '@charlidamelio'} required onChange={handleParam(setQuery)} defaultValue={query}/>
                                    </GridItem>
                                    <GridItem>
                                        <Select value={queryType} onChange={handleQueryChange}>
                                            <MenuItem value="users">Users</MenuItem>
                                            <MenuItem value="tags">Tags</MenuItem>
                                        </Select>
                                    </GridItem>
                                </GridContainer>
                                <div className="invalid-feedback" id="userError">
                                    Please provide a valid {(queryType == 'tags') ? 'tag' : 'user'} name
                                </div>
                                {cached &&
                                    <div className="cache-warning" id="cachedWarning">
                                        Note: This username has already been fetched in the last 24 hours so we are using cached data.
                                        (If you are a pro user this is probably because your data is automatically fetched every day.)
                                        Please check in tomorrow for updated results.
                                    </div>}
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
)}
const preventDefault = f => e => {
    e.preventDefault()
    f(e)
}

export async function getServerSideProps({ params }) {
    const name = params['name']
    return {
        props: {  name }, // will be passed to the page component as props
    }
}

const cleanQuery = (q) => {
    if(q[0] == '#' || q[0] == '@') { return q.slice(1,99).toLowerCase() }
    return q.toLowerCase();
}