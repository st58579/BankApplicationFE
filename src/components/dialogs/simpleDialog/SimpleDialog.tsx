import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";


interface SimpleDialogProps {
    open : boolean
    title : string,
    prompt : string,
    handleOk : any,
    handleCancel : any,
}

//třída reprezentující jednoduchý dvoutlačitkový pořvrzovací dialog
class SimpleDialog extends React.Component<SimpleDialogProps, any>{


    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {
        return (
            <Dialog open={this.props.open} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {this.props.prompt}
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={this.props.handleCancel}
                            color="secondary">
                        Ne
                    </Button>
                    <Button onClick={this.props.handleOk} color="primary">
                        Ano
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default SimpleDialog;