import React from "react";
import {Recommendation} from "../../../Types";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {DialogContentText} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {DataGrid} from '@material-ui/data-grid';
import Api from "../../../api/Api";

interface DeleteRecommendationDialogProps{
    open : boolean,
    handleClose : any,
    setKey : any,
    approve : boolean,
    setRedirect : any,
    recommendations : Recommendation[],
}

interface DeleteRecommendationDialogState{
    recommendations : Recommendation[],
    selected : Set<string | number>,
    someError : string,
}

//třída reprezentující formulář pro změnu stavu přání
class RecommendationDialog extends React.Component<DeleteRecommendationDialogProps, DeleteRecommendationDialogState>{

    constructor(props: DeleteRecommendationDialogProps, context: any) {
        super(props, context);

        this.state = {
            recommendations: props.recommendations,
            selected : new Set<string|number>(),
            someError: ""
        };
    }

    onSubmit = () : void => {
        const val = Array.from(this.state.selected.values());
        let ids : number[] = [];
        let counter : number = 0;
        for (let id of val){
            if(typeof id === 'string'){
                ids[counter++] = parseInt(id);
            } else ids[counter++] = id;
        }
        if(this.props.approve){
            Api.approveRecommendations({ids : ids});
        } else {
            Api.declineRecommendations({ids: ids});
        }
        this.props.setRedirect();
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode>
        | React.ReactPortal | boolean | null | undefined {

        const columns = [
            {field: 'subject', headerName: 'Předmět', width: 150, editable: false},
            {field: 'text', headerName: 'Zpráva', width: 200, editable: false},
            {field: 'status', headerName: 'Status', width: 200, editable: false},
        ];

        let rows : Recommendation[] = this.props.recommendations;

        return (
            <Dialog  open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="recommendation-dialog-title"> {this.props.approve ? 'Potvrzeni' : 'Zamitnuti'} přání </DialogTitle>

                <DialogContent >
                    <DialogContentText>Výběrte přání pro {this.props.approve ? 'potvrzení' : 'zamitnutí'}</DialogContentText>
                    <div style={{ height: 400, width: 550 }}>
                        <DataGrid columns={columns}
                                  rows={rows}
                                  getRowId={(row) => row.recommendationId}
                                  pageSize={5}
                                  checkboxSelection
                                  onSelectionModelChange={(ids) => {
                                      const selectedIDs = new Set(ids);
                                      this.setState({selected : selectedIDs});
                                  }}
                        />
                    </div>
                </DialogContent>

                <DialogActions >
                    <Button onClick={this.props.handleClose} color="secondary">
                        Zavřít dialog
                    </Button>

                    <Button onClick={() => {this.onSubmit()}} color="primary">
                        {this.props.approve ? "Potvrdit přání" : "Zamitnout přání"}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

}

export default RecommendationDialog;