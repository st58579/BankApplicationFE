import React from "react";
import Api from "../../../api/Api";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {Recommendation} from "../../../Types";

interface AddNewRecommendationDialogProps {
    open : boolean,
    handleClose : any,
    setMessage : any,
    setError : any,
    setKey : any,
    setRedirect : any,
}

interface AddNewRecommendationDialogState {
    subjectError : string,
    textError : string,
    subject : string,
    text : string
}

//třída reprezentující formulář pro přidavání přáni
class AddNewRecommendationDialog extends React.Component<AddNewRecommendationDialogProps, AddNewRecommendationDialogState>{

    constructor(props: AddNewRecommendationDialogProps, context: any) {
        super(props, context);

        this.state = {
            subjectError : '',
            textError : '',
            subject : '',
            text : ''
        };
    }

    setSubject = (event: React.ChangeEvent<{ value: string }>) : void => {
        this.setState({subject : event.target.value});
    };

    setText = (event: React.ChangeEvent<{ value: string }>) : void => {
        this.setState({text : event.target.value});
    };


    validate = () : any => {
        let subjectError = '';
        let textError = '';

        if(this.state.subject.length > 30) {
            subjectError = 'Délka předmětu nesmí být větši něž 30 znaků.'
        }
        if(this.state.text.length > 1000){
            textError = 'Délka zprávy nesmí být větši něž 1000 znaků.'
        }

        return {
            subjectError : subjectError,
            textError : textError,
        };

    };

    onSubmit = () : void => {
        const errors = this.validate();

        const {subjectError, textError} = errors;

        if (subjectError.length > 0 || textError.length > 0){
            this.setState({
                subjectError : subjectError,
                textError : textError,
            }, () => {this.forceUpdate()});
        }
        else{

            const recommendation : Recommendation = {
                recommendationId : 0,
                subject : this.state.subject,
                text : this.state.text,
                status : '',
            };

            Api.addNewRecommendation(recommendation).then(response => {
                this.props.setMessage('Nové přáni bylo úspěšně přidano.');
                this.props.setKey();
            }).catch(error => {
                this.props.setError('Při vložení přáni došlo k chybě');
            });
            this.props.setRedirect();
        }
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {

        const {subjectError, textError} = this.state;

        return (
            <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Nové přáni</DialogTitle>
                <DialogContent>

                    <DialogContentText>
                        Zadejte údaje pro nové přáni
                    </DialogContentText>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="subject"
                        label="Předmět"
                        type="text"
                        fullWidth
                        value={this.state.subject}
                        onChange={this.setSubject}
                        error={subjectError.length > 0}
                        helperText={subjectError}
                    />

                    <TextField
                        margin="dense"
                        id="street"
                        label="Zpráva"
                        type="text"
                        multiline
                        fullWidth
                        value={this.state.text}
                        onChange={this.setText}
                        error={textError.length > 0}
                        helperText={textError}
                    />

                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {
                        this.setState({
                            subjectError : '',
                            textError : '',
                        }, () => {this.props.handleClose()})}}
                            color="secondary">
                        Zahodit změny
                    </Button>
                    <Button onClick={this.onSubmit} color="primary">
                        Vložit přáni
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }


}

export default AddNewRecommendationDialog;