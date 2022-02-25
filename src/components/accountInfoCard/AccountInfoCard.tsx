import {Card} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import {default as MUIGrid} from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography";
import React from "react";

interface AccountInfoCardProps {
    accountNumber : number,
    stateInfo : string,
    clientId : number,
    accountId : number,
    remainder : number,
    accountType : string,
    limit? : number,
    rate? : number,
    timePeriod? : string,
    key : string
}

//třída reprezentující kartu informaci o účtu
class AccountInfoCard extends React.Component<AccountInfoCardProps, any>{

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {
        let accountTypeInfo : string = "";

        if (this.props.accountType === "U"){
            accountTypeInfo = "Úvěrový";
        } else if (this.props.accountType === "S"){
            accountTypeInfo = "Spořicí";
        } else {
            accountTypeInfo = "Běžný";
        }

        return (
            <Card className='clientCardInfo' key={this.props.key}>
                <CardHeader title='Údaje o účtě:'/>
                <CardContent>
                    <MUIGrid container>

                        <MUIGrid item xs={2}>
                            <Typography color="textSecondary" gutterBottom>
                                Číslo účtu:
                            </Typography>
                        </MUIGrid>
                        <MUIGrid item xs ={10}>
                            <Typography color="textPrimary" gutterBottom>
                                {String(this.props.accountNumber).replace(/(.{4})/g,"$1-").replace(/.$/, "")}
                            </Typography>
                        </MUIGrid>

                        <MUIGrid item xs ={2}>
                            <Typography color="textSecondary" gutterBottom>
                                Stav účtu:
                            </Typography>
                        </MUIGrid>
                        <MUIGrid item xs ={10}>
                            <Typography color="textPrimary" gutterBottom>
                                {this.props.stateInfo}
                            </Typography>
                        </MUIGrid>

                        <MUIGrid item xs ={2}>
                            <Typography color="textSecondary" gutterBottom>
                                Typ učtu:
                            </Typography>
                        </MUIGrid>
                        <MUIGrid item xs ={10}>
                            <Typography color="textPrimary" gutterBottom>
                                {accountTypeInfo}
                            </Typography>
                        </MUIGrid>

                        <MUIGrid item xs ={2}>
                            <Typography color="textSecondary" gutterBottom>
                                Aktuální zůstatek:
                            </Typography>
                        </MUIGrid>
                        <MUIGrid item xs ={10}>
                            <Typography color="textPrimary" gutterBottom>
                                {this.props.remainder}
                            </Typography>
                        </MUIGrid>

                        {this.props.limit ?
                            <React.Fragment>
                                <MUIGrid item xs ={2}>
                                    <Typography color="textSecondary" gutterBottom>
                                        Hranice čerpání:
                                    </Typography>
                                </MUIGrid>
                                <MUIGrid item xs ={10}>
                                    <Typography color="textPrimary" gutterBottom>
                                        {this.props.limit}
                                    </Typography>
                                </MUIGrid>
                            </React.Fragment> : null}

                        {this.props.rate ?
                            <React.Fragment>
                                <MUIGrid item xs ={2}>
                                    <Typography color="textSecondary" gutterBottom>
                                        Úrok:
                                    </Typography>
                                </MUIGrid>
                                <MUIGrid item xs ={10}>
                                    <Typography color="textPrimary" gutterBottom>
                                        {this.props.rate}%
                                    </Typography>
                                </MUIGrid>
                            </React.Fragment> : null}

                        {this.props.timePeriod ?
                            <React.Fragment>
                                <MUIGrid item xs ={2}>
                                    <Typography color="textSecondary" gutterBottom>
                                        Za časové období:
                                    </Typography>
                                </MUIGrid>
                                <MUIGrid item xs ={10}>
                                    <Typography color="textPrimary" gutterBottom>
                                        {this.props.timePeriod}
                                    </Typography>
                                </MUIGrid>
                            </React.Fragment> : null}

                    </MUIGrid>
                </CardContent>
            </Card>
        );
    }
};

export default AccountInfoCard;