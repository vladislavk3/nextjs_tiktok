
import GridItem from "components/dashboard/Grid/GridItem.js";
import GridContainer from "components/dashboard/Grid/GridContainer.js";

export default function Loader() {
    return (   
            <React.Fragment>
                <GridContainer justify='center'>
            <GridItem xs={12} sm={12} lg={8}>
                        <p>Please wait. We fetch thousands of data points about each account, so it can take a minute or longer to pull all the data.</p>
                    </GridItem>
                </GridContainer>
                <GridContainer justify='center'>
            <GridItem xs={3} sm={3} lg={3}> 
                        <div className="loader"></div>    
                        </GridItem>
                </GridContainer>
        </React.Fragment>
)}