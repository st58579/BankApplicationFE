import React from "react";
import {Card} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import {default as MUIGrid} from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography";

interface CreditInfoCard {
    creditId : number,
    accountId : number,
    issueDate : string,
    remainder : number,
    typeInfo : string,
    timePeriodInfo : string,
    numOfTimePeriods : number,
    percentForTimePeriod : number,
}

//komponenta reprezentující kartu informaci o úvěru
const CreditInfoCard = (props : CreditInfoCard) => {
    return (
        <Card className='clientCardInfo'>
            <CardHeader title='Údaje o úvěru:'/>
            <CardContent>
                <MUIGrid container>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            Datum poskytnuti:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.issueDate}
                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            Zbyvá uhradit:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.remainder}

                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            Typ úvěru:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.typeInfo}
                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            Procento za {props.timePeriodInfo}:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.percentForTimePeriod}% na {props.numOfTimePeriods} období typu "{props.timePeriodInfo}"
                        </Typography>
                    </MUIGrid>

                </MUIGrid>
            </CardContent>
        </Card>
    );

};


export default CreditInfoCard;