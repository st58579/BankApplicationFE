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

interface NewCreditDialogProps {
    open : boolean,
    handleClose : any,
    setMessage : any,
    setError : any,
    setKey : any,
    accountId : number
}

interface NewCreditDialogState {
    selectedType : number,
    amount? : string,
}

//třída reprezentující formulář pro vydání nového úvěru
class NewCreditDialog extends React.Component<NewCreditDialogProps, NewCreditDialogState>{

    constructor(props: NewCreditDialogProps, context: any) {
        super(props, context);

        this.state = {selectedType : 1, amount : ""};
    }


    onSubmit = () : void => {
        const newCredit : any = {
            amount : this.state.amount,
            typeId : this.state.selectedType,
            accountId : this.props.accountId
        };

        Api.newCredit(newCredit).then(response => {
            this.props.setMessage("Nový úvěr byl úspěšně přidán");
        }).catch(error => {
           this.props.setError("Při přidání úvěru došlo k chybě");
        });

        this.props.setKey();
        this.props.handleClose();
    };

    setType = (event: React.ChangeEvent<{ value: unknown }>) : void => {
        this.setState({selectedType : Number(event.target.value)});
    };

    setAmount = (event: React.ChangeEvent<HTMLInputElement>) : void => {

        const number = Number(event.target.value);
        if (number || event.target.value.length === 0){
            this.setState({amount : String(number)});
        }
    };


    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {

        return (
            <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Nový úvěr</DialogTitle>
                <DialogContent>

                    <DialogContentText>
                        Zadejte údaje
                    </DialogContentText>

                    <Select
                        labelId="creditType"
                        id="creditType"
                        value={this.state.selectedType}
                        onChange={this.setType}
                        fullWidth
                    >
                        <MenuItem value={1}>Spotřebitelsḱý</MenuItem>
                        <MenuItem value={2}>Podnikatelský</MenuItem>
                    </Select>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="Amount"
                        label="Částka"
                        type="tel"
                        fullWidth
                        value={this.state.amount}
                        onChange={this.setAmount}
                    />


                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {this.props.handleClose()}}
                            color="secondary">
                        Zahodit zmény
                    </Button>
                    <Button onClick={this.onSubmit} color="primary">
                        Přidat úvěr
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }


}

export default NewCreditDialog;