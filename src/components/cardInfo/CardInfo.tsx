import React from "react";
import {Card} from "../../Types";
import Api from "../../api/Api";
import Button from "@material-ui/core/Button";
import {CircularProgress} from "@material-ui/core";
import MessageBox from "../messageBox/MessageBox";
import CardInfoCard from "../cardInfoCard/CardInfoCard";
import {Link} from "react-router-dom";
import SimpleDialog from "../dialogs/simpleDialog/SimpleDialog";

interface CardInfoProps{
    match : any
}

interface CardInfoState{
    loading : boolean,
    message? : any,
    card? : Card,
    showFreezeCardDialog : boolean,
    showTerminateCardDialog : boolean,
    showUnfreezeCardDialog : boolean,
    showButtons : boolean
}

//třída reprezentující informace o kartě
class CardInfo extends React.Component<CardInfoProps, CardInfoState>{

    constructor(props: CardInfoProps, context: any) {
        super(props, context);
        this.state = {
            loading : true,
            showFreezeCardDialog : false,
            showTerminateCardDialog : false,
            showUnfreezeCardDialog : false,
            showButtons : false
        }
    }

    private onCloseMessageBox = () : void => {
        this.setState({message : null})
    };

    private setCard = (card : Card) : void => {
        this.setState({card : card});
    };

    private setMessage = (message : string) : void => {
        this.setState({message : {message : message, type : "info"}})
    };

    private setError = (message : string) : void => {
        this.setState({message : {message : message, type : "error"}})
    };

    private openFreezeCardDialog = () : void => {
        this.setState({showFreezeCardDialog : true});
    };

    private closeFreezeCardDialog = () : void => {
        this.setState({showFreezeCardDialog : false});
    };

    private openUnfreezeCardDialog = () : void => {
        this.setState({showUnfreezeCardDialog : true});
    };

    private closeUnfreezeCardDialog = () : void => {
        this.setState({showUnfreezeCardDialog : false});
    };

    private openTerminateCardDialog = () : void => {
        this.setState({showTerminateCardDialog : true});
    };

    private closeTerminateCardDialog = () : void => {
        this.setState({showTerminateCardDialog : false});
    };

    private freezeCard = () : void => {
        const card : any = this.state.card;
        Api.freezeCard({cardId : card.cardId}).then(response => {
            this.setMessage("Karta byla úspěšně zmražena");
            card.state = "Docasně blokovaná karta";
            this.setCard(card);
        }).catch(error => {
            this.setError("Při zmražení karty došlo k chybě");
        });

        this.setState({showFreezeCardDialog : false});
    };

    private unfreezeCard = () : void => {
        const card : any = this.state.card;
        Api.unfreezeCard({cardId : card.cardId}).then(response => {
            this.setMessage("Karta byla úspěšně rozmražena");
            card.state = "Aktivní karta";
            this.setCard(card);
        }).catch(error => {
            this.setError("Při rozmražení karty došlo k chybě");
        });

        this.setState({showUnfreezeCardDialog : false});
    };

    private terminateCard = () : void => {
        const card : any = this.state.card;
        Api.terminateCard({cardId : card.cardId}).then(response => {
            this.setMessage("Karta byla úspěšně terminovaná");
            card.state = "Terminovaná karta";
            this.setCard(card);
        }).catch(error => {
            this.setError("Při terminování karty došlo k chybě");
        });

        this.setState({showTerminateCardDialog : false});
    };

    componentDidMount(): void {
        Api.fetchCardData({cardId : this.props.match.params.cardID}).then(response => {
            this.setState({
                /*loading : false,*/
                card : response.data
            });
            Api.fetchAccountData({accountId : response.data.accountId}).then(secondResponse => {
                const showButtons = secondResponse.data.state !== "Terminovaný ucet";
                this.setState({loading : false, showButtons : showButtons})
            })
        });
    }

    renderButtons(){
        const card : any = this.state.card;

        if (card.state === "Terminovaná karta"){
            return null;
        }

        return (
        <div className='buttonBlockClientInfo'>
            {(() => {
                if (card.state === 'Aktivní karta'){
                    return (
                        <Button variant="contained" color="primary" onClick={this.openFreezeCardDialog}>
                            Zmrazit kartu
                        </Button>
                    )
                } else if(card.state === 'Docasně blokovaná karta'){
                    return(<Button variant="contained" color="primary" onClick={this.openUnfreezeCardDialog}>
                            Rozmrazit kartu
                    </Button>
                    )
                } else return null;
            })()}

            <Button variant="contained" color="primary" onClick={this.openTerminateCardDialog}>
                Terminovat kartu
            </Button>
        </div>
        )
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {

        if (this.state.loading){
            return <CircularProgress />;
        }

        const card : any = this.state.card;

        return(
            <div className='clientInfo'>
                <div className='separator'/>

                <Button variant='contained' color='primary' component={Link} to={{pathname : '/ucty/' + card.accountId}} className='accountInfoLink'>
                    K účtu
                </Button>

                {this.state.message ? <MessageBox message={this.state.message.message} type={this.state.message.type} onClose={this.onCloseMessageBox}/> : null}

                <CardInfoCard cardId={card?.cardId} accountId={card?.accountId} state={card?.state} cardNumber={card?.cardNumber}
                              issueDate={card?.issueDate} expirationDate={card?.expirationDate} ownerName={card?.ownerName} ownerSurname={card?.ownerSurname}
                />

                {this.renderButtons()}

                <SimpleDialog open={this.state.showFreezeCardDialog} title={"Zmražení karty"}
                              prompt={"Opravdu chcete tuto kartu zmrazit?"} handleOk={this.freezeCard}
                              handleCancel={this.closeFreezeCardDialog}
                />
                <SimpleDialog open={this.state.showUnfreezeCardDialog} title={"Rozmražení karty"}
                              prompt={"Opravdu chcete tuto kartu rozmrazit?"} handleOk={this.unfreezeCard}
                              handleCancel={this.closeUnfreezeCardDialog}
                />
                <SimpleDialog open={this.state.showTerminateCardDialog} title={"Terminování karty"}
                              prompt={"Opravdu chcete tuto kartu terminovat?"} handleOk={this.terminateCard}
                              handleCancel={this.closeTerminateCardDialog}
                />
            </div>
        );
    }
}

export default CardInfo;