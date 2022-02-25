import React from "react";
import Api from "../../../api/Api";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {Client} from "../../../Types";


interface ChangeClientDataDialogProps {
    open : boolean,
    handleClose : any,
    setMessage : any,
    setError : any,
    setClient : any,
    client : Client
}

interface ChangeClientDataDialogState {
    fields : Client,
    nameError : string,
    surnameError : string,
    contactNumberError : string,
    birthNumberError : string,
}

//třída reprezentující formulář pro změnu uživatelských údajů
class ClientDataDialog extends React.Component<ChangeClientDataDialogProps, ChangeClientDataDialogState>{

    state = {
        fields : this.props.client,
        nameError : '',
        surnameError : '',
        contactNumberError : '',
        birthNumberError : '',
    };

    setName = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, name : event.target.value}, nameError : ''});
    };

    setSurname = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, surname : event.target.value}, surnameError : ''});
    };

    setContactNumber = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, phoneNumber : event.target.value}, contactNumberError : ''});
    };

    setBirthNumber = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, birthNumber : event.target.value}, birthNumberError : ''});
    };

    validate = () : any => {

        let nameError = '';
        let surnameError = '';
        let contactNumberError = '';
        let birthNumberError = '';

        if (this.state.fields.name.length === 0){
            nameError = 'Jméno nesmí být prázdné';
        }

        if (this.state.fields.surname.length === 0){
            surnameError = 'Přijmení nesmí být prázdné';
        }

        if (this.state.fields.phoneNumber.length === 0){
            contactNumberError = 'Kontaktní číslo nesmí být prázdné';
        }
        else if (isNaN(Number(this.state.fields.phoneNumber))){
            contactNumberError = 'Kontaktní číslo nesmí obsahovat písmena';
        }

        if (this.state.fields.birthNumber.length === 0){
            birthNumberError = 'Rodné číslo nesmí být prázdné';
        }
        else if (isNaN(Number(this.state.fields.birthNumber))){
            birthNumberError = 'Rodné číslo nesmí obsahovat písmena';
        }

        return {
            nameError : nameError,
            surnameError : surnameError,
            contactNumberError : contactNumberError,
            birthNumberError : birthNumberError
        };

    };

    onSubmit = () : void => {
        const errors = this.validate();

        const {nameError, surnameError, birthNumberError, contactNumberError} = errors;
        if (nameError.length > 0 || surnameError.length > 0 || birthNumberError.length > 0 || contactNumberError.length > 0){
            this.setState({
                nameError : nameError,
                surnameError : surnameError,
                contactNumberError : contactNumberError,
                birthNumberError : birthNumberError}, () => {return});
        }
        else{
            const modifiedClientData : Client = this.state.fields;

            Api.updateClientData(modifiedClientData).then(response => {
                this.props.setMessage('Údaje byly úšpěšně změněny');
                this.props.setClient(response.data);
            }).catch(error => {
                this.props.setError('Došlo k chybě při změně údajů');
            });

            this.props.handleClose();
        }
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {
        const {nameError, surnameError, birthNumberError, contactNumberError} = this.state;

        return (
            <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Změna údajů</DialogTitle>
        <DialogContent>

        <DialogContentText>
            Zadejte nové hodnoty pro libovolné položky dole
        </DialogContentText>

        <TextField
        autoFocus
        margin="dense"
        id="name"
        label="Jméno"
        type="text"
        fullWidth
        value={this.state.fields.name}
        onChange={this.setName}
        error={nameError.length > 0}
        helperText={nameError}
        />

        <TextField
        margin="dense"
        id="surname"
        label="Přijmení"
        type="text"
        fullWidth
        value={this.state.fields.surname}
        onChange={this.setSurname}
        error={surnameError.length > 0}
        helperText={surnameError}
        />

        <TextField
        margin="dense"
        id="contactNumber"
        label="Kontaktní číslo"
        type="tel"
        fullWidth
        value={this.state.fields.phoneNumber}
        onChange={this.setContactNumber}
        error={contactNumberError.length > 0}
        helperText={contactNumberError}
        />

        <TextField
        margin="dense"
        id="birthNumber"
        label="Rodné číslo"
        type="tel"
        fullWidth
        value={this.state.fields.birthNumber}
        onChange={this.setBirthNumber}
        error={birthNumberError.length > 0}
        helperText={birthNumberError}
        />

        </DialogContent>

        <DialogActions>
        <Button onClick={() => {
            this.setState({
                fields : this.props.client,
                nameError : '',
                surnameError : '',
                contactNumberError : '',
                birthNumberError : ''}, () => {this.props.handleClose()})}}
        color="secondary">
            Zahodit zmény
        </Button>
        <Button onClick={() => {this.onSubmit()}}
        color="primary">
            Podtvrdit změny
        </Button>
        </DialogActions>
        </Dialog>
    );
    }


}

export default ClientDataDialog;