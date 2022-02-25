import React from "react";
import Dialog from "@material-ui/core/Dialog";
import {Credit} from "../../../Types";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import Api from "../../../api/Api";

interface PayCreditDialogProps{
    open : boolean,
    handleClose : any,
    setShowRedirect : any,
    setMessage : any,
    setError : any,
    setCredit : any,
    setKey : any,
    credit : Credit,
}

interface PayCreditDialogState{
    fields : Credit,
    amount : number,
    amountError : string,
}

//třída reprezentující formulář pro zaplacení úvěru
class PayCreditDialog extends React.Component<PayCreditDialogProps, PayCreditDialogState>{

    constructor(props : PayCreditDialogProps, context : any) {
        super(props, context);

        this.state = {
            fields : this.props.credit,
            amountError : "",
            amount : 0,
        };
    }

    validate = () : any => {
        let remainderError = '';

        if(isNaN(this.state.amount)) {
            remainderError = "Častka pro úhradu musí být číslo."
        }else if(this.state.amount < 0) {
            remainderError = "Častka pro úhradu nesmí byt záporný."
        }

        return {
            amountError : remainderError,
        }
    };

    onSubmit = () : void => {
        const remainderError = this.validate();
        const credit : Credit =  this.state.fields;

        const PayCreditRequest = {
            accountId : this.state.fields.accountId,
            creditId : this.state.fields.creditId,
            amount : this.state.amount
        };

        if(remainderError.length > 0){
            this.setState({
                amountError : remainderError,
            }, () => {this.forceUpdate()});
        } else {
            Api.payCredit(PayCreditRequest).then(response => {
                this.props.setMessage('Částka ' + PayCreditRequest.amount + ' byla úspěšně zaplacena.');
                this.props.setKey();
                credit.remainder = (credit.remainder - PayCreditRequest.amount) < 0 ? 0 : (credit.remainder - PayCreditRequest.amount);
                if(credit.remainder === 0){
                    this.props.setShowRedirect(true);
                }
                this.props.setCredit(credit);
            }).catch(error => {
                this.props.setError('Došlo k chybě při zaplaceni.');
            });
            this.props.handleClose();
        }
    };


    setAmount = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({amount: Number(event.target.value), amountError : ''});
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {


        return(
            <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Úhrada úvěru</DialogTitle>
                <DialogContent>

                    <DialogContentText>
                        Zadejte častku pro uhrazení úvěru
                    </DialogContentText>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="remainder"
                        label="Částka"
                        type="text"
                        fullWidth
                        value={this.state.amount}
                        onChange={this.setAmount}
                        error={this.state.amountError.length > 0}
                        helperText={this.state.amountError}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {
                        this.setState({
                            fields : this.props.credit,
                        }, () => {this.props.handleClose()})}}
                            color="secondary">
                        Zahodit platbu
                    </Button>
                    <Button onClick={this.onSubmit} color="primary">
                        Potvrdit platbu
                    </Button>
                </DialogActions>

            </Dialog>
        );
    }
}

export default PayCreditDialog;