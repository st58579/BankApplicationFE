import {COLUMNTYPE, GridColumnConfig, SEARCHTYPE} from "../domain/GridConfig";
import {GRID_ROW_ID} from "./Constants";
import {SearchCondition} from "../domain/GridData";
import KeyValue from "./KeyValue";

export const getRowId = (row: KeyValue<any>) : number | undefined => {
    let number = row[GRID_ROW_ID];
    if (!number) {
        return undefined;
    }

    if (number.id){
        return number.id;
    }

    return number;
}

export const getRowIds = (rows: KeyValue<any>[]) : number[] => {
    let numbers = []
    for (let row of rows) {
        let number = row[GRID_ROW_ID];
        numbers.push(number);
    }
    return numbers;
}

export const getDefaultSearchCondition = (value1 : string, value2 : string, columns : GridColumnConfig[]) : SearchCondition[] => {
    let searchConditions : SearchCondition[] = []
    for (let col of columns) {
        searchConditions.push({value1 : value1, value2 : value2, fieldName : col.fieldName, searchType : col.searchType})
    }
    return searchConditions;
}

export const isNotSortableColumn = (column : GridColumnConfig) : boolean => {
    return column.columnType !== COLUMNTYPE.CLASS_FIELD;
}

export const isSearchableColumn = (column : GridColumnConfig) : boolean => {
    return column.searchType !== SEARCHTYPE.NONE;
}

export const isVisibleColumn = (column : GridColumnConfig) : boolean => {
    return column.columnType !== COLUMNTYPE.HIDDEN_FIELD;
}

export const extractObject = (keyValue : KeyValue<any>) : any => {
    let array = [];
    for (let key of Object.keys(keyValue)) {
        if (key !== GRID_ROW_ID) {
            let value = keyValue[key];
            array.push([key, value])
        }
    }
    return Object.fromEntries(array);
}

export const generateRandomId = () => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 25; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}