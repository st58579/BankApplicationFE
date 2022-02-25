import React from "react";
import {Card} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import {default as MUIGrid} from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography";

interface CardInfoCardProps {
    cardId : number,
    accountId : number,
    state : string,
    cardNumber : string,
    issueDate : string,
    expirationDate : string,
    ownerName : string,
    ownerSurname : string,
}

//komponenta reprezentující kartu informaci o bankovní kártě
const CardInfoCard = (props : CardInfoCardProps) => {
    return (
        <Card className='clientCardInfo'>
            <CardHeader title='Údaje o kartě:'/>
            <CardContent>
                <MUIGrid container>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            Číslo karty:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.cardNumber}
                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            Jméno vlastníka:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.ownerName} {props.ownerSurname}
                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            Datum vydaní:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.issueDate}
                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            Datum platností:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.expirationDate}
                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            Stav karty:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.state}
                        </Typography>
                    </MUIGrid>

                </MUIGrid>
            </CardContent>
        </Card>
    );

};


export default CardInfoCard;