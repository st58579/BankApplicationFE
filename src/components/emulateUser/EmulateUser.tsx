import React from "react";
import {CircularProgress} from "@material-ui/core";
import {Redirect} from "react-router";
import UserContext from "../../UserContext";
import {UserData} from "../../Types";
import Api from "../../api/Api";
import {withCookies} from "react-cookie";

interface EmulateUserProps {
    match : any
}

interface EmilateUserState {
    loading : boolean
}

//třída zodpovědná za emulování úživatele
class EmulateUser extends React.Component<any, any>{

    static contextType = UserContext;

    constructor(props: EmulateUserProps, context: any) {
        super(props, context);
        this.state = {loading : true}
    }


    componentDidMount(): void {
        const {user} : {user : UserData;} = this.context;
        const {setUser} = this.context;
        Api.getUserById(Number(this.props.match.params.userID), user.jwt).then(
            response => {
                const emulatedUsedData : UserData = response.data;
                user.emulate = emulatedUsedData;
                setUser(user);
                this.setState({loading : false});
                const {cookies} = this.props;
                cookies.set('user', user, {maxAge : 60 * 60});
            }
        ).catch(error => {
        })
    }


    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {
        if (this.state.loading){
            return <CircularProgress />;
        }

        return <Redirect to='/'/>
    }
}

// @ts-ignore
export default withCookies(EmulateUser);