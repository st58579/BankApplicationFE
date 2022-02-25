import React from "react";
import {Address, ClientAddress} from "../../../Types";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {CircularProgress, DialogContentText} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {DataGrid} from '@material-ui/data-grid';
import Api from "../../../api/Api";

interface AddressClientDialogProps{
    open : boolean,
    handleClose : any,
    setAddress: any,
    setKey : any
    address : Address,
    clients : ClientAddress[],
}

interface AddressClientDialogState{
    clients : ClientAddress[],
    someError : string,
}


class AddressClientDialog extends React.Component<AddressClientDialogProps, AddressClientDialogState>{

    constructor(props: AddressClientDialogProps, context: any) {
        super(props, context);

        this.state = {
            clients: props.clients,
            someError: ""
        };
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode>
        | React.ReactPortal | boolean | null | undefined {
        const columns = [
            {field: 'name', headerName: 'Jméno', width: 200, editable: false},
            {field: 'surname',  headerName: 'Příjmení', width: 200, editable: false},
            {field: 'birthNumber', headerName: 'Rodní číslo', width: 200, editable: false}
        ];

        if (!this.props.clients){
            return <CircularProgress />;
        }

        let rows : ClientAddress[];

        if(!this.state.clients) rows = this.props.clients;
        else rows = this.state.clients;

        const addressId : any = this.props.address.addressId;

        let selectionModel: (string | number)[] = rows.filter((r) => r !== undefined && r !== null)
            .filter((r) => r.active > 0)
            .map((r) => r.clientId);

        return (
            <Dialog  open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="address-client-dialog-title"> Aktualizace stavu adresy </DialogTitle>

                <DialogContent >
                    <DialogContentText>Výběrte klienta pro deaktivace adresy</DialogContentText>
                    <div style={{ height: 400, width: 550 }}>
                    <DataGrid columns={columns}
                              rows={rows}
                              getRowId={(row) => row.clientId}
                              pageSize={5}
                              checkboxSelection
                              selectionModel={selectionModel}
                              onSelectionModelChange={(ids) =>{
                                  const selectedIds = new Set(ids);
                                  const selectionModelSet = new Set(selectionModel);

                                  const remove = selectionModel.filter(x => !selectedIds.has(x));
                                  const add = ids.filter(x => !selectionModelSet.has(x));

                                  selectionModel = Array.from(ids.values());

                                  if(remove.length === 1) {
                                      const client : ClientAddress = {clientId : Number(remove[0]), addressId: addressId, active: 0};
                                      Api.updateClientAddressState(client);
                                  } else if(add.length === 1){
                                      const client : ClientAddress = {clientId : Number(add[0]), addressId: addressId, active: 1};
                                      Api.updateClientAddressState(client);
                                  }
                              }}
                    />
                    </div>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {
                        Api.fetchClientsOnAddress({addressId : addressId}).then(response => {
                            this.setState(
                                {
                                    clients : response.data
                                },() => {
                                this.props.handleClose();
                            });
                        });

                    }} color="secondary">
                        Zavřít dialog
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

}

export default AddressClientDialog;