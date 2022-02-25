import React from "react";
import Api from "../../../api/Api";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

//třída reprezentující formulář pro výběr období
class CalculateProfitDialog extends React.Component<any, any>{

    state = {
        dateFrom : new Date(Date.now()),
        dateTo : new Date(Date.now()),
        dateError : ''
    };


    setDateFrom = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({dateFrom : event.target.value});
    };

    setDateTo = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({dateTo : event.target.value});
    };

    setDateError = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({dateError : event.target.value});
    };

    validate = () : any => {

        let dateError = '';

        if (this.state.dateFrom > this.state.dateTo){
            dateError = 'Datum zahájení nemůže být pozdější než datum ukončení.';
        }

        return dateError;
    };

    onSubmit = () : void => {
        const dateError = this.validate();

        if (dateError.length > 0 ){
            this.setState({
                dateError : dateError}, () => {return});
        }
        else{
            const dateFrom = this.state.dateFrom.toString();
            const dateTo  = this.state.dateTo.toString();

            Api.fetchProfitOnPeriod({dateFrom, dateTo}).then(response => {
                this.props.setMessage('Celkový získ od ' + dateFrom + ' do ' + dateTo + ' je ' + response.data);
                this.props.setProfit(response.data);
            }).catch(error => {
                this.props.setError('Došlo k chybě při počítání');
            });

            this.props.handleClose();
        }
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {

        const dateError = this.state.dateError;

        return (
            <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Počítání získu za výbranou periodu</DialogTitle>
                <DialogContent>

                    <DialogContentText>
                        Zadejte datumy pro začátek a konec periody
                    </DialogContentText>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        type="date"
                        fullWidth
                        value={this.state.dateFrom}
                        onChange={this.setDateFrom}
                        error={dateError.length > 0}
                        helperText={dateError}
                    />

                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        type="date"
                        fullWidth
                        value={this.state.dateTo}
                        onChange={this.setDateTo}
                        error={dateError.length > 0}
                        helperText={dateError}
                    />


                </DialogContent>

                <DialogActions>
                    <Button onClick={()  => {this.props.handleClose()}}
                            color="secondary">
                        Zrušit
                    </Button>
                    <Button onClick={() => {this.onSubmit()}}
                            color="primary">
                        Spočítat
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }


}

export default CalculateProfitDialog;