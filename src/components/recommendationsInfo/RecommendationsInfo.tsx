import React from "react";
import UserContext from "../../UserContext";
import Api from "../../api/Api";
import {CircularProgress} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import MessageBox from "../messageBox/MessageBox";
import RoutableGrid from "../routableGrid/RoutableGrid";
import {Recommendation, UserData} from "../../Types";
import RecommendationDialog from "../dialogs/recommendationsDialog/RecommendationDialog";
import {Redirect} from "react-router-dom";
import AddNewRecommendationDialog from "../dialogs/recommendationsDialog/AddNewRecommendationDialog";

interface RecommendationsInfoProps{
    match : any,
}

interface RecommendationsInfoState{
    loading : boolean,
    recommendations : Recommendation[] | undefined,
    message? : any,

    showAddNewRecommendationDialog : boolean,
    showDeclineRecommendationDialog : boolean,
    showApproveRecommendationDialog : boolean,

    addNewRecommendationDialogKey : number,
    declineRecommendationDialogKey : number,
    approveRecommendationDialogKey : number
}

//třída reprezentující kníhu přání uživatelů
class RecommendationsInfo extends React.Component<RecommendationsInfoProps, RecommendationsInfoState>{

    static contextType = UserContext;

    constructor(props: RecommendationsInfoProps, context: any) {
        super(props, context);
        this.state = {
            loading : true,
            recommendations : undefined,

            showAddNewRecommendationDialog: false,
            showDeclineRecommendationDialog: false,
            showApproveRecommendationDialog : false,

            addNewRecommendationDialogKey : 1,
            declineRecommendationDialogKey : 1,
            approveRecommendationDialogKey : 1,
        }
    }

    private openAddNewRecommendationDialog = () : void => {
        this.setState({showAddNewRecommendationDialog : true});
    };

    private closeAddNewRecommendationDialog = () : void => {
        this.setState({showAddNewRecommendationDialog : false});
    };

    private openDeclineRecommendationDialog = () : void => {
        this.setState({showDeclineRecommendationDialog : true});
    };

    private closeDeleteRecommendationDialog = () : void => {
        this.setState({showDeclineRecommendationDialog : false});
    };

    private openApproveRecommendationDialog = () : void => {
        this.setState({showApproveRecommendationDialog : true});
    };

    private closeConfirmRecommendationDialog = () : void => {
        this.setState({showApproveRecommendationDialog : false});
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

    private setRedirect = () : void => {
        window.location.reload();
    };

    private generateRandomNumber = (min : number, max : number, except : number) =>  {
        let result : number;
        do {
            result = Math.floor(Math.random() * (max - min) + min);
        } while (result === except);
        return result;
    };

    private setDeleteRecommendationDialogKey = () : void => {
        const key = this.generateRandomNumber(1, 100, this.state.declineRecommendationDialogKey);
        this.setState({declineRecommendationDialogKey : key});
    };

    private setAddNewRecommendationDialogKey = () : void => {
        const key = this.generateRandomNumber(1, 100, this.state.addNewRecommendationDialogKey);
        this.setState({addNewRecommendationDialogKey : key});
    };

    private setConfirmRecommendationDialogKey = () : void => {
        const key = this.generateRandomNumber(1, 100, this.state.approveRecommendationDialogKey);
        this.setState({approveRecommendationDialogKey : key});
    };

    componentDidMount(): void {
        Api.fetchRecommendationData().then(response => {
            this.setState({
                recommendations : response.data,
                loading : false
            })
        });
        this.setState({loading : false});
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
                {effectiveUser.role === 'ADMIN' ? null :
                    <Button variant="contained" color="primary" onClick={this.openAddNewRecommendationDialog} >
                        Vložit přání
                    </Button>
                }

                {effectiveUser.role === 'ADMIN' ?
                    <Button variant="contained" color="primary" onClick={this.openDeclineRecommendationDialog}>
                        Zamitnout přání
                    </Button> : null}
                {effectiveUser.role === 'ADMIN' ?
                <Button variant="contained" color="primary" onClick={this.openApproveRecommendationDialog}>
                    Výhovět přání
                </Button> : null}
            </div>
        );
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {

        if (this.state.loading){
            return <CircularProgress />;
        }

        const recommendations : any = this.state.recommendations;

        return (
            <div className='clientInfo'>

                <div className='separator'/>



                {this.state.message ? <MessageBox message={this.state.message.message} type={this.state.message.type}
                                                  onClose={this.onCloseMessageBox}/> : null}


                <RoutableGrid gridName='Prani' label={"Klientská přání"} />

                {this.renderButtons()}

                <RecommendationDialog open={this.state.showDeclineRecommendationDialog}
                                      handleClose={this.closeDeleteRecommendationDialog}
                                      setKey={this.setDeleteRecommendationDialogKey}
                                      approve={false}
                                      recommendations={recommendations}
                                      setRedirect={this.setRedirect}
                />

                <RecommendationDialog open={this.state.showApproveRecommendationDialog}
                                      handleClose={this.closeConfirmRecommendationDialog}
                                      setKey={this.setConfirmRecommendationDialogKey}
                                      approve={true}
                                      recommendations={recommendations}
                                      setRedirect={this.setRedirect}
                />

                <AddNewRecommendationDialog open={this.state.showAddNewRecommendationDialog}
                                            handleClose={this.closeAddNewRecommendationDialog}
                                            setMessage={this.setMessage}
                                            setError={this.setError}
                                            setKey={this.setAddNewRecommendationDialogKey}
                                            setRedirect={this.setRedirect}
                />

            </div>
        );
    }

}

export default RecommendationsInfo;