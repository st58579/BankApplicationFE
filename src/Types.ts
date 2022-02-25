export interface File {
    name? : string
    content? : any
    clientId? : number
    type? : number
}

export interface Client {
    clientId : number,
    name : string,
    surname : string,
    phoneNumber : string,
    birthNumber : string
}

export interface ClientAddress {
    clientId : number,
    addressId : number,
    name? : string,
    surname? : string,
    birthNumber? : string,
    active : number
}

export interface Recommendation{
    recommendationId: number,
    subject: string,
    text: string,
    status : string,
}

export interface Address {
    addressId? : number,
    clientId : number,
    houseNumber? : string,
    street? : string,
    town? : string,
    postalCode? : string,
    countryCode? : string;
}

export interface Card {
    cardId : number,
    accountId : number,
    state : string,
    cardNumber : number,
    issueDate : string,
    expirationDate : string,
    ownerName : string,
    ownerSurname : string,
}

export interface Credit{
    creditId : number,
    accountId : number,
    issueDate : string,
    remainder : number,
    typeInfo : string,
    timePeriodInfo : string,
    numOfTimePeriods : number,
    percentForTimePeriod : number,

}

export interface Account {
    accountNumber : number,
    stateInfo : string,
    clientId : number,
    accountId : number,
    remainder : number,
    accountType : string,
    limit? : number,
    rate? : number,
    timePeriod? : string
}

export interface Stats{
    simpleAccCount : number,
    savingAccCount : number,
    creditAccCount : number,
    avgCreditPerAcc : number,
    avgCardPerAcc : number,
    avgAccPerClient : number
}

export interface ProfitOnPeriod{
    dateFrom : string,
    dateTo : string
}

export enum Role {
    USER = "USER",
    ADMIN = "ADMIN"
}

export interface User {
    data : UserData | null
}

export interface UserData {
    id : number,
    login : string,
    role : Role,
    clientId? : number,
    jwt : string,
    emulate? : UserData,
    image : any
}

