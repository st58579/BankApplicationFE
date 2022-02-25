import React, {Component} from "react";
import UserContext from "../../UserContext";
import {Redirect} from "react-router";
import {Card, Grid, TextField, Typography} from "@material-ui/core";
import AlertDialog from "../alertDialog/AlertDialog";
import Button from "@material-ui/core/Button";
import AddBoxIcon from '@material-ui/icons/AddBox';
import Api from "../../api/Api";
import MessageBox from "../messageBox/MessageBox";
import { withCookies, Cookies } from 'react-cookie';
import './LoginForm.css';
import CardContent from "@material-ui/core/CardContent";
import {default as MUIGrid} from "@material-ui/core/Grid/Grid";
import CardHeader from "@material-ui/core/CardHeader";

//třída zodpovědná za přihlašování
class LoginForm extends Component<any, any>{

    static contextType = UserContext;

    constructor(props : any, context : any) {
        super(props, context);
        this.state = {
            fields: {
                login: {value: '', error: ''},
                pass: {value: '', error: ''},
            },
            message : null,
            redirectToMain : false
        };
    }

    onChangeField = (evt : React.ChangeEvent<HTMLInputElement>) => {
        const fields = this.state.fields;
        const newValue = evt.target.value;
        if (newValue.endsWith(' ')){
            return;
        }

        //@ts-ignore
        fields[evt.target.name]['value'] = newValue;
        this.setState({fields : fields});
    };


    validate = ()  => {
        const fields = this.state.fields;
        let errorWasFound : boolean = false;

        const loginValue = fields.login.value;
        fields.login.error = '';

        if (loginValue === ''){
            fields.login.error = 'Jméno uživatele nesmí být prázdné';
            errorWasFound = true;
        }


        const pass = fields.pass.value;

        fields.pass.error = '';

        if (pass.length < 6){
            fields.pass.error = 'Heslo musí mít délku minimálně 6 znaků';
            errorWasFound = true;
        }

        this.setState({fields: fields});

        return !errorWasFound;
    };

    onSubmit = () => {
        if (!this.validate()){
            return;
        }


        Api.authenticateUser({username : this.state.fields.login.value.trim(), password : this.state.fields.pass.value.trim()})
            .then(response => {
                const data = response.data;
                const headers = response.headers;

                if (Number(data.active) === 0){
                    this.setError("Uživatel byl zablokován.");
                    return;
                }

                this.setState({redirectToMain : true});

                const user : any = {
                    login : data.login,
                    role : data.role,
                    jwt : headers.authorization,
                    clientId : data.clientId,
                    id : data.id
                };

                const {setUser} = this.context;
                setUser(user);
                const {cookies} = this.props;
                cookies.set('user', user, {maxAge : 60 * 60});

            }).catch(error => {this.setError("Špatné údaje.")});

    };

    private setMessage = (message : string) : void => {
        this.setState({message : {message : message, type : "info"}})
    };

    private setError = (message : string) : void => {
        this.setState({message : {message : message, type : "error"}})
    };

    private onCloseMessageBox = () : void => {
        this.setState({message : null})
    };


    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

        if (this.state.redirectToMain){
            return <Redirect to='/'/>;
        }

        return (
            this.renderOuterLayout()
        );
    }

    renderOuterLayout = () => {
        return (
            <div className='loginForm'>
                <Grid container spacing={2}>
                    <Grid item xs={false} md={1}/>

                    {this.renderFormLayout()}

                    <Grid item xs={false} md={1}/>
                </Grid>
            </div>
        );
    };

    renderFormLayout = () => {
        return (
            <Grid container item xs={12} md={10}>
                <div className='registrationForm'>
                    <Card className='registrationFormInfo'>
                        <CardHeader title='Kontaktní údaje:'/>
                        <CardContent>
                            <MUIGrid container>
                                <MUIGrid item xs ={2}>
                                    <Typography color="textSecondary" gutterBottom>
                                        Adresa:
                                    </Typography>
                                </MUIGrid>
                                <MUIGrid item xs ={10}>
                                    <Typography color="textPrimary" gutterBottom>
                                        221B Baker Street, London
                                    </Typography>
                                </MUIGrid>

                                <MUIGrid item xs ={2}>
                                    <Typography color="textSecondary" gutterBottom>
                                        Číslo:
                                    </Typography>
                                </MUIGrid>
                                <MUIGrid item xs ={10}>
                                    <Typography color="textPrimary" gutterBottom>
                                        +44 20 7234 3456
                                    </Typography>
                                </MUIGrid>

                                <MUIGrid item xs ={2}>
                                    <Typography color="textSecondary" gutterBottom>
                                        Email:
                                    </Typography>
                                </MUIGrid>
                                <MUIGrid item xs ={10}>
                                    <Typography color="textPrimary" gutterBottom>
                                        nejlepsi.banka@gmail.com
                                    </Typography>
                                </MUIGrid>
                            </MUIGrid>
                        </CardContent>
                    </Card>
                    <div className='separator'/>
                    <Grid item xs={false} md={3}/>
                    {this.state.message ? <MessageBox message={this.state.message.message} type={this.state.message.type} onClose={this.onCloseMessageBox}/> : null}
                    {this.renderForm()}
                    <Grid item xs={false} md={3}/>
                </div>
            </Grid>
        );
    };

    renderForm = () => {
        return (
            <div>
                {this.state.showError ? <AlertDialog text='Přihlášení se nepovedlo' closeFc={() => this.setState({showError: false})}/> : null}
                <Grid container item spacing={5} xs={12}>

                    <Grid item xs={3}/>

                    <Grid item xs={6}>
                        <Typography variant="h5" gutterBottom component="div" className='registrationLabel'>
                            Přihlášení:
                        </Typography>
                    </Grid>

                    <Grid item xs={3}/>

                    <Grid item xs={3}/>

                    <Grid item xs={6}>
                        <TextField
                            value={this.state.fields.login.value}
                            error={this.state.fields.login.error !== ''}
                            helperText={this.state.fields.login.error}
                            onChange={this.onChangeField}
                            name='login'
                            required
                            fullWidth
                            label="Uživatelské jméno"
                        />
                    </Grid>

                    <Grid item xs={3}/>

                    <Grid item xs={3}/>

                    <Grid item xs={6}>
                        <TextField
                            value={this.state.fields.pass.value}
                            error={this.state.fields.pass.error !== ''}
                            helperText={this.state.fields.pass.error}
                            onChange={this.onChangeField}
                            type='password'
                            name='pass'
                            required
                            fullWidth
                            label="Heslo"
                        />
                    </Grid>


                    <Grid item xs={3}/>


                    <Grid item xs={3}/>

                    <Grid item xs={6}>
                        <div className='buttonWrapper'>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={this.onSubmit}
                            >
                                <AddBoxIcon/> Přihlásit se
                            </Button>
                        </div>

                    </Grid>

                    <Grid item xs={3}/>

                </Grid>
            </div>

        );
    }
}

export default withCookies(LoginForm);