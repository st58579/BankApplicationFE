import React from "react";
import Api from "../../../api/Api";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {File} from "../../../Types";
import BackupIcon from "@material-ui/icons/Backup";
import Typography from "@material-ui/core/Typography";
import './FileDialog.css';
import {Select} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";


interface FileDialogProps {
    open : boolean,
    handleClose : any,
    setMessage : any,
    setError : any,
    setKey : any,
    file : File
}

interface FileDialogState {
    fields : File
    nameError : string,
    fileError : string,
    fileInputRef : any
}

//třída reprezentující formulář pro vložení nového dokumentu
class FileDialog extends React.Component<FileDialogProps, FileDialogState>{

    constructor(props: FileDialogProps, context: any) {
        super(props, context);

        let fields = this.props.file;
        if (fields.name === undefined){
            fields.name = '';
        }
        if (fields.content === undefined){
            fields.content = null;
        }
        if (fields.type === undefined){
            fields.type = 1;
        }

        this.state = {
            fields : this.props.file,
            nameError : '',
            fileError : '',
            fileInputRef : React.createRef()
        };

    }

    setName = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, name : event.target.value}, nameError : ''});
    };

    setContent = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, content : event.target.value}, fileError : ''});
    };

    setType = (event: React.ChangeEvent<{ value: unknown }>) : void => {
        this.setState({fields : {...this.state.fields, type : Number(event.target.value)}});
    };


    validate = () : any => {

        let nameError = '';
        let fileError = '';

        if (this.state.fields.name?.length === 0){
            nameError = 'Jméno nesmí být prázdné';
        }

        if (!this.state.fields.content){
            fileError = 'Soubor nesmí být prázdný';
        }

        return {
            nameError : nameError,
            fileError : fileError,
        };

    };

    onSubmit = () : void => {
        const errors = this.validate();

        const {nameError, fileError} = errors;
        if (nameError.length > 0 || fileError.length > 0){
            this.setState({
                nameError : nameError,
                fileError : fileError
            }, () => {return});
        }
        else{
            const modifiedFileData : File = this.state.fields;
            modifiedFileData.content = null;

            Api.saveNewDocument(modifiedFileData, this.state.fileInputRef.current.files[0]).then(response => {
                this.props.setMessage('Dokument byl úspěšně vložen');
                this.props.setKey();
            }).catch(error => {
                this.props.setError('Došlo k chybě při vložení dokumentu');
            });

            this.props.handleClose();


        }
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {
        const {nameError, fileError} = this.state;

        return (
            <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Nový soubor</DialogTitle>
                <DialogContent>

                    <DialogContentText>
                        Zadejte název a nahrajte soubor
                    </DialogContentText>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Jméno"
                        type="text"
                        fullWidth
                        value={this.state.fields.name}
                        onChange={this.setName}
                        error={nameError.length > 0}
                        helperText={nameError}
                    />

                    <Select
                        labelId="fileType"
                        id="fileType"
                        value={this.state.fields.type}
                        onChange={this.setType}
                        fullWidth
                    >
                        <MenuItem value={1}>Smlouva s klientem</MenuItem>
                        <MenuItem value={2}>Interní dokumentace</MenuItem>
                        <MenuItem value={3}>Nařízení správního orgánu</MenuItem>
                    </Select>

                    <React.Fragment>
                        <div className='fileUploadField'>
                            <input
                                color="primary"
                                ref={this.state.fileInputRef}
                                accept="application/pdf"
                                type="file"
                                onChange={this.setContent}
                                id="icon-button-file"
                                style={{ display: 'none', }}
                            />
                            <label htmlFor="icon-button-file">
                                <Button
                                    variant="contained"
                                    component="span"

                                    size="large"
                                    color="primary"
                                >
                                    <BackupIcon/>
                                </Button>
                            </label>
                            <div className='fileLabel'>
                                {this.state.fileError.length > 0 ?
                                    <Typography color="error" gutterBottom>
                                        {this.state.fileError}
                                    </Typography> : (this.state.fields.content ?
                                            <Typography color="textPrimary" gutterBottom>
                                                Soubor byl nahrán
                                            </Typography> :
                                            <Typography color="textSecondary" gutterBottom>
                                                Nahrajte soubor
                                            </Typography>
                                    )
                                }
                            </div>

                        </div>

                        </React.Fragment>




                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {
                        this.setState({
                            fields : this.props.file,
                            nameError : '',
                            fileError : ''}
                            , () => {this.props.handleClose()})}}
                            color="secondary">
                        Zahodit zmény
                    </Button>
                    <Button onClick={() => {this.onSubmit()}}
                            color="primary">
                        Podtvrdit změny
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }


}

export default FileDialog;