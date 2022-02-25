import React from "react";
import Api from "../../../api/Api";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import {Select} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

interface TransactionDialogProps {
    open : boolean,
    handleClose : any,
    setMessage : any,
    setError : any,
    setKey : any,
    setRemainder : any,
    fromAccountNumber : number,
    remainder : number
}

interface TransactionDialogState {
    toAccountNumber : string,
    amount : string,
    timePeriodId : number,
    accountNumberError : string,
}

//třída reprezentující formulář pro provedení transakce
class TransactionDialog extends React.Component<TransactionDialogProps, TransactionDialogState>{

    constructor(props: TransactionDialogProps, context: any) {
        super(props, context);
        this.state = {toAccountNumber : '', amount : '', timePeriodId : 0, accountNumberError : ''}
    }

    validate = () : string => {
        let accountNumberError = '';
        if(this.state.toAccountNumber.length < 12){
            accountNumberError = 'Číslo účtu musí obsahovat 12 čísel'
        }
        return accountNumberError;
    };

    onSubmit = () : void => {
        const accountNumberError : string = this.validate();
        if(accountNumberError.length > 0){
            this.setState({accountNumberError : accountNumberError}, () => this.forceUpdate())
        }
        else {

            const newTransactionRequest: any = {
                fromAccountNumber: this.props.fromAccountNumber,
                toAccountNumber: this.state.toAccountNumber,
                amount: this.state.amount,
                timePeriodId: this.state.timePeriodId
            };


            Api.addNewTransaction(newTransactionRequest).then(response => {
                this.props.setMessage('Zadání transakce proběhlo úspěšně.');
                this.props.setRemainder(this.props.remainder - Number(this.state.amount));
            })
                .catch(error => {
                    this.props.setError('Při zadání transakce došlo k chybě.');
                });

            this.props.setKey();
            //this.props.setRemainder((this.props.remainder - Number(this.state.amount)) > 0 ? (this.props.remainder - Number(this.state.amount)) : 0);
            this.props.handleClose();
        }
    };


    setTimePeriodId = (event: React.ChangeEvent<{ value: unknown }>) : void => {
        this.setState({timePeriodId : Number(event.target.value)});
    };

    setAccountNumber = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        const number = Number(event.target.value);
        if (number || event.target.value.length === 0){
            this.setState({toAccountNumber : String(event.target.value)});
        }
    };

    setAmount = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        const number = Number(event.target.value);
        if (number || event.target.value.length === 0){
            this.setState({amount : String(event.target.value)});
        }
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {


        return (
            <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Nová transakce</DialogTitle>
                <DialogContent>

                    <DialogContentText>
                        Zadejte číslo účtu, druh a částku transakce
                    </DialogContentText>

                    <TextField
                        margin="dense"
                        id="toAccountNumber"
                        label="Číslo účtu příjemce"
                        type="tel"
                        fullWidth
                        value={this.state.toAccountNumber}
                        onChange={this.setAccountNumber}
                        error={this.state.accountNumberError.length > 0}
                        helperText={this.state.accountNumberError}
                    />

                    <TextField
                        margin="dense"
                        id="amount"
                        label="Částka"
                        type="tel"
                        fullWidth
                        value={this.state.amount}
                        onChange={this.setAmount}
                    />

                    <Select
                        labelId="timePeriod"
                        id="accountType"
                        value={this.state.timePeriodId}
                        onChange={this.setTimePeriodId}
                        fullWidth
                    >
                        <MenuItem value={0}>Jednorázová</MenuItem>
                        <MenuItem value={1}>Jednou za týden</MenuItem>
                        <MenuItem value={2}>Jednou za měsíc</MenuItem>
                        <MenuItem value={3}>Jednou za rok</MenuItem>
                    </Select>


                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {this.props.handleClose()}}
                            color="secondary">
                        Zahodit zmény
                    </Button>
                    <Button onClick={this.onSubmit} color="primary">
                        Přidat transakci
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }


}

export default TransactionDialog;