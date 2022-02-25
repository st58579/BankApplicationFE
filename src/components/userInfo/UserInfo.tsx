import React from "react";
import {Redirect} from "react-router";
import UserContext from "../../UserContext";
import {UserData} from "../../Types";
import {CircularProgress} from "@material-ui/core";
import MessageBox from "../messageBox/MessageBox";
import './UserInfo.css';
import UserInfoCard from "../userInfoCard/UserInfoCard";
import Api from "../../api/Api";
import Button from "@material-ui/core/Button";
import ChangePasswordDialog from "../dialogs/changePasswordDialog/ChangePasswordDialog";

interface UserInfoProps {
    match : any
}

interface UserInfoState {
    loading : boolean,
    login? : string,
    role? : string,
    clientName? : string | null,
    registeredByLogin? : string | null,
    active? : boolean | null
    message? : any,
    showChangePasswordDialog : boolean,
    id? : number | null,
    user? : UserData | null | undefined,
    infoCardKey : number,
}

//třída reprezentující informace o uživateli
class UserInfo extends React.Component<UserInfoProps, UserInfoState> {

    static contextType = UserContext;

    constructor(props : any, context : any) {
        super(props, context);
        this.state = {
            loading : true,
            showChangePasswordDialog : false,
            infoCardKey : 1
        }
    }

    private generateRandomNumber = (min : number, max : number, except : number) =>  {
        let result : number;
        do {
            result = Math.floor(Math.random() * (max - min) + min);
        } while (result === except);
        return result;
    };

    private setInfoCardKey = () : void => {
        const key = this.generateRandomNumber(1, 100, this.state.infoCardKey);
        this.setState({infoCardKey : key});
    };

    componentDidMount(): void {
        const {user} : {user : UserData;} = this.context;
        const actualUser = user;

        if (!actualUser){
            return;
        }

        Api.getUserById(this.props.match.params.userId, actualUser.jwt).then(response => {
            const user = response.data;
            this.setState({
                id : user.id,
                login : user.login,
                role : user.role,
                registeredByLogin : user.registeredByLogin,
                active : user.active,
                user : user,
            });

            if (user.role === 'ADMIN'){
                this.setState({loading : false});
                return;
            }

            Api.fetchClientData({clientId : user.clientId}, actualUser.jwt).then(response => {
               const info = response.data;
               this.setState({
                   clientName : info.name + ' ' + info.surname,
                   loading : false
               });
            });

        });

    }

    private showChangePasswordDialog = () : void => {
        this.setState({showChangePasswordDialog : true});
    };

    private closeChangePasswordDialog = () : void => {
        this.setState({showChangePasswordDialog : false});
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

    private resetPassword = () : void => {
        const {user} : {user : UserData;} = this.context;
        const actualUser = user;

        Api.resetUserPasswordById(this.props.match.params.userId, actualUser.jwt).then(result => {
            this.setMessage("Hesl bylo úspěšně resetovano");
        }).catch(error => {
            this.setError("Vyskytla se chyba");
        });
    };

    private blockUser = () : void => {
        const {user} : {user : UserData;} = this.context;
        const actualUser = user;

        Api.blockUserById(this.props.match.params.userId, actualUser.jwt).then(result => {
            this.setMessage("Uživatel byl úspěšně zablokovan");
            this.setState({active : false});
        }).catch(error => {
            this.setError("Vyskytla se chyba");
        });
    };

    private unblockUser = () : void => {
        const {user} : {user : UserData;} = this.context;
        const actualUser = user;

        Api.unblockUserById(this.props.match.params.userId, actualUser.jwt).then(result => {
            this.setMessage("Uživatel byl úspěšně odblokovan");
            this.setState({active : true});
        }).catch(error => {
            this.setError("Vyskytla se chyba");
        });
    };

    private setUser = (user : UserData) : void => {

        console.error("SETTING USER DATA : ", user);

        let reader = new FileReader();
        reader.onloadend = () => {
            this.setState({id : user.id,
                login : user.login,
                role : user.role,
                user : {...user, image : reader.result}
            });
        };
        reader.readAsDataURL(user.image);

        this.setInfoCardKey();
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {

        const {user} : {user : UserData;} = this.context;

        if (!user){
            return <Redirect to='/'/>
        }

        let effectiveUser = {...user};

        if (user.emulate){
            effectiveUser.id = user.emulate.id;
            effectiveUser.login = user.emulate.login;
            effectiveUser.clientId = user.emulate.clientId;
            effectiveUser.role = user.emulate.role;
        }

        if (!effectiveUser){
            return <Redirect to='/'/>
        }

        if (this.state.loading){
            return <CircularProgress />;
        }


        if (effectiveUser.role === "USER" && this.state.login !== effectiveUser.login){
            return <Redirect to='/'/>
        }

        return (
          <div className='userInfo'>
              {this.state.message ? <MessageBox message={this.state.message.message} type={this.state.message.type} onClose={this.onCloseMessageBox}/> : null}
              <UserInfoCard role={this.state.role ? this.state.role : ''}
                            login={this.state.login ? this.state.login :''}
                            createdBy={this.state.registeredByLogin}
                            clientName={this.state.clientName}
                            setMessage={this.setMessage}
                            setError={this.setError}
                            user={this.state.user}
                            setUser={this.setUser}
                            userId={Number(this.state.id)}
                            image={this.state.user?.image}
                            key={'UIC-' + this.state.infoCardKey}

              />
              {this.state.role === "USER" && effectiveUser.role === "ADMIN" ? <div className='buttonBlockClientInfo'>

                  {Number(this.state.active) === 1 ? <Button variant="contained" color="primary" onClick={this.blockUser}>
                      Zablokovat uživatele
                  </Button> : <Button variant="contained" color="primary" onClick={this.unblockUser}>
                      Odblokovat uživatele
                  </Button>}

                  <Button variant="contained" color="primary" onClick={this.resetPassword}>
                      Resetovat heslo
                  </Button>

                  </div>
                  : null
              }

              {this.state.role === "USER" && effectiveUser.role === "USER" ? <Button variant="contained" color="primary" onClick={this.showChangePasswordDialog}>
                  Změnit heslo
              </Button> : null}

              {this.state.role === "ADMIN" && effectiveUser.role === "ADMIN" && effectiveUser.login === this.state.login ? <Button variant="contained" color="primary" onClick={this.showChangePasswordDialog}>
                  Změnit heslo
              </Button> : null}


              <ChangePasswordDialog open={this.state.showChangePasswordDialog}
                                    handleClose={this.closeChangePasswordDialog}
                                    setMessage={this.setMessage}
                                    setError={this.setError}
                                    userId={this.state.id}
              />

          </div>
        );

    }

};

export default UserInfo;