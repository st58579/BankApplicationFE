import React from 'react';
import "./Grid.css"
import TableRow from "@material-ui/core/TableRow";
import LinkIcon from "@material-ui/icons/Link";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import moment from "moment";
import {CONTENTTYPE, GridConfig, SORTORDER, VALUETYPE} from "../gridomizer/domain/GridConfig";
import {Checkbox, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead} from "@material-ui/core";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import {
    CellCheckboxElementProps,
    CellExpandElementProps,
    GridTableBodyCellElementProps
} from "../gridomizer/gridtablebodycell/Types";
import {StyledWithChildren} from '../gridomizer/types/Types';
import GridData, {
    ExportType,
    GridDataRequest,
    GridExportDataRequest,
    SearchCondition
} from "../gridomizer/domain/GridData";
import Grid from "../gridomizer/grid/Grid";
import {HeaderCellElementProps, SelectAllCellElementProps, SelectLevel} from "../gridomizer/gridtableheadercell/Types";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import {GridTableBodyComponentProps} from "../gridomizer/gridtablebody/Types";
import {GridTableComponentProps} from "../gridomizer/gridtable/Types";
import GridToolbar from "./GridToolbar";
import {GridTableBodyRowElementProps} from "../gridomizer/gridtablerow/Types";
import Api from "../api/Api";
import {Link} from "react-router-dom";

interface Props {
    gridName: string,
    label? : string,
    linkToRoute? : string,
    searchConditions? : SearchCondition[]
}

export default class GridComponent extends React.Component<Props, any> {

    fetchGridConfig = async () => {
        /*return RestService.get<GridConfig>("core/grids/" + this.props.gridName)
            .then(conf => {
                return conf
            })*/
        let resp = await Api.fetchGridConfig({gridName : this.props.gridName});
        return resp.data;
    };

    fetchGridData = async (request: GridDataRequest) => {
        /*console.error("fetchGridData", new Date())
        return RestService.post<GridData>("core/grids/" + this.props.gridName + "/values", request)
            .then(conf => {
                return conf
            })*/
        let resp = await Api.fetchGridData(request, this.props.gridName);
        return resp.data
    };

    onExport = (type: ExportType, request: GridExportDataRequest) => {
        /*RestService.postForLoadFile("core/grids/" + this.props.gridName + "/export/" + type, request)
            .then()
            .catch(e => {
                console.error(e);
            })*/
    };


    render() {
        return <Grid
            rowLink={this.props.linkToRoute}
            label={this.props.label}
            singleSort={true}
            selectable={true}
            initialSearchConditions={this.props.searchConditions}
            elements={
                {
                    tableHeader: {
                        header: GridTableHeader
                    },
                    tableHeaderCell: {
                        cell: GridTableHeaderCell,
                        selectAllCell: CheckboxTableHeader
                    },
                    tableBody: {
                        body: GridTableBody
                    },
                    tableBodyRow: {
                        row: GridTableRow,
                    },
                    tableBodyCell: {
                        cell: GridTableCell,
                        checkbox: CheckboxTable,
                        expand: ExpandCell
                    },
                    table: {
                        table: GridTable
                    },
                    toolbar: {
                        toolbar: GridToolbar
                    }

                }
            }

            functions={{
                fetchGridConfigAsync: this.fetchGridConfig,
                fetchGridDataAsync: this.fetchGridData,
                valueFormatter: formatValue,
                onExport: this.onExport
            }}

        />
    }
}


const GridTableHeader: React.FC<StyledWithChildren> = (props) => {
    return <TableHead>
        <TableRow>
            {props.children}
        </TableRow>
    </TableHead>
}

const ExpandCell: React.FC<CellExpandElementProps> = (props) => {
    if (props.expanded) {
        return <IconButton onClick={props.onExpand} style={{padding: 0, paddingLeft: "10px"}}>
            <ArrowDropDownIcon/>
        </IconButton>
    } else {
        return <IconButton onClick={props.onExpand} style={{padding: 0, paddingLeft: "10px"}}>
            <ArrowRightIcon/>
        </IconButton>
    }
}

