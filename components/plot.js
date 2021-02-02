import GridItem from "components/dashboard/Grid/GridItem.js";
import GridContainer from "components/dashboard/Grid/GridContainer.js";
import Container from "@material-ui/core/Container";
import { useEffect } from "react";

export default function Plot({ results, xChoice, yChoice, plotType = 'scatter' }) {
    if (!results) return <></>
    useEffect(() => initializePlot(results, xChoice, yChoice, plotType), [results])

    return (<>
            <Container maxWidth="md">
                <div id="graphHolder" style={{width: '100%', height: '450px'}}></div>
            </Container>
        <GridContainer justify='center'>
            <GridItem >
                <label htmlFor="xChoice">x-axis:</label>
                <select id="xChoice">
                    <option>Views</option>
                    <option>Comments</option>
                </select>
            </GridItem>
            <GridItem >
                <label htmlFor="yChoice">y-axis:</label>
                <select id="yChoice">
                    <option>Views</option>
                    <option>Comments</option>
                </select>
            </GridItem>
        </GridContainer>
    </>)
}

function initializePlot(result, xChoice, yChoice, plotType) {
    window.ben = window.ben || {};
    window.ben.result = result;
    var s = $('select');
    s.html('');
    for (var key in result[0]) {
        let o = document.createElement("option");
        let text = document.createTextNode(key);
        o.appendChild(text);
        s.append(o);
    }
    $('#xChoice').val(xChoice);
    $('#yChoice').val(yChoice);
    $('#xChoice, #yChoice').change(e => {
        doPlot(window.ben.result, $('#xChoice').val(), $('#yChoice').val(), plotType);
    });
    doPlot(window.ben.result, $('#xChoice').val(), $('#yChoice').val(), plotType)
}

function doPlot(result, xLabel = 'Views', yLabel = 'Likes', plotType) {
    const formatFunction = (label) => {
        if (/date/i.test(label)) { return v => new Date(v[label]); }
        if (label == 'Create Time') { return v => new Date('2000-01-01 ' + v[label]) }
        return v => +v[label]
    }
    const valid = result.filter(v => v[xLabel] && v[yLabel])
    var y = valid?.map(v => formatFunction(yLabel)(v))
    var x = valid?.map(v => formatFunction(xLabel)(v))
    const y_format = (yLabel == 'Create Time') ? { tickformat: "%H:%M" } : {}
    const x_format = (xLabel == 'Create Time') ? { tickformat: "%H:%M" } : {}
    var text = valid?.map(v => v['Description'] || '(no caption)')
    Plotly.newPlot($('#graphHolder')[0],
        [{
            x: x,
            y: y,
            text: text,
            type: plotType,
            mode: 'markers'
        }],
        {
            responsive: true,
            margin: { t: 0 },
            title: 'Video Data',
            xaxis: {
                title: xLabel,
                ...x_format
            },
            yaxis: {
                title: yLabel,
                ...y_format
            }
        });
}
