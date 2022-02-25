import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import BackupIcon from "@material-ui/icons/Backup";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import Api from "../../../api/Api";

interface ImageDialogProps {
    open : boolean,
    handleClose : any,
    setMessage : any,
    setError : any,
    userId : number,
    setUser : any,
    user : any
}

interface ImageDialogState {
    image : any,
    fileError : string,
    fileInputRef : any
}

//třída reprezentující formulář pro vložení nového obrázku
class ImageDialog extends React.Component<ImageDialogProps, ImageDialogState>{

    constructor(props: ImageDialogProps, context: any) {
        super(props, context);

        this.state = {
            fileError : '',
            image : null,
            fileInputRef : React.createRef()
        };

    }

    setImage = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({image : event.target.value, fileError : ''});
    };

    validate = () : any => {
        let fileError = '';

        if (!this.state.image){
            fileError = 'Soubor nesmí být prázdný';
        }

        return {
            fileError : fileError,
        };

    };

    onSubmit = () : void => {
        const errors = this.validate();

        const {fileError} = errors;
        if (fileError.length > 0){
            this.setState({
                fileError : fileError
            }, () => {return});
        }
        else{
            const reader : any = new FileReader();
            reader.onload = () => {
                const base64String = "data:image/jpeg;base64," + reader.result?.replace("data:", "")
                    .replace(/^.+,/, "");

                Api.uploadImage({userId : this.props.userId, image : base64String}).then(response => {
                    this.props.setMessage('Obrázek byl úspěšně změněn');
                    const newImage = this.state.fileInputRef.current.files[0];
                    this.props.setUser({...this.props.user, image : newImage});
                    this.props.handleClose();
                }).catch(error => {
                    this.props.setError('Došlo k chybě při změně obrázku');
                    this.props.handleClose();
                });
            };
            reader.readAsDataURL(this.state.fileInputRef.current.files[0]);
        }
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {
        const {fileError} = this.state;

        return (
            <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Nový obrázek</DialogTitle>
                <DialogContent>

                    <DialogContentText>
                        Zvolte nový obrazek
                    </DialogContentText>


                    <React.Fragment>
                        <div className='fileUploadField'>
                            <input
                                color="primary"
                                ref={this.state.fileInputRef}
                                accept="image/"
                                type="file"
                                onChange={this.setImage}
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
                                    </Typography> : (this.state.image ?
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
                    <Button onClick={this.props.handleClose}
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

export default ImageDialog;