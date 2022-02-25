import React from "react";
import Api from "../../api/Api";
import {CircularProgress} from "@material-ui/core";
import MessageBox from "../messageBox/MessageBox";
import Button from "@material-ui/core/Button";
import AddressInfoCard from "../addrressInfoCard/AddressInfoCard";
import RoutableGrid from "../routableGrid/RoutableGrid";
import {SearchCondition} from "../../gridomizer/domain/GridData";
import {SEARCHTYPE} from "../../gridomizer/domain/GridConfig";
import {Address, Client, ClientAddress} from "../../Types";
import AddressDialog from "../dialogs/addressDialog/AdressDialog";
import AddressClientDialog from "../dialogs/addressDialog/AddressClientDialog";

interface AddressInfoProps{
    match : any
}

interface AddressInfoState{
    loading : boolean,
    address : Address | undefined,
    clientAddresses : ClientAddress[] | undefined,
    showChangeDataDialog : boolean,
    showActivateAddressDialog : boolean,
    addressesGridKey : number,
    addressClientDialogKey : number,
    message? : any
}

//třída reprezentující informace o adresě
class AddressInfo extends React.Component<AddressInfoProps, AddressInfoState>{

    constructor(props: AddressInfoProps, context: any) {
        super(props, context);
        this.state = {loading : true,
            address: undefined,
            clientAddresses : undefined,
            showChangeDataDialog : false,
            addressesGridKey : 1,
            addressClientDialogKey : 1,
            showActivateAddressDialog : false};
    }

    componentDidMount(): void {
        Api.fetchAddressData({addressId : this.props.match.params.addressID}).then( response => {
                this.setState(
                    {
                        loading : false,
                        address : response.data
                    }
                );
            }
        );
        Api.fetchClientsOnAddress({addressId : this.props.match.params.addressID}).then(response => {
            this.setState(
                {
                    clientAddresses : response.data
                }
            );
        });
    }

    private openChangeAddressDataDialog = () : void => {
        this.setState({showChangeDataDialog : true});
    };

    private closeChangeAddressDataDialog = () : void => {
        this.setState({showChangeDataDialog : false});
    };

    private openActivateAddressDialog = () : void => {
        this.setState({showActivateAddressDialog : true});
    };

    private closeActivateAddressDialog = () : void =>{
        this.setState({showActivateAddressDialog : false});
    };

    private onCloseMessageBox = () : void => {
        this.setState({message : null})
    };

    private setMessage = (message : string) : void => {
        this.setState({message : {message : message, type : "info"}})
    };

    private setError = (message : string) : void => {
        this.setState({message : {message : message, type : "error"}})
    };

    private setAddressGridKey = () : void => {
        const key = this.generateRandomNumber(1, 100, this.state.addressesGridKey);
        this.setState({addressesGridKey : key});
    };

    private setAddressClientDialogKey = () : void => {
        const key = this.generateRandomNumber(1, 100, this.state.addressClientDialogKey);
        this.setState({addressClientDialogKey : key});
    };

    private generateRandomNumber = (min : number, max : number, except : number) =>  {
        let result : number;
        do {
            result = Math.floor(Math.random() * (max - min) + min);
        } while (result === except);
        return result;
    };

    private setAddress = (address : Address) : void =>{
        this.setState({address : address});
    };

    renderButtons() {
        return (
            <div className='buttonBlockClientInfo'>
                <Button variant="contained" color="primary" onClick={this.openChangeAddressDataDialog} >
                    Editovat údaje
                </Button>
                <Button variant="contained" color="primary" onClick={this.openActivateAddressDialog}>
                    Aktualizace adres
                </Button>
            </div>
        );
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} |
        Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {

        const addressClientSearchConditions : SearchCondition[] = [];
        const idAddressSearchClientsCondition : SearchCondition = {searchType : SEARCHTYPE.EQUALS,
            fieldName : "addressId", value1 : this.props.match.params.addressID};
        addressClientSearchConditions.push(idAddressSearchClientsCondition);

        if (this.state.loading){
            return <CircularProgress />;
        }

        const address : any  = this.state.address;

        const clientAddresses : any = this.state.clientAddresses;

        return (
            <div className='clientInfo'>
                <div className='separator'/>

                {this.state.message ? <MessageBox message={this.state.message.message} type={this.state.message.type}
                                                  onClose={this.onCloseMessageBox}/> : null}

                <AddressInfoCard addressId={address?.addressId} clientId={address?.clientId}
                                 houseNumber={address?.houseNumber} street={address?.street} town={address?.town}
                                 postalCode={address?.postalCode} countryCode={address?.countryCode}/>
                <div className='separator'/>

                {this.renderButtons()}

                <div className='separator'/>

                <RoutableGrid gridName='ClientAddresses' label={"Klienti adresy"} searchConditions={addressClientSearchConditions}
                              linkToRoute={'clients/' + this.state.address?.clientId}/>

                <div className='separator'/>

                <AddressDialog open={this.state.showChangeDataDialog}
                               handleClose={this.closeChangeAddressDataDialog}
                               setAddress={this.setAddress}
                               setMessage={this.setMessage}
                               setError={this.setError}
                               setKey={this.setAddressGridKey}
                               address={address}
                />

                <AddressClientDialog open={this.state.showActivateAddressDialog}
                                     handleClose={this.closeActivateAddressDialog}
                                     setAddress={this.setAddress}
                                     setKey={this.setAddressClientDialogKey}
                                     address={address}
                                     clients={clientAddresses}
                                     key = {"ACD-" + this.state.addressClientDialogKey}
                />
            </div>
        );
    }
}

export default AddressInfo;