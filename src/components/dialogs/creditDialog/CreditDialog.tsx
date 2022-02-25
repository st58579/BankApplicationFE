import React from "react";
import Dialog from "@material-ui/core/Dialog";
import {Credit} from "../../../Types";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import MenuItem from "@material-ui/core/MenuItem";
import {Select} from "@material-ui/core";
import Api from "../../../api/Api";

interface CreditDialogProps{
    open : boolean,
    handleClose : any,
    setMessage : any,
    setError : any,
    setCredit : any,
    setKey : any,
    credit : Credit,
}

interface CreditDialogState{
    fields : Credit,
    selectedTimePeriod : string,
    amountError : string,
}

//třída reprezentující formulář pro změnu častky úvěru
class CreditDialog extends React.Component<CreditDialogProps, CreditDialogState>{

    constructor(props : CreditDialogProps, context : any) {
        super(props, context);

        this.state = {
            fields : this.props.credit,
            selectedTimePeriod : this.props.credit.timePeriodInfo,
            amountError : "",

        };
    }

    validate = () : any => {
        let remainderError = '';

        if(isNaN(this.state.fields.remainder)) {
            remainderError = "Zůstatek pro úhradu musí být číslo."
        }else if(this.state.fields.remainder < 0) {
            remainderError = "Zůstatek pro úhradu nesmí byt záporný."
        }

        return {
            amountError : remainderError,
        }
    };

    onSubmit = () : void => {

        const remainderError = this.validate();
        if(remainderError.length > 0){
            this.setState({
                amountError : remainderError,
            }, () => {this.forceUpdate()});
        } else {
            Api.updateCreditData(this.state.fields).then(response => {
                this.props.setMessage('Úvěr byl úspěšně změněn.');
                this.props.setKey();
                this.props.setCredit(response.data);
            }).catch(error => {
                this.props.setError('Došlo k chybě při změně úvěru');
            });
            this.props.handleClose();
        }
    };

    setRemainder = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, remainder : Number(event.target.value)}, amountError : ''});
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {

        return(
            <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Editace úvěru</DialogTitle>
                <DialogContent>

                    <DialogContentText>
                        Zadejte údaje pro editace úvěru
                    </DialogContentText>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="remainder"
                        label="Zbyvající částka"
                        type="text"
                        fullWidth
                        value={this.state.fields.remainder}
                        onChange={this.setRemainder}
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
                        Zahodit změny
                    </Button>
                    <Button onClick={this.onSubmit} color="primary">
                        Potvrdit změny
                    </Button>
                </DialogActions>

            </Dialog>
        );
    }
}

export default CreditDialog;