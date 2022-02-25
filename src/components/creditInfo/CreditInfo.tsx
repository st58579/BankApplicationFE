import React from "react";
import {Credit, UserData} from "../../Types";
import {CircularProgress} from "@material-ui/core";
import MessageBox from "../messageBox/MessageBox";
import CreditInfoCard from "../creditInfoCard/CreditInfoCard";
import Api from "../../api/Api";
import Button from "@material-ui/core/Button";
import {Link, Redirect} from "react-router-dom";
import CreditDialog from "../dialogs/creditDialog/CreditDialog";
import PayCreditDialog from "../dialogs/creditDialog/PayCreditDialog";
import UserContext from "../../UserContext";

interface CreditInfoProps{
    match : any,

}

interface CreditInfoState{
    loading : boolean,
    message? : any,
    credit? : Credit,
    showRedirect : boolean,
    showChangeCreditInfoDialog : boolean,
    changeCreditDialogKey : number,
    showPayCreditDialog : boolean

}

//třída reprezentující informace o úvěru
class CreditInfo extends React.Component<CreditInfoProps, CreditInfoState>{

    static contextType = UserContext;

    constructor(props: CreditInfoProps, context: any) {
        super(props, context);
        this.state = {
            loading : true,
            showChangeCreditInfoDialog : false,
            showPayCreditDialog : false,
            showRedirect : false,
            changeCreditDialogKey : 1,
        }
    }

    private onCloseMessageBox = () : void => {
        this.setState({message : null})
    };

    private setCredit = (credit : Credit) : void => {
        this.setState({credit : credit});
    };

    private setMessage = (message : string) : void => {
        this.setState({message : {message : message, type : "info"}})
    };

    private setError = (message : string) : void => {
        this.setState({message : {message : message, type : "error"}})
    };

    private openShowRedirect = () : void => {
        this.setState({showRedirect : true});
    };

    private openChangeCreditInfoDialog = () : void => {
        this.setState({showChangeCreditInfoDialog : true});
    };

    private closeChangeCreditInfoDialog = () : void => {
        this.setState({showChangeCreditInfoDialog : false});
    };

    private openPayCreditDialog = () : void => {
        this.setState({showPayCreditDialog : true});
    };

    private closePayCreditDialog = () : void => {
        this.setState({showPayCreditDialog : false});
    };

    private setChangeCreditDialogKey = () : void => {
        const key = this.generateRandomNumber(1, 100, this.state.changeCreditDialogKey);
        this.setState({changeCreditDialogKey : key});
    };

    private generateRandomNumber = (min : number, max : number, except : number) =>  {
        let result : number;
        do {
            result = Math.floor(Math.random() * (max - min) + min);
        } while (result === except);
        return result;
    };

    componentDidMount(): void {
        Api.fetchCreditData({creditId : this.props.match.params.creditID}).then(response => {
            this.setState({
                loading : false,
                credit : response.data
            })
        });
    }

    renderButtons(){

        const {user} : {user : UserData;} = this.context;

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

        return(
        <div className='buttonBlockClientInfo'>
            {effectiveUser.role === "ADMIN" ? <Button variant="contained" color="primary" onClick={this.openChangeCreditInfoDialog}>
                Editovat údaje
            </Button> : <Button variant="contained" color="primary" onClick={this.openPayCreditDialog}>
                Zaplatit úvěr
            </Button>}
        </div>
        );
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {

        if (this.state.loading){
            return <CircularProgress />;
        }

        const credit : any = this.state.credit;

        return(
            <div className='clientInfo'>
                <div className='separator'/>

                <Button variant='contained' color='primary' component={Link} to={{pathname : '/ucty/' + credit.accountId}} className='accountInfoLink'>
                    K účtu
                </Button>

                {this.state.showRedirect ? <Redirect to={{pathname : '/ucty/' + credit.accountId}} /> : null}

                {this.state.message ? <MessageBox message={this.state.message.message} type={this.state.message.type} onClose={this.onCloseMessageBox}/> : null}

                <CreditInfoCard creditId={credit?.creditId} accountId={credit?.accountId} issueDate={credit?.issueDate}
                                remainder={credit?.remainder} typeInfo={credit?.typeInfo} timePeriodInfo={credit?.timePeriodInfo}
                                numOfTimePeriods={credit?.numOfTimePeriods} percentForTimePeriod={credit?.percentForTimePeriod}
                />

                {this.renderButtons()}

                <div className='separator'/>

                <CreditDialog open={this.state.showChangeCreditInfoDialog} handleClose={this.closeChangeCreditInfoDialog}
                              setMessage={this.setMessage} setError={this.setError} setCredit={this.setCredit}
                              setKey={this.setChangeCreditDialogKey} credit={credit}
                />

                <PayCreditDialog open={this.state.showPayCreditDialog} handleClose={this.closePayCreditDialog}
                              setMessage={this.setMessage} setError={this.setError} setCredit={this.setCredit}
                              setKey={this.setChangeCreditDialogKey} credit={credit} setShowRedirect={this.openShowRedirect}
                />
            </div>
        );
    }

}

export default CreditInfo;