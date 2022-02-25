
import {SEARCHTYPE, SortCondition} from "./GridConfig";
import KeyValue from "../common/KeyValue";

export default interface GridData {
    gridName : string,
    currentCount : number,
    currentOffset : number,
    rows : KeyValue<any>[],
    searchConditions : SearchCondition[]
    sortConditions : SortCondition[]
}

export interface GridDataRequest {
    offset : number;
    count : number;
    searchConditions : SearchCondition[]
    sortConditions : SortCondition[]
}

export interface GridExportDataRequest {
    searchConditions : SearchCondition[]
    sortConditions : SortCondition[]
    ids? : any[]
}

export interface SearchCondition {
    searchType : SEARCHTYPE
    value1 : any,
    value2? : any,
    fieldName : string
}

export enum ExportType {
    CSV="CSV",
    XLS="XLS",
    DASH="DASH"
}
