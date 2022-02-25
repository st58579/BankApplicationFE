import React from "react";
import {Card} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import './ClientCardInfo.css';
import CardHeader from "@material-ui/core/CardHeader";
import {default as MUIGrid} from "@material-ui/core/Grid";

interface ClientInfoCardProps {
    id : number,
    name : string,
    surname : string,
    phoneNumber : string,
    birthNumber : string;
}

//komponenta reprezentující kartu informace o klientovi
const ClientInfoCard = (props : ClientInfoCardProps) => {
    return (
        <Card className='clientCardInfo'>
            <CardHeader title='Údaje o klientovi:'/>
            <CardContent>
                <MUIGrid container>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            Jméno:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.name}
                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            Přijmení:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.surname}
                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            Kontaktní číslo:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.phoneNumber}
                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            Rodné číslo:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.birthNumber}
                        </Typography>
                    </MUIGrid>

                </MUIGrid>
            </CardContent>
        </Card>
    );

};


export default ClientInfoCard;