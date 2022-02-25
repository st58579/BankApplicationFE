import {Card} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import {default as MUIGrid} from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography";
import React from "react";

interface AddressInfoCardProps {
    addressId : number,
    clientId : number,
    houseNumber : string,
    street : string,
    town : string,
    postalCode : string,
    countryCode : string;
}

//třída reprezentující kartu informaci o adresě
const AddressInfoCard = (props : AddressInfoCardProps) => {
    return (
        <Card className='addressInfoCard'>
            <CardHeader title='Údaje o adrese:'/>
            <CardContent>
                <MUIGrid container>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            Číslo popisne:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.houseNumber}
                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            Ulice:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.street}
                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            Město:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.town}
                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            PSC:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.postalCode}
                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            Kod země:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.countryCode}
                        </Typography>
                    </MUIGrid>
                </MUIGrid>
            </CardContent>
        </Card>
    );

};

export default AddressInfoCard;