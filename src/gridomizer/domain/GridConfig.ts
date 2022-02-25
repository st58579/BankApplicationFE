export interface GridConfig {
    clazz : string,
    gridName : string,
    gridLabel : string,
    defaultRowsCount : number
    columns : GridColumnConfig[]
    defaultSortConditions : SortCondition[]
}

export interface GridColumnConfig {
    fieldName : string,
    label : string,
    searchType : SEARCHTYPE,
    valueType : VALUETYPE,
    columnType : COLUMNTYPE,
    contentType : CONTENTTYPE
    columnNumber : number
}

export interface SortCondition {
    field : string,
    sortOrder : SORTORDER,
    conditionNo : number
}


export enum SEARCHTYPE {
    NONE="NONE",
    CONTAINS="CONTAINS",
    START_WITH="START_WITH",
    END_WITH="END_WITH",
    BETWEEN="BETWEEN",
    EQUALS="EQUALS"

}

export enum VALUETYPE {
    NUMBER="NUMBER",
    STRING="STRING",
    DATE="DATE",
    COLLECTION="COLLECTION",
    ENUMERATION="ENUMERATION",
    BOOLEAN="BOOLEAN",
    OBJECT="OBJECT"
}

export enum COLUMNTYPE {
    CLASS_FIELD="CLASS_FIELD",
    VIRTUAL_FIELD="VIRTUAL_FIELD",
    HIDDEN_FIELD="HIDDEN_FIELD"
}

export enum CONTENTTYPE {
    NONE="NONE",
    URL="URL",
    COLOR="COLOR",
    IMAGE="IMAGE"
}
export enum SORTORDER {
    ASC="ASC",
    DESC="DESC"
}
