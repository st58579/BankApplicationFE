import React from "react";
import './ClientInfo.css';
import ClientInfoCard from "../clientInfoCard/ClientInfoCard";
import RoutableGrid from '../routableGrid/RoutableGrid';
import {SearchCondition} from "../../gridomizer/domain/GridData";
import {SEARCHTYPE} from "../../gridomizer/domain/GridConfig";
import {CircularProgress} from "@material-ui/core";
import Api from "../../api/Api";
import Button from "@material-ui/core/Button";
import MessageBox, {MessageBoxProps} from "../messageBox/MessageBox";
import FileDialog from '../dialogs/fileDialog/FileDialog';
import {Client, UserData} from "../../Types";
import ClientDataDialog from "../dialogs/clientDataDialog/ClientDataDialog";
import AddressDialog from "../dialogs/addressDialog/AdressDialog";
import AccountDialog from "../dialogs/accountDialog/AccountDialog";
import UserContext from "../../UserContext";
import {Redirect} from "react-router";
import NewAdminUserDialog from "../dialogs/newAdminUserDialog/NewAdminUserDialog";

interface ClientInfoProps{
    match : any
}

interface ClientInfoState {
    loading : boolean,
    client : Client | undefined,
    showChangeDataDialog : boolean,
    showAddNewAddressDialog : boolean,
    showAddNewFileDialog : boolean,
    showAddNewAccountDialog : boolean,
    showAddNewUserDialog : boolean,
    message? : any
    addressesGridKey : number,
    accountGridKey : number,
    filesGridKey : number,
    userGridKey : number,
    redirectToMain : boolean
}

//třída reprezentující informace o klientovi
class ClientInfo extends React.Component<ClientInfoProps, ClientInfoState>{

    static contextType = UserContext;

    constructor(props: ClientInfoProps, context: any) {
        super(props, context);
        this.state = {
            loading : true,
            client: undefined,
            showChangeDataDialog : false,
            showAddNewAddressDialog : false,
            showAddNewAccountDialog : false,
            showAddNewUserDialog : false,
            addressesGridKey: 1,
            filesGridKey: 1,
            accountGridKey: 1,
            userGridKey: 1,
            showAddNewFileDialog : false,
            redirectToMain : false
        };
    }

    private generateRandomNumber = (min : number, max : number, except : number) =>  {
        let result : number;
        do {
            result = Math.floor(Math.random() * (max - min) + min);
        } while (result === except);
        return result;
    };

    private setUserGridKey = () : void => {
        const key = this.generateRandomNumber(1, 100, this.state.userGridKey);
        this.setState({userGridKey : key});
    };

    private setAddressGridKey = () : void => {
        const key = this.generateRandomNumber(1, 100, this.state.addressesGridKey);
        this.setState({addressesGridKey : key});
    };

    private setFileGridKey = () : void => {
        const key = this.generateRandomNumber(1, 100, this.state.addressesGridKey);
        this.setState({filesGridKey : key});
    };

    private setAccountGridKey = () : void => {
        const key = this.generateRandomNumber(1, 100, this.state.accountGridKey);
        this.setState({accountGridKey : key});
    };

    private onCloseMessageBox = () : void => {
        this.setState({message : null})
    };

    private setClient = (client : Client) : void => {
      this.setState({client : client});
    };

    private setMessage = (message : string) : void => {
        this.setState({message : {message : message, type : "info"}})
    };

    private setError = (message : string) : void => {
        this.setState({message : {message : message, type : "error"}})
    };

    private closeAddNewFileDialog = () : void => {
        this.setState({showAddNewFileDialog : false});
    };

    private openAddNewFileDialog = () : void => {
        this.setState({showAddNewFileDialog : true});
    };

    private closeChangeClientDataDialog = () : void => {
        this.setState({showChangeDataDialog : false});
    };

    private openChangeClientDataDialog = () : void => {
        this.setState({showChangeDataDialog : true});
    };

    private closeAddNewAddressDialog = () : void => {
        this.setState({showAddNewAddressDialog : false});
    };

    private openAddNewAddressDialog = () : void => {
        this.setState({showAddNewAddressDialog : true});
    };

    private closeAddNewAccountDialog = () : void => {
        this.setState({showAddNewAccountDialog : false});
    };

    private openAddNewUserDialog = () : void => {
        this.setState({showAddNewUserDialog : true});
    };

    private openAddNewAccountDialog = () : void => {
        this.setState({showAddNewAccountDialog : true});
    };

    private closeAddNewUserDialog = () : void => {
        this.setState({showAddNewUserDialog : false});
    };



    componentDidMount(): void {


        const {user} : {user : UserData;} = this.context;

        if (!user){
            this.setState({redirectToMain : true});
            return;
        }


        const token = user.jwt;


        Api.fetchClientData({clientId : this.props.match.params.clientID}, token).then( response => {
                this.setState(
                    {
                        loading : false,
                        client : response.data
                    }
                );
            }
        ).catch(error => this.setState({redirectToMain : true}));
    }

