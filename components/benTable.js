import GridItem from "components/dashboard/Grid/GridItem.js";
import GridContainer from "components/dashboard/Grid/GridContainer.js";
import BootstrapTable from 'react-bootstrap-table-next';
import Loader from 'components/loader'
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
const { ExportCSVButton } = CSVExport;
import ImportExportIcon from '@material-ui/icons/ImportExport';
import { Link } from "@material-ui/core";

export default function BenTable({ data, keyField, formatFunction = k => v => v, styles = {},
    keyFieldFunction, headerFormatter, hiddenColumns, hideDownload, justify = "center" }) {
    if (!data || data.length == 0) { return <Loader /> }

    const columns = buildColumns(data, formatFunction, styles, headerFormatter, hiddenColumns)
    let keyToUse = keyField;
    if (keyFieldFunction) {
        data.forEach(r => {
            r['zzBenKeyField'] = keyFieldFunction(r)
        })
        keyToUse = 'zzBenKeyField'
    }
    return (
        <GridContainer justify={justify} style={{ overflow: 'auto' }}>
            <GridItem xs={12} sm={12} lg={9}>
                <div className="benTable table-responsive">
                    <ToolkitProvider
                        keyField="id"
                        data={data}
                        columns={columns}
                        exportCSV={{
                            fileName: 'stats-check-lol.csv'
                        }}
                    >
                        {
                            props => <div>
                                {hideDownload || <ExportCSVButton {...props.csvProps}>Export CSV</ExportCSVButton>}
                                <BootstrapTable {...props.baseProps} data={data} columns={columns} keyField={keyToUse}
                                    hover bordered={false} condensed />
                            </div>
                        }
                    </ToolkitProvider>
                </div>
            </GridItem>
        </GridContainer>
    )
}

function buildColumns(data, formatFunction, styles, headerFormatter = k => <span>{k.text}<ImportExportIcon/></span>, hiddenColumns) {
    if (data == undefined || data.length == 0) {
        return []
    }
    return Object.keys(data[0]).map(k => {
        if (k == 'zzBenKeyField') {
            return {
                dataField: k, hidden: true
            }
        }
        return {
            dataField: k, text: k, headerFormatter: headerFormatter,
            sort: true, style: styles[k],
            formatter: formatFunction(k),
            hidden: hiddenColumns ? hiddenColumns.includes(k) : false
        }
    });
}

BenTable.numberFormatter = (force) => {
    return (v) => {
        if (Number.isInteger(v)) {
            return v.toLocaleString();
        } else {
            if(force) return parseInt(v).toLocaleString();
            return v;
        }
    }
}

BenTable.linkFormatter = (username) => {
    return (v, r) => <Link href={'https://www.tiktok.com/@' + username + '/video/' + r['video_id']}>{r.description}</Link>  
}