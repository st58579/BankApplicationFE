import React from "react";
import {Client} from "../../../Types";
import Api, {NewUserRequest} from "../../../api/Api";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import UserContext from "../../../UserContext";
import {withCookies} from "react-cookie";

//třída reprezentující formulář pro vytváření nového spravce
class NewAdminUserDialog extends React.Component<any, any>{

    static contextType = UserContext;

    constructor(props : any, context : any) {
        super(props, context);
        this.state = {
            fields : {
                login : '',
                password : ''
            },
            loginError : '',
            passwordError : ''
        };
    }


    setLogin = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, login : event.target.value}, loginError : ''});
    };

    setPassword = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, password : event.target.value}, passwordError : ''});
    };


    validate = () : any => {

        let loginError = '';
        let passwordError = '';

        if (this.state.fields.login.length === 0){
            loginError = 'Login nesmí být prázdný';
        }

        if (this.state.fields.password.length === 0){
            passwordError = 'Heslo nesmí být prázdné';
        }

        return {
            loginError : loginError,
            passwordError : passwordError,

        };

    };

    onSubmit = () : void => {
        const errors = this.validate();


        const {loginError, passwordError} = errors;
        if (loginError.length > 0 || passwordError.length > 0){
            this.setState({
                nameError : loginError,
                surnameError : passwordError}, () => {return});
        }
        else{

            const modifiedUserData : any = this.state.fields;

            const {user} = this.context;

            const userRequest : NewUserRequest = {
                login : modifiedUserData.login,
                password : modifiedUserData.password,
                registeredBy : user.id,
                role : this.props.createAdmin ? "ADMIN" : "USER",
                clientId : this.props.clientId ? this.props.clientId : null
            };


            Api.addNewAdminUser(userRequest, user.jwt).then(response => {
                if (this.props.createAdmin){
                    this.props.setMessage('Nový správce byl úspěšně vytvořen');
                } else {
                    this.props.setMessage('Nový uživatel byl úspěšně vytvořen');
                }

                this.props.setKey();
            }).catch(error => {
                if (this.props.createAdmin){
                    this.props.setError('Při vytvoření správce došlo k chybě');
                } else {
                    this.props.setError('Při vytvoření uživatele došlo k chybě');
                }
            });

            /*Api.updateClientData(modifiedClientData).then(response => {
                this.props.setMessage('Údaje byly úšpěšně změněny');
                this.props.setClient(response.data);
            }).catch(error => {
                this.props.setError('Došlo k chybě při změně údajů');
            });*/

            this.props.handleClose();
        }
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {
        const {loginError, passwordError} = this.state;

        return (
            <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{this.props.createAdmin ? "Nový spravce" : "Nový uživatel"}</DialogTitle>
                <DialogContent>

                    <DialogContentText>
                        Zadejte login a heslo
                    </DialogContentText>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="login"
                        label="Login"
                        type="text"
                        fullWidth
                        value={this.state.fields.login}
                        onChange={this.setLogin}
                        error={loginError.length > 0}
                        helperText={loginError}
                    />

                    <TextField
                        margin="dense"
                        id="surname"
                        label="Heslo"
                        type="password"
                        fullWidth
                        value={this.state.fields.password}
                        onChange={this.setPassword}
                        error={passwordError.length > 0}
                        helperText={passwordError}
                    />

                </DialogContent>

                <DialogActions>
                    <Button className='newAdminButton'
                        onClick={() => {
                        this.setState({
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

// @ts-ignore
export default withCookies(NewAdminUserDialog);