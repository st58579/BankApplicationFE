import  {GridDataRequest} from "../gridomizer/domain/GridData";
import {Address, Client, ClientAddress, Credit, File, UserData} from "../Types";

const axios = require('axios').default;

const instance = axios.create({
    baseURL: 'http://localhost:8080',
});

export interface FetchGridRequest {
    gridName : string
}

export interface FetchUserRequest {
    clientId : string
}

export interface FetchAccountRequest {
    accountId : string
}

export interface FetchAddressRequest {
    addressId : string
}

export interface FetchCardRequest {
    cardId : string
}

export interface FetchCreditRequest {
    creditId : string
}

export interface FetchProfitRequest{
    dateFrom : string,
    dateTo : string
}

export interface ImageUpload {
    userId : number,
    image : string
}

export interface UpdateClientAddressRequest {
    addressId : string,
    clientId : string,
    state : number
}

export interface AuthRequest {
    username : string,
    password : string
}

export interface PayCreditRequest{
    ucetId : number,
    amount : number,
}

export interface RecommendationsRequest {
    ids : number[]
}

export interface NewRecommendationRequest{
    recommendationId : number,
    subject : string,
    text : string,
    status : string
}

export type UserRole = 'ADMIN' | 'USER';

export interface NewUserRequest {
    login : string,
    password : string,
    role : UserRole,
    registeredBy : number
    clientId? : number | null
}

class Api {

    // backendový POST požadavek pro změnu hesla uživátele
    public static changePassword = (request : any, token : string) : Promise<any> => {
        const config = {
            headers: {
                Authorization: "Bearer " + token
            }
        };

        return instance.post("api/auth/changePassword/" , request, config);
    };

    public static uploadImage = (request : ImageUpload) : Promise<any> => {

        return instance.post("api/auth/changeImage/", request);
    };

    // backendový GET požadavek pro blokování úživatele podle ID
    public static blockUserById = (request : number, token : string) : Promise<any> => {
        const config = {
            headers: {
                Authorization: "Bearer " + token
            }
        };

        return instance.get("api/auth/blockUser/" + request, config);
    };

    // backendový GET požadavek pro rozblokování úživatele podle ID
    public static unblockUserById = (request : number, token : string) : Promise<any> => {
        const config = {
            headers: {
                Authorization: "Bearer " + token
            }
        };

        return instance.get("api/auth/unblockUser/" + request, config);
    };

    // backendový GET požadavek pro resetování hesla úživatele podle ID
    public static resetUserPasswordById = (request : number, token : string) : Promise<any> => {
        const config = {
            headers: {
                Authorization: "Bearer " + token
            }
        };

        return instance.get("api/auth/reset/" + request, config);
    };

    // backendový POST požadavek pro zmražení karty podle ID
    public static freezeCard = (request: {cardId : number}) : Promise<any> => {
        return instance.post("api/karty/zmrazit", request);
    };

    // backendový POST požadavek pro rozmražení karty podle ID
    public static unfreezeCard = (request: {cardId : number}) : Promise<any> => {
        return instance.post("api/karty/rozmrazit", request);
    };

    // backendový POST požadavek pro terminování karty podle ID
    public static terminateCard = (request: {cardId : number}) : Promise<any> => {
        return instance.post("api/karty/terminovat", request);
    };

    // backendový GET požadavek pro ziskání dat o úvěru podle ID
    public static fetchCreditData = (request : FetchCreditRequest) : Promise<any> => {
        return instance.get('api/uvery/' + request.creditId);
    };

    // backendový GET požadavek pro ziskání dat o uživátelí podle ID
    public static getUserById = (request : number, token : string) : Promise<any> => {
        const config = {
            headers: {
                Authorization: "Bearer " + token
            }
        };

        return instance.get("api/auth/getUser/" + request, config);
    };

    // backendový POST požadavek pro přidání nového správce podle ID
    public static addNewAdminUser = (request : NewUserRequest, token : string): Promise<any> => {
        const config = {
            headers: {
                Authorization: "Bearer " + token
            }
        };

        return instance.post("api/auth/new", request, config);
    };


    // backendový PUT požadavek pro editace dat o úvěru podle ID
    public static updateCreditData = (request: Credit) : Promise<any> => {
        return instance.put("api/uvery/" + request.creditId, request);
    };

    // backendový POST požadavek pro autentifikace uživátelé
    public static authenticateUser = (request : AuthRequest): Promise<any> => {
        return instance.post("api/auth/login", request);
    };

    // backendový POST požadavek pro zmrážení účtu podle ID
    public static freezeAccount = (request : {accountId : number}) : Promise<any> => {
      return instance.post("api/ucty/zmrazit", request);
    };

    // backendový POST požadavek pro vložení nové kárty
    public static newCard = (request : {accountId : number}) : Promise<any> => {
        return instance.post("api/karty/nova", request);
    };

    // backendový POST požadavek pro vložení nového úvěru
    public static newCredit = (request : any) : Promise<any> => {
        return instance.post("api/uvery/novy", request);
    };

