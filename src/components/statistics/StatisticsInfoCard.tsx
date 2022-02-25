import {Card} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import {default as MUIGrid} from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {Stats} from "../../Types";

interface StatisticsInfoCardProps {
    totalCapital : number,
    stats : Stats,

}

//komponenta reprezentující kartu informace o statistikach
const StatisticsInfoCard = (props : StatisticsInfoCardProps) => {
    return (
        <Card className='statisticsInfoCard'>
            <CardHeader title='Statistiky:'/>
            <CardContent>
                <MUIGrid container>

                    <MUIGrid item xs ={4}>
                        <Typography color="textSecondary" gutterBottom>
                            Celkový bankovní kapitál:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={6}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.totalCapital}
                        </Typography>
                    </MUIGrid>


                    <MUIGrid item xs ={4}>
                        <Typography color="textSecondary" gutterBottom>
                            Celkový počet běžných účtů:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={6}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.stats.simpleAccCount}
                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={4}>
                        <Typography color="textSecondary" gutterBottom>
                            Celkový počet úvěrových účtů:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={6}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.stats.creditAccCount}
                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={4}>
                        <Typography color="textSecondary" gutterBottom>
                            Celkový počet spořicích účtů:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={6}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.stats.savingAccCount}
                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={4}>
                        <Typography color="textSecondary" gutterBottom>
                            Průměr účtů na klienta:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={6}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.stats.avgAccPerClient}
                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={4}>
                        <Typography color="textSecondary" gutterBottom>
                            Průměr kart na účet:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={6}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.stats.avgCardPerAcc}
                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={4}>
                        <Typography color="textSecondary" gutterBottom>
                            Průměr úvěrů na úvěrový účet:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={6}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.stats.avgCreditPerAcc}
                        </Typography>
                    </MUIGrid>
                </MUIGrid>
            </CardContent>
        </Card>
    );

};

export default StatisticsInfoCard;