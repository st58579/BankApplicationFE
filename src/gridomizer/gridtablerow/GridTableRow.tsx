import {extractObject, getRowId} from "../common/GridUtils";
import React, {useState} from "react";
import {GridTableRowComponentProps} from "./Types";
import {CONTENTTYPE, GridColumnConfig, VALUETYPE} from "../domain/GridConfig";
import {GridTableCellComponentProps} from "../gridtablebodycell/Types";
import GridTableBodyCell from "../gridtablebodycell/GridTableBodyCell";
import KeyValue from "../common/KeyValue";


const EXPAND_ROW_ICON = "\u27A4"
const COLLAPSE_ROW_ICON = "\u27F0"


interface Props {
    columns: GridColumnConfig[]
    data: KeyValue<any>
    formatValue?: (value: any, valueType: VALUETYPE, contentType: CONTENTTYPE) => any;
    emptyColumnsCount: number,
    rowLink? : string,

    onSelect?: (rowId : any, selected: boolean) => void
    selected : boolean

    rowComponentProps: GridTableRowComponentProps
    cellComponentProps: GridTableCellComponentProps

    key?: string
}


const GridTableRow = (props : Props) => {
    const [expanded, setExpanded] = useState(false);


    const getDataCells = () => {
        const {formatValue, cellComponentProps, data, columns} = props;
        return  columns.map(col => {
            const value = data[col.fieldName]
            const formattedValue = formatValue ? formatValue(value, col.valueType, col.contentType) : value
            const key = getRowId(data) + col.fieldName
            return <GridTableBodyCell colspan={1}
                                      value={formattedValue}
                                      cellComponentProps={cellComponentProps}
                                      key={key}
            />
        })
    }

    const getExpandComponent = () => {
        const {rowComponentProps, cellComponentProps, data, columns} = props;
        if (!expanded || rowComponentProps.expand === undefined) {
            return <noscript/>
        }
        const colspan = columns.length + props.emptyColumnsCount - 1 // first column is for close expand element
        const cellKey = getRowId(data) + "expand"
        return <GridTableBodyCell colspan={colspan}
                                  value={React.createElement(rowComponentProps.expand, {value: extractObject(data)})}
                                  cellComponentProps={cellComponentProps}
                                  key={cellKey}
        />;
    }

    const getCells = () => {
        const {rowComponentProps} = props;
        let cells: any[] = []
        cells = addExpandCell(cells)
        if (expanded && rowComponentProps.expand) {
            cells.push(getExpandComponent())
        } else {
            /*cells = addSelectCell(cells);*/
            cells.push(getDataCells());
        }
        return cells;
    }

    const addSelectCell = (cells: any[]): any[] => {
        const {onSelect, cellComponentProps, data} = props;
        if (onSelect === undefined) {
            return cells;
        }
        const cellKey = getRowId(data) + "checkbox"
        let checkbox = undefined;
        if (cellComponentProps.checkbox === undefined) {
            checkbox = <input type="checkbox" checked={props.selected} onChange={onSelectRow} key={cellKey}/>
        } else {
            checkbox = React.createElement(cellComponentProps.checkbox,
                {
                    key : cellKey,
                    selected: props.selected,
                    onSelect: onSelectRow
                })
        }
        const value = checkbox;
        const cell = <GridTableBodyCell colspan={1} value={value} cellComponentProps={cellComponentProps} key={cellKey}/>
        cells.push(cell)
        return cells;
    }

    const addExpandCell = (cells: any[]): any[] => {
        const {rowComponentProps, cellComponentProps,data} = props
        if (rowComponentProps.expand === undefined) {
            return cells;
        }

        let expandCell;
        if (cellComponentProps.expand === undefined) {
            expandCell = <a style={{cursor : "pointer"}}
                            onClick={onExpandRow}
            >
                {expanded ? COLLAPSE_ROW_ICON : EXPAND_ROW_ICON}
            </a>
        } else {
            expandCell = React.createElement(cellComponentProps.expand,
                {
                    onExpand: onExpandRow,
                    expanded : expanded
                })
        }
        const value = expandCell;
        const key = getRowId(data) + "expandCell"
        const cell = <GridTableBodyCell colspan={1} value={value} key={key} cellComponentProps={cellComponentProps}/>
        cells.push(cell)

        return cells;
    }

    const onSelectRow = () => {
        if (props.onSelect) {
            props.onSelect(getRowId(data), !props.selected);
        }
    }

    const onExpandRow = () => {
        setExpanded(!expanded)
    }

    const {rowComponentProps, data} = props
    let cells = getCells()
    let key = getRowId(data) + "";
    if (rowComponentProps.row === undefined) {
        return <tr key={key}
                   className={rowComponentProps.className}
                   style={rowComponentProps.style}
        >
            {cells}
        </tr>
    }

    return React.createElement(rowComponentProps.row, {
        key : key,
        linkTo : props.rowLink,
        elementKey : key
    }, cells)
}

export default GridTableRow