    // backendový POST požadavek pro terminování účtu
    public static terminateAccount = (request : {accountId : number}) : Promise<any> => {
        return instance.post("api/ucty/terminovat", request);
    };

    // backendový POST požadavek pro zmrážení účtu podle ID
    public static unfreezeAccount = (request : {accountId : number}) : Promise<any> => {
        return instance.post("api/ucty/rozmrazit", request);
    };

    // backendový GET požadavek pro ziskání configuračních údaju pro grid
    public static fetchGridConfig = (request : FetchGridRequest) : Promise<any> => {
        return instance.get(("api/core/grids/" + request.gridName));
    };

    // backendový POST požadavek pro vložení údaju gridu
    public static fetchGridData = (request : GridDataRequest, gridName : string) : Promise<any> => {
        return instance.post("api/core/grids/" + gridName + "/values", request)
    };

    // backendový GET požadavek pro ziskání údaju klienta
    public static fetchClientData = (request : FetchUserRequest, token : string) : Promise<any> => {
        const config = {
            headers: {
                Authorization: "Bearer " + token
            }
        };

        return instance.get('api/klienti/' + request.clientId, config);
    };

    // backendový POST požadavek pro vložení nové transakci
    public static addNewTransaction = (request : any) : Promise<any> => {
        return instance.post('api/transakce/novy', request);
    };

    // backendový POST požadavek pro zaplacení částky na úvěr
    public static payCredit = (request : any) : Promise<any> => {
        return instance.post("api/uvery/platba", request);
    };

    // backendový GET požadavek pro ziskání údajů karty podle ID
    public static fetchCardData = (request : FetchCardRequest) : Promise<any> => {
        return instance.get('api/karty/' + request.cardId);
    };

    // backendový GET požadavek pro ziskání údajů účtu podle ID
    public static fetchAccountData = (request : FetchAccountRequest) : Promise<any> => {
        return instance.get('api/ucty/' + request.accountId);
    };

    // backendový POST požadavek pro vložení nového účtu
    public static addNewAccount = (request : any) : Promise<any> => {
        return instance.post('api/ucty/novy', request);
    };

    // backendový PUT požadavek pro editace klientských dát
    public static updateClientData = (request : Client) : Promise<any> => {
        return instance.put('api/klienti/' + request.clientId, request);
    };

    // backendový PUT požadavek pro editace stavu adres klientů
    public static updateClientAddressState = (request : ClientAddress) : Promise<any> => {
        return instance.put('api/klienti/addressState', request);
    };

    // backendový POST požadavek pro vložení nové adresy
    public static createNewAddress = (request : Address) : Promise<any> => {
        return instance.post('api/adresy/novy', request);
    };

    // backendový PUT požadavek pro editace adresy
    public static updateAddressData = (request : Address) : Promise<any> =>{
        return instance.put('api/adresy/' + request.addressId, request);
    };

    // backendový POST požadavek pro vložení nového dokumentu
    public static saveNewDocument = (request : File, fileData : any) : Promise<any> => {
        const formData = new FormData();
        formData.append('file', fileData);
        formData.append('name', request.name ? request.name : '');
        formData.append('clientId', request.clientId ? String(request.clientId) : '');
        formData.append('typeId', request.type ? String(request.type) : '');

        const config = {headers: {'content-type': 'multipart/form-data'}};

        return instance.post('api/dokumenty/novy', formData, config);
    };

    // backendový GET požadavek pro ziskání údajů adresy podle ID
    public static fetchAddressData = (request : FetchAddressRequest) : Promise<any> => {
        return instance.get('api/adresy/' + request.addressId);
    };

    // backendový GET požadavek pro ziskání údajů klientů ná adresě podle ID adresy
    public static fetchClientsOnAddress = (request : FetchAddressRequest) : Promise<any> => {
        return instance.get('api/klienti/batch/' + request.addressId);
    };

    // backendový GET požadavek pro ziskání statistických údajů
    public static fetchAccountStats = () : Promise<any> => {
        return instance.get('api/stats/account');
    };

    // backendový GET požadavek pro ziskání údajů o kapitalu bánky
    public static fetchTotalBankCapital = () : Promise<any> => {
        return instance.get('api/stats/capital');
    };

    // backendový GET požadavek pro ziskání údajů o získu bánky za uvedené období
    public static fetchProfitOnPeriod = (request : FetchProfitRequest) : Promise<any> => {
        return instance.get('api/stats/profit/' + request.dateFrom + '/' + request.dateTo);
    };

    // backendový GET požadavek pro ziskání všech přáni
    public static fetchRecommendationData = () : Promise<any> => {
        return instance.get('api/prani/get');
    };

    public static declineRecommendations = (request : RecommendationsRequest) : Promise<any> => {
        return instance.post('api/prani/decline', request);
    };

    public static approveRecommendations = (request : RecommendationsRequest) : Promise<any> => {
        return instance.post('api/prani/approve', request);
    };

    public static addNewRecommendation = (request : NewRecommendationRequest) : Promise<any> => {
        return instance.post('api/prani/nove', request);
    };

}

export default Api;