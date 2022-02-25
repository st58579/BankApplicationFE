import React from "react";
import {UserData} from "../../../Types";
import Api from "../../../api/Api";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import UserContext from "../../../UserContext";

//třída reprezentující formulář pro změnu hesla
class ChangePasswordDialog extends React.Component<any, any>{

    static contextType = UserContext;

    state = {
        password : '',
        repeatPassword : '',
        passwordError : '',
        passwordRepeatError : '',
    };

    setPassword = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({password : event.target.value});
    };

    setRepeatPassword = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({repeatPassword : event.target.value});
    };

    setPasswordError = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({passwordError : event.target.value});
    };

    setRepeatPasswordError = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({passwordRepeatError : event.target.value});
    };

    validate = () : any => {

        let passwordError = '';
        let passwordRepeatError = '';

        if (this.state.password.length === 0){
            passwordError = 'Heslo nesmí být prázdné';
        }

        if (this.state.password.length < 6){
            passwordError = 'Heslo nesmí být kratší než 6 znaků';
        }

        if (this.state.password !== this.state.repeatPassword){
            passwordRepeatError = 'Hesla musí být stejná';
        }

        return {
            passwordError : passwordError,
            passwordRepeatError : passwordRepeatError
        };

    };

    onSubmit = () : void => {
        const errors = this.validate();

        const {user} : {user : UserData;} = this.context;

        let effectiveUser = {...user};

        if (user.emulate){
            effectiveUser.id = user.emulate.id;
            effectiveUser.login = user.emulate.login;
            effectiveUser.clientId = user.emulate.clientId;
            effectiveUser.role = user.emulate.role;
        }

        const {passwordError, passwordRepeatError} = errors;
        if (passwordError.length > 0 || passwordRepeatError.length > 0){
            this.setState({
                passwordError : passwordError,
                passwordRepeatError :passwordRepeatError}, () => {return});
        }
        else{
            const newPassword : string = this.state.password;

            Api.changePassword({id : this.props.userId, password : newPassword}, effectiveUser.jwt).then(response => {
                this.props.setMessage('Heslo bylo úšpěšně změněno');

            }).catch(error => {
                this.props.setError('Došlo k chybě při změně hesla');
            });

            this.props.handleClose();
        }
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {
        const {passwordError, passwordRepeatError} = this.state;

        return (
            <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Změna hesla</DialogTitle>
                <DialogContent>

                    <DialogContentText>
                        Zadejte nové heslo
                    </DialogContentText>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Heslo"
                        type="password"
                        fullWidth
                        value={this.state.password}
                        onChange={this.setPassword}
                        error={passwordError.length > 0}
                        helperText={passwordError}
                    />

                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Opakování heslo"
                        type="password"
                        fullWidth
                        value={this.state.repeatPassword}
                        onChange={this.setRepeatPassword}
                        error={passwordRepeatError.length > 0}
                        helperText={passwordRepeatError}
                    />


                </DialogContent>

                <DialogActions>
                    <Button onClick={()  => {this.props.handleClose()}}
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

export default ChangePasswordDialog;