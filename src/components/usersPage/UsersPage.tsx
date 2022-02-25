import React from "react";
import RoutableGrid from "../routableGrid/RoutableGrid";
import Button from "@material-ui/core/Button";
import NewAdminUserDialog from "../dialogs/newAdminUserDialog/NewAdminUserDialog";
import './UsersPage.css';
import MessageBox from "../messageBox/MessageBox";

interface UsersPageState {
    showNewAdminUserDialog : boolean
    usersGridKey : number,
    message? : any
}

class UsersPage extends React.Component<any, UsersPageState>{

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            showNewAdminUserDialog : false,
            usersGridKey : 1
        };
    }

    private generateRandomNumber = (min : number, max : number, except : number) =>  {
        let result : number;
        do {
            result = Math.floor(Math.random() * (max - min) + min);
        } while (result === except);
        return result;
    };

    private setUsersGridKey = () : void => {
        const key = this.generateRandomNumber(1, 100, this.state.usersGridKey);
        this.setState({usersGridKey : key});
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

    private showNewAdminUserDialog = () => {
        this.setState({showNewAdminUserDialog : true});
    };

    private closeNewAdminUserDialog = () => {
        this.setState({showNewAdminUserDialog : false});
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {
        return <div className='usersPage'>

            {this.state.message ? <MessageBox message={this.state.message.message} type={this.state.message.type} onClose={this.onCloseMessageBox}/> : null}

            <div className='newAdminButton'>
                <Button variant="contained" color="primary" onClick={this.showNewAdminUserDialog}>
                    Nový správce
                </Button>
            </div>


            <RoutableGrid gridName={'Users'} label='Uživatelé' key={'UGK-' + this.state.usersGridKey} linkToRoute='uzivatel/'/>
            <NewAdminUserDialog open={this.state.showNewAdminUserDialog}
                                handleClose={this.closeNewAdminUserDialog}
                                setMessage={this.setMessage}
                                setError={this.setError}
                                setKey={this.setUsersGridKey}
                                createAdmin={true}
                                clientId={null}
            />
        </div>;
    }


}

export default UsersPage;
