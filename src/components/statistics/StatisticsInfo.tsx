import React from "react";
import MessageBox from "../messageBox/MessageBox";
import StatisticsInfoCard from "./StatisticsInfoCard";
import {CircularProgress} from "@material-ui/core";
import {Stats} from "../../Types";
import Api from "../../api/Api";
import Button from "@material-ui/core/Button";
import CalculateProfitDialog from "../dialogs/calculateProfitDialog/CalculateProfitDialog";
import ChangePasswordDialog from "../dialogs/changePasswordDialog/ChangePasswordDialog";
import RoutableGrid from "../routableGrid/RoutableGrid";

interface StatisticsInfoProps{

}

interface StatisticsInfoState{
    loading : boolean,
    totalCapital : number,
    profitInPeriod : number,
    stats? : Stats,
    message? : any,
    showCalculateProfitDialog : boolean,
}

//třída reprezentující informace o statistikach
class StatisticsInfo extends React.Component<StatisticsInfoProps, StatisticsInfoState>{

    constructor(props: StatisticsInfoProps, context : any) {
        super(props, context);

        this.state = {
            loading: true,
            totalCapital : 0,
            profitInPeriod : 0,
            stats : undefined,
            message : null,
            showCalculateProfitDialog : false,
        };
    }

    private onCloseMessageBox = () : void => {
        this.setState({message : null})
    };

    private setMessage = (message : string) : void => {
        this.setState({message : {message : message, type : "info"}})
    };

    private setError = (message : string) : void => {
        this.setState({message : {message : message, type : "error"}})
    };

    private openCalculateProfitDialog = () : void => {
        this.setState({showCalculateProfitDialog : true});
    };

    private closeCalculateProfitDialog = () : void => {
        this.setState({showCalculateProfitDialog : false});
    };

    private setProfit = (profit : number) : void => {
        this.setState({profitInPeriod : profit});
    };

    renderButtons() {
        return (
            <div className='buttonBlockClientInfo'>
                <Button variant="contained" color="primary" onClick={this.openCalculateProfitDialog} >
                    Spočitat profit za period
                </Button>
            </div>
        );
    }

    componentDidMount(): void {
        Api.fetchTotalBankCapital().then(response => {
           this.setState({
               totalCapital : response.data,
           })
        });
        Api.fetchAccountStats().then(response => {
            this.setState({
                stats: response.data,
                loading : false
            })
        });
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {

        if (this.state.loading){
            return <CircularProgress />;
        }

        const stats : any = this.state.stats;

        return (
            <div className = "clientInfo">
                <div className='separator'/>
                {this.state.message ? <MessageBox message={this.state.message.message} type={this.state.message.type} onClose={this.onCloseMessageBox}/> : null}

                <StatisticsInfoCard totalCapital={this.state.totalCapital} stats={stats}/>

                <div className='separator'/>

                {this.renderButtons()}

                <div className='separator'/>

                <RoutableGrid key={'objectsGrid'} label={'Databázové objekty'} gridName={'AllObjects'} />

                <CalculateProfitDialog open={this.state.showCalculateProfitDialog}
                                       handleClose={this.closeCalculateProfitDialog}
                                       setMessage={this.setMessage}
                                       setError={this.setError}
                                       setProfit={this.setProfit}
                />
            </div>
        );
    }
}

export default StatisticsInfo;