import React, {ReactNode} from "react";
import {GridColumnConfig, SortCondition, SORTORDER, VALUETYPE} from "../domain/GridConfig";
import {isNotSortableColumn, isVisibleColumn} from "../common/GridUtils";
import {GridTableHeaderComponentProps} from "./Types";
import {GridTableHeaderCellComponentProps, HeaderCellElementProps, SelectLevel} from "../gridtableheadercell/Types";
import GridTableHeaderCellDefault from "../gridtableheadercell/GridTableHeaderCellDefault";


interface Props {
    sortConditions : SortCondition[]
    columns : GridColumnConfig[]
    headerComponentProps : GridTableHeaderComponentProps
    headerCellComponentProps : GridTableHeaderCellComponentProps
    emptyColumnsCount : number

    selectLevel : SelectLevel,
    onSelectAll? : (selected : boolean) => void

    onSortClick? : (column : GridColumnConfig, order : SORTORDER | undefined) => void
}

const GridTableHeader : React.FunctionComponent<Props> = (props) => {

    const getSortOrderForField = (fieldName : string) : SORTORDER | undefined => {
        const condition = props.sortConditions.find(cond => cond.field === fieldName);
        return condition === undefined ? undefined : condition.sortOrder;
    }

    const onSortClick = (fieldName : string, sortOrder : SORTORDER | undefined) => {
        const column = props.columns.find(c => c.fieldName === fieldName);
        if (column === undefined) {
            throw Error("Column with field name " + fieldName + " doesnt exist")
        }
        if (props.onSortClick) {
            props.onSortClick(column, sortOrder);
        }
    }

    const onSelectRowAllRows = () => {
        if (props.onSelectAll) {
            const selectAll = props.selectLevel !== SelectLevel.ALL
            props.onSelectAll(selectAll);
        }
    }

    const renderColumn = (column : GridColumnConfig) : ReactNode => {
        const currentSort = getSortOrderForField(column.fieldName);
        const cellProps : HeaderCellElementProps = {
            fieldName : column.fieldName,
            label : column.label,
            sortOrder : currentSort,
            valueType : column.valueType,
            sortDisabled : isNotSortableColumn(column),
            onSortClick : sortOrder => onSortClick(column.fieldName, sortOrder),
            style : props.headerComponentProps.style,
            className : props.headerComponentProps.className,
        }
        const key = column.fieldName
        if (props.headerCellComponentProps.cell === undefined) {
            return <GridTableHeaderCellDefault key={key} {...cellProps}/>
        }
        return React.createElement(props.headerCellComponentProps.cell, {key : key, ...cellProps})
    }

    const addSelectCell = (columns : ReactNode[]): ReactNode[] => {
        const {onSelectAll, headerCellComponentProps, selectLevel} = props;
        if (onSelectAll === undefined) {
            return columns;
        }
        const cellKey = "selectAll"
        let checkbox = undefined;
        if (headerCellComponentProps.selectAllCell === undefined) {
            checkbox = (
                <tr key={cellKey}>
                    <input type="checkbox" checked={selectLevel === SelectLevel.ALL} onChange={onSelectRowAllRows} key={cellKey}/>
                </tr>)
        } else {
            checkbox = React.createElement(headerCellComponentProps.selectAllCell,
                {
                    key : cellKey,
                    selectLevel: selectLevel,
                    onSelect: onSelectRowAllRows
                })
        }

        columns.unshift(checkbox);
        return columns;
    }

    const addEmptyColumn = (columns : ReactNode[]) : ReactNode[] => {

        for (let i = 0; i < props.emptyColumnsCount; i++) {
            const cellProps : HeaderCellElementProps = {
                onSortClick : (e) => {},
                fieldName : "",
                label : "",
                sortOrder : undefined,
                valueType : VALUETYPE.BOOLEAN,
                sortDisabled : true,
                style : props.headerComponentProps.style,
                className : props.headerComponentProps.className,
            }

            let column : any;
            const key = i + "empty"
            if (props.headerCellComponentProps.cell === undefined) {
                column =  <GridTableHeaderCellDefault key={key} {...cellProps}/>
            } else {
                column =  React.createElement(props.headerCellComponentProps.cell, {key : key, ...cellProps})
            }
            columns.unshift(column)
        }
        return columns
    }

    const renderColumns = () : ReactNode[] => {
        let columns =  props.columns.filter(c => isVisibleColumn(c)).map(c => {
            return renderColumn(c);
        })
        columns = addEmptyColumn(columns)
        /*columns = addSelectCell(columns);*/
        return columns;
    }


    const headerProps = props.headerComponentProps;
    if (headerProps.header === undefined) {
        return (
            <thead style={headerProps.style} className={headerProps.className}>
            <tr key={1}>
                {renderColumns()}
            </tr>
            </thead>)
    } else {
        return React.createElement(headerProps.header, {key : 1},
            renderColumns())
    }
}

export default GridTableHeader;