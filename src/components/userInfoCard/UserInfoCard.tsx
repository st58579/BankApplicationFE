import React from "react";
import {Card} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import {default as MUIGrid} from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import defaultPlaceholder from '../../static/image/noavatar.jpeg';
import './UserInfoCard.css';
import ImageDialog from "../dialogs/imageDialog/ImageDialog";


interface UserInfoCardProps {
    userId : number,
    role : string,
    login : string,
    createdBy : string | null | undefined,
    clientName : string | null | undefined,
    image : string | null | undefined,
    setMessage : any,
    setError : any,
    user : any,
    setUser : any,
    key : any
}

interface UserInfoCardState {
    showAddNewImageDialog : boolean
}

//třída reprezentující kartu informaci o uživateli
class UserInfoCard extends React.Component<UserInfoCardProps, UserInfoCardState>{


    constructor(props: UserInfoCardProps, context: any) {
        super(props, context);
        this.state = {showAddNewImageDialog : false};
    }

    private showAddNewImageDialog = () => {
        this.setState({showAddNewImageDialog : true});
    };

    private closeAddNewImageDialog = () => {
        this.setState({showAddNewImageDialog : false});
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {

        console.error("RENDERING CARD, PASSED IMAGE IS : ", this.props.image);

        return (
            <div>
                <Card className='clientCardInfo' key={this.props.key}>
                    <CardHeader title='Údaje o uživatelovi:'/>
                    <CardContent>
                        <MUIGrid container>

                            <MUIGrid container xs={8}>
                                <MUIGrid item xs ={4}>
                                    <Typography color="textSecondary" gutterBottom>
                                        Role:
                                    </Typography>
                                </MUIGrid>
                                <MUIGrid item xs ={8}>
                                    <Typography color="textPrimary" gutterBottom>
                                        {this.props.role}
                                    </Typography>
                                </MUIGrid>

                                {this.props.clientName ?
                                    <React.Fragment>
                                        <MUIGrid item xs ={4}>
                                            <Typography color="textSecondary" gutterBottom>
                                                Pro klienta:
                                            </Typography>
                                        </MUIGrid>
                                        <MUIGrid item xs ={8}>
                                            <Typography color="textPrimary" gutterBottom>
                                                {this.props.clientName}
                                            </Typography>
                                        </MUIGrid>
                                    </React.Fragment> : null}

                                <MUIGrid item xs ={4}>
                                    <Typography color="textSecondary" gutterBottom>
                                        Login:
                                    </Typography>
                                </MUIGrid>
                                <MUIGrid item xs ={8}>
                                    <Typography color="textPrimary" gutterBottom>
                                        {this.props.login}
                                    </Typography>
                                </MUIGrid>

                                <MUIGrid item xs ={4}>
                                    <Typography color="textSecondary" gutterBottom>
                                        Vytvořen uživatelem:
                                    </Typography>
                                </MUIGrid>
                                <MUIGrid item xs ={8}>
                                    <Typography color="textPrimary" gutterBottom>
                                        {this.props.createdBy ? this.props.createdBy : "Kořenový uživatel"}
                                    </Typography>
                                </MUIGrid>
                            </MUIGrid>

                            <MUIGrid container xs={4} className='imageWrapper'>
                                <CardMedia onClick={this.showAddNewImageDialog}>
                                    <img className='image' src={this.props.image ? this.props.image : defaultPlaceholder}/>
                                </CardMedia>
                            </MUIGrid>

                        </MUIGrid>
                    </CardContent>
                </Card>
                <ImageDialog userId={this.props.userId}
                             handleClose={this.closeAddNewImageDialog}
                             setMessage={this.props.setMessage}
                             setError={this.props.setError}
                             open={this.state.showAddNewImageDialog}
                             user={this.props.user}
                             setUser={this.props.setUser}
                />
            </div>

        );
    }
};

export default UserInfoCard;