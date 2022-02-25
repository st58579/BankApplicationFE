import React from "react";
import Api from "../../../api/Api";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {Address} from "../../../Types";

interface AddNewAddressDialogProps {
    open : boolean,
    handleClose : any,
    setMessage : any,
    setError : any,
    setAddress: any,
    setKey : any,
    address : Address
}

interface AddNewAddressDialogState {
    fields :  Address,
    houseNumberError : string,
    streetError : string,
    townError : string,
    postalCodeError : string,
    countryCodeError : string;
}

//třída reprezentující editační formulář pro adresu
class AddressDialog extends React.Component<AddNewAddressDialogProps, AddNewAddressDialogState>{

    constructor(props: AddNewAddressDialogProps, context: any) {
        super(props, context);

        let fields = this.props.address;
        if (fields.houseNumber === undefined){
            fields.houseNumber = '';
        }
        if (fields.street === undefined){
            fields.street = '';
        }
        if (fields.town === undefined){
            fields.town = '';
        }
        if (fields.postalCode === undefined){
            fields.postalCode = '';
        }
        if (fields.countryCode === undefined){
            fields.countryCode= '';
        }

        this.state = {
            fields : fields,
            houseNumberError : '',
            streetError : '',
            townError : '',
            postalCodeError : '',
            countryCodeError : '',
        };
    }

    setHouseNumber = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, houseNumber : event.target.value}, houseNumberError : ''});
    };

    setStreet = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, street : event.target.value}, streetError : ''});
    };

    setTown = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, town : event.target.value}, townError : ''});
    };

    setPostalCode = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, postalCode : event.target.value}, postalCodeError : ''});
    };

    setCountryCode = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, countryCode : event.target.value}, countryCodeError : ''});
    };

    validate = () : any => {
        let houseNumberError = '';
        let streetError = '';
        let townError  = '';
        let postalCodeError = '';
        let countryCodeError = '';

        if (this.state.fields.houseNumber?.length === 0){
            houseNumberError = 'Číslo popisné nesmí být prázdné';
        }
        else if (isNaN(Number(this.state.fields.houseNumber))){
            houseNumberError = 'Císlo popisné nesmí obsahovat písmena';
        }

        if (this.state.fields.street?.length === 0){
            streetError = 'Ulice nesmí být prázdná';
        }

        if (this.state.fields.town?.length === 0){
            townError = 'Měst nesmí být prázdné';
        }

        if (this.state.fields.postalCode?.length === 0){
            postalCodeError = "PSČ nesmí být prázdné";
        }
        else if (isNaN(Number(this.state.fields.postalCode))){
            postalCodeError = "PSČ nesmí obsahovat písmena";
        }

        if (this.state.fields.countryCode?.length === 0){
            countryCodeError = "Kód země nesmí být prázdný";
        }
        else if (this.state.fields.countryCode && (this.state.fields.countryCode?.length < 2 || this.state.fields.countryCode?.length > 3)){
            countryCodeError = "Kód země musí obsahovat 2 nebo 3 písmena";
        }

        return {
            houseNumberError : houseNumberError,
            streetError : streetError,
            townError : townError,
            postalCodeError : postalCodeError,
            countryCodeError : countryCodeError
        };

    };

    onSubmit = () : void => {
        const errors = this.validate();

        const {houseNumberError, streetError, townError, postalCodeError, countryCodeError} = errors;
        if (houseNumberError.length > 0 || streetError.length > 0 || townError.length > 0 || postalCodeError.length > 0 || countryCodeError.length > 0){
            this.setState({
                houseNumberError : houseNumberError,
                streetError : streetError,
                townError : townError,
                postalCodeError : postalCodeError,
                countryCodeError : countryCodeError
            }, () => {this.forceUpdate()});
        }
        else{
            const modifiedAddressData : Address = {...this.state.fields, clientId : this.props.address.clientId};

            if(!modifiedAddressData.addressId){
                Api.createNewAddress(modifiedAddressData).then(response => {
                    this.props.setMessage('Nová adresa byla úspěšné přidana.');
                    this.props.setKey();
                }).catch(error => {
                    this.props.setError('Při vložení adresy došlo k chybě');
                });
            } else {
                Api.updateAddressData(modifiedAddressData).then(response => {
                    this.props.setMessage('Adresa byla úspěšně změněna.');
                    this.props.setKey();
                    this.props.setAddress(response.data);
                }).catch(error => {
                    this.props.setError('Došlo k chybě při změně adresy');
                });
            }

            this.props.handleClose();
        }
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {

        const {houseNumberError, streetError, townError, postalCodeError, countryCodeError} = this.state;

        return (
            <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Nová adresa</DialogTitle>
                <DialogContent>

                    <DialogContentText>
                        Zadejte údaje pro novou adresu
                    </DialogContentText>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="houseNumber"
                        label="Číslo popisné"
                        type="text"
                        fullWidth
                        value={this.state.fields.houseNumber}
                        onChange={this.setHouseNumber}
                        error={houseNumberError.length > 0}
                        helperText={houseNumberError}
                    />

                    <TextField
                        margin="dense"
                        id="street"
                        label="Ulice"
                        type="text"
                        fullWidth
                        value={this.state.fields.street}
                        onChange={this.setStreet}
                        error={streetError.length > 0}
                        helperText={streetError}
                    />

                    <TextField
                        margin="dense"
                        id="town"
                        label="Město"
                        type="text"
                        fullWidth
                        value={this.state.fields.town}
                        onChange={this.setTown}
                        error={townError.length > 0}
                        helperText={townError}
                    />

                    <TextField
                        margin="dense"
                        id="postalCode"
                        label="PSČ"
                        type="tel"
                        fullWidth
                        value={this.state.fields.postalCode}
                        onChange={this.setPostalCode}
                        error={postalCodeError.length > 0}
                        helperText={postalCodeError}
                    />

                    <TextField
                        margin="dense"
                        id="countryCode"
                        label="Kód země"
                        type="text"
                        fullWidth
                        value={this.state.fields.countryCode}
                        onChange={this.setCountryCode}
                        error={countryCodeError.length > 0}
                        helperText={countryCodeError}
                    />

                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {
                        this.setState({
                            fields : this.props.address,
                            houseNumberError : '',
                            streetError : '',
                            townError : '',
                            countryCodeError : '',
                            postalCodeError : ''
                        }, () => {this.props.handleClose()})}}
                            color="secondary">
                        Zahodit změny
                    </Button>
                    <Button onClick={this.onSubmit} color="primary">
                        {this.props.address.addressId === undefined ? "Vložit adresu" : "Potvrdit změny"}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }


}

export default AddressDialog;