const CheckboxTable: React.FC<CellCheckboxElementProps> = (props) => {
    return <Checkbox
        checked={props.selected}
        onChange={props.onSelect}
        inputProps={{'aria-label': 'secondary checkbox'}}
        key={props.elementKey}
    />
}

const CheckboxTableHeader: React.FC<SelectAllCellElementProps> = (props) => {
    let ariaLabel = "secondary checkbox"
    if (props.selectLevel === SelectLevel.NO_ALL) {
        ariaLabel = "indeterminate secondary checkbox"
    }

    return (<TableCell
        key={props.elementKey}
        padding={'none'}>
        <Checkbox
            indeterminate={props.selectLevel === SelectLevel.NO_ALL}
            checked={props.selectLevel === SelectLevel.ALL}
            onChange={props.onSelect}
            inputProps={{'aria-label': ariaLabel}}
            key={props.elementKey}
        />
    </TableCell>)

}

const GridTable: React.FC<GridTableComponentProps> = (props) => {
    return <div className="grid-root">
        <Paper className="grid-paper">
            <TableContainer>
                <Table>
                    {props.children}
                </Table>
            </TableContainer>
        </Paper>
    </div>
}

const GridTableHeaderCell: React.FC<HeaderCellElementProps> = (props) => {
    let sortDirection: 'asc' | 'desc' | undefined = undefined;
    let nextSort: SORTORDER | undefined = SORTORDER.ASC
    if (props.sortOrder === SORTORDER.ASC) {
        sortDirection = "asc";
        nextSort = SORTORDER.DESC
    } else if (props.sortOrder === SORTORDER.DESC) {
        sortDirection = "desc";
        nextSort = undefined
    }
    if (props.sortDisabled) {
        sortDirection = undefined
    }
    return (
        <TableCell
            key={props.label}
            align={props.valueType === VALUETYPE.NUMBER ? 'right' : 'left'}
            padding={'none'}
            sortDirection={sortDirection}
        >
            <TableSortLabel
                disabled={props.sortDisabled}
                active={sortDirection !== undefined}
                direction={sortDirection}
                onClick={e => {
                    props.onSortClick(nextSort)
                }}
            >
                {props.label}
            </TableSortLabel>
        </TableCell>
    );
}

const GridTableCell: React.FC<GridTableBodyCellElementProps> = (props) => {
    return <TableCell align="left" colSpan={props.colspan} padding={"none"}
                      key={props.elementKey}>
        {props.children}
    </TableCell>
}

//Former link looked like this : to={props.linkTo + props.elementKey}

const GridTableRow: React.FC<GridTableBodyRowElementProps> = (props: GridTableBodyRowElementProps & { children?: React.ReactNode | undefined }) => {
    if (props.linkTo){
        return <TableRow hover role="checkbox" tabIndex={-1} key={props.elementKey} component={Link} to={{pathname : '/' + props.linkTo + props.elementKey}}>
            {props.children}
        </TableRow>
    }
    return <TableRow hover role="checkbox" tabIndex={-1} key={props.elementKey} component={TableRow}>
            {props.children}
    </TableRow>
}

const GridTableBody: React.FC<GridTableBodyComponentProps> = (props) => {
    return <TableBody>
        {props.children}
    </TableBody>
}


const formatValue = (value: any, valueType: VALUETYPE, contentType: CONTENTTYPE) => {

    if (value === undefined) {
        return "-"
    }
    if (contentType === CONTENTTYPE.URL) {
        return (
            <IconButton onClick={() => window.open('http://localhost:8080' + value, '_blank')} style={{padding: 0}} key={1}>
                <LinkIcon/>
            </IconButton>
        )
    }
    if (valueType === VALUETYPE.BOOLEAN) {
        return value === true ? <CheckRoundedIcon key={1}/> : <ClearRoundedIcon key={1}/>
    }
    if (valueType === VALUETYPE.DATE) {
        return moment(value).format("DD-MM-YYYY HH:mm:ss")
    }
    return String(value);
}