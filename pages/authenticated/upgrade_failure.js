import GridContainer from "components/dashboard/Grid/GridContainer.js";
import GridItem from "components/dashboard/Grid/GridItem.js";
export default function UpgradeSuccess({ name, userUrl }) {

    return (
        <div>
            <GridContainer justify='center'>
                <GridItem xs={12} sm={12} lg={6}>
                    <h1>Upgrade Failed</h1>
                </GridItem>
            </GridContainer>

            <GridContainer justify='center'>
                <GridItem xs={12} sm={12} lg={6}>
                    <p>It looks like your payment failed to process.  Please try again, or if this is in error please contact us.</p>
                </GridItem>
            </GridContainer>
        </div>
    )
}