    renderButtons() {
        const {user} : {user : UserData;} = this.context;

        let effectiveUser = {...user};

        if (user.emulate){
            effectiveUser.login = user.emulate.login;
            effectiveUser.clientId = user.emulate.clientId;
            effectiveUser.role = user.emulate.role;
        }

        return (
          <div className='buttonBlockClientInfo'>
              <Button variant="contained" color="primary" onClick={this.openChangeClientDataDialog}>
                  Editovat údaje
              </Button>
              <Button variant="contained" color="primary" onClick={this.openAddNewAddressDialog}>
                  Přidat novou adresu
              </Button>

              {effectiveUser.role === 'ADMIN' ? <Button variant="contained" color="primary" onClick={this.openAddNewAccountDialog}>
                  Otevřit nový účet
              </Button> : null}

              {effectiveUser.role === 'ADMIN' ? <Button variant="contained" color="primary"  onClick={this.openAddNewFileDialog}>
                  Přidat nový dokument
              </Button> : null}

              {effectiveUser.role === 'ADMIN' ? <Button variant="contained" color="primary"  onClick={this.openAddNewUserDialog}>
                  Vytvořit nového uživatele
              </Button> : null}


          </div>
        );

    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {

        if (this.state.redirectToMain){
            return <Redirect to='/'/>
        }

        const addressSearchConditions : SearchCondition[] = [];

        const idAddressSearchCondition : SearchCondition = {searchType : SEARCHTYPE.EQUALS,
            fieldName : "clientId", value1 : this.props.match.params.clientID};

        addressSearchConditions.push(idAddressSearchCondition);

        const accountSearchConditions : SearchCondition[] = [];

        const idAccountSearchCondition : SearchCondition = {searchType : SEARCHTYPE.EQUALS, fieldName : "clientId", value1 : this.props.match.params.clientID};

        accountSearchConditions.push(idAccountSearchCondition);

        addressSearchConditions.push(idAddressSearchCondition);

        const documentSearchConditions : SearchCondition[] = [];

        const clientIdDocumentSearchConditions : SearchCondition = {searchType : SEARCHTYPE.EQUALS, fieldName : "clientId", value1 : this.props.match.params.clientID};

        documentSearchConditions.push(clientIdDocumentSearchConditions);

        if (this.state.loading){
            return <CircularProgress />;
        }

        const client : any  = this.state.client;
        const {user} : {user : UserData;} = this.context;

        let effectiveUser = {...user};
        if (user.emulate){
            effectiveUser.login = user.emulate.login;
            effectiveUser.clientId = user.emulate.clientId;
            effectiveUser.role = user.emulate.role;
        }

        return (
            <div className='clientInfo'>
                    {this.state.message ? <MessageBox message={this.state.message.message} type={this.state.message.type} onClose={this.onCloseMessageBox}/> : null}
                    <ClientInfoCard id={client?.id} name={client?.name} surname={client?.surname} birthNumber={client?.birthNumber} phoneNumber={client?.phoneNumber}/>
                    {this.renderButtons()}
                    <div className='separator'/>
                    {effectiveUser.role === 'ADMIN' ? <RoutableGrid gridName='Addresses' searchConditions={addressSearchConditions}
                                                                    key={'AGK-' + this.state.addressesGridKey} linkToRoute='addresses/'/>
                                                                    : <RoutableGrid gridName='Addresses' searchConditions={addressSearchConditions} key={'AGK-' + this.state.addressesGridKey}/>}
                    {/*<RoutableGrid gridName='Addresses' searchConditions={addressSearchConditions} key={'AGK-' + this.state.addressesGridKey} linkToRoute='addresses/'/>*/}
                    <div className='separator'/>
                    <RoutableGrid gridName='Accounts' searchConditions={accountSearchConditions} key={'ACGK-' + this.state.accountGridKey} linkToRoute={'ucty/'}/>
                    <div className='separator'/>
                    <RoutableGrid gridName='Documents' searchConditions={documentSearchConditions} key={'DGK-' + this.state.filesGridKey}/>

                    <ClientDataDialog open={this.state.showChangeDataDialog} handleClose={this.closeChangeClientDataDialog} client={client}
                                            setMessage={this.setMessage} setError={this.setError} setClient={this.setClient}
                    />
                    <AddressDialog open={this.state.showAddNewAddressDialog} handleClose={this.closeAddNewAddressDialog} setKey={this.setAddressGridKey}
                                   setMessage={this.setMessage} setError={this.setError} address={{clientId: this.props.match.params.clientID}}
                                   setAddress={undefined}
                    />

                    <FileDialog open={this.state.showAddNewFileDialog}
                                handleClose={this.closeAddNewFileDialog}
                                setMessage={this.setMessage}
                                setError={this.setError}
                                setKey={this.setFileGridKey} file={{clientId: this.props.match.params.clientID}}
                    />

                    <AccountDialog open={this.state.showAddNewAccountDialog}
                                   handleClose={this.closeAddNewAccountDialog}
                                   setMessage={this.setMessage}
                                   setError={this.setError}
                                   setKey={this.setAccountGridKey}
                                   clientId={this.props.match.params.clientID}
                    />

                    <NewAdminUserDialog open={this.state.showAddNewUserDialog}
                                        handleClose={this.closeAddNewUserDialog}
                                        setMessage={this.setMessage}
                                        setError={this.setError}
                                        setKey={this.setUserGridKey}
                                        createAdmin={false}
                                        clientId={client.clientId}

                    />

            </div>
        );
    }


}

export default ClientInfo;