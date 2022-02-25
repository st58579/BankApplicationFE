import {Account, Address} from "../../../Types";
import React from "react";
import Api from "../../../api/Api";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import {Select} from "@material-ui/core";

interface AccountDialogProps {
    open : boolean,
    handleClose : any,
    setMessage : any,
    setError : any,
    setKey : any,
    clientId : number
}

interface AccountDialogState {
    selectedType : string,
    limit? : string,
    percent? : string,
    timePeriodId? : number
}

//třída reprezentující editační formulář pro účet
class AccountDialog extends React.Component<AccountDialogProps, AccountDialogState>{

    constructor(props: AccountDialogProps, context: any) {
        super(props, context);

        this.state = {selectedType : 'B', limit: '-', percent: '', timePeriodId: 3};
    }


    onSubmit = () : void => {
        const newAccount : any = {
            clientId : this.props.clientId,
            accountType : this.state.selectedType,
            limit : this.state.selectedType === 'U' ? this.state.limit : null,
            rate :  this.state.selectedType === 'S' ? this.state.percent : null,
            timePeriodId : this.state.selectedType === 'S' ? this.state.timePeriodId : null
        };

        Api.addNewAccount(newAccount).then(response => {
            this.props.setMessage('Nový účet byl úspěšné přidán.');
            this.props.setKey();})
            .catch(error => {
                this.props.setError('Při přidání účtu došlo k chybě.');
            });

        this.props.handleClose();
    };

    setType = (event: React.ChangeEvent<{ value: unknown }>) : void => {
        this.setState({selectedType : String(event.target.value)});
    };

    setTimePeriodId = (event: React.ChangeEvent<{ value: unknown }>) : void => {
        this.setState({timePeriodId : Number(event.target.value)});
    };

    setLimit = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        if (event.target.value === '-'){
            this.setState({limit : event.target.value});
            return;
        }
        const number = Number(event.target.value);
        if (number){
            this.setState({limit : String(number)});
        }
    };

    setPercent = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        const number = Number(event.target.value);
        if ((event.target.value.slice(-1) === '.' && event.target.value.replace(/[^.]/g, "").length === 1) || event.target.value.length === 0 || number){
            this.setState({percent : event.target.value});
        }
    };


    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {

        return (
            <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Nový účet</DialogTitle>
                <DialogContent>

                    <DialogContentText>
                        Zvolte typ nového účtu
                    </DialogContentText>

                    <Select
                        labelId="accountType"
                        id="accountType"
                        value={this.state.selectedType}
                        onChange={this.setType}
                        fullWidth
                    >
                        <MenuItem value={'B'}>Běžný</MenuItem>
                        <MenuItem value={'U'}>Úvěrový</MenuItem>
                        <MenuItem value={'S'}>Spořicí</MenuItem>
                    </Select>

                    {this.state.selectedType === 'U' ? <TextField
                        autoFocus
                        margin="dense"
                        id="limit"
                        label="Limit čerpání"
                        type="tel"
                        fullWidth
                        value={this.state.limit}
                        onChange={this.setLimit}
                    /> : null}

                    {this.state.selectedType === 'S' ? <TextField
                        autoFocus
                        margin="dense"
                        id="percent"
                        label="Úrok"
                        type="tel"
                        fullWidth
                        value={this.state.percent}
                        onChange={this.setPercent}
                    /> : null}

                    {this.state.selectedType === 'S' ? <Select
                        labelId="timePeriod"
                        id="timePeriod"
                        value={this.state.timePeriodId}
                        onChange={this.setTimePeriodId}
                        fullWidth
                    >
                        <MenuItem value={1}>Týden</MenuItem>
                        <MenuItem value={2}>Měsíc</MenuItem>
                        <MenuItem value={3}>Rok</MenuItem>
                    </Select> : null}



                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {this.props.handleClose()}}
                            color="secondary">
                        Zahodit zmény
                    </Button>
                    <Button onClick={this.onSubmit} color="primary">
                        Vložit adresu
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }


}

export default AccountDialog;