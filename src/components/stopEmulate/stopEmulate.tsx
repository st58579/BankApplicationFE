import React from "react";
import UserContext from "../../UserContext";
import {UserData} from "../../Types";
import {CircularProgress} from "@material-ui/core";
import {Redirect} from "react-router";
import {withCookies} from "react-cookie";

//třída zodpovědna za zastavení emulování uživatele
class StopEmulate extends React.Component<any, any>{

    static contextType = UserContext;

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {loading : true}
    }


    componentDidMount(): void {
        const {user} : {user : UserData;} = this.context;
        if (!user){
            return;
        }
        const {setUser} = this.context;
        user.emulate = undefined;
        setUser(user);
        this.setState({loading : false});
        const {cookies} = this.props;
        cookies.set('user', user, {maxAge : 60 * 60});
    }


    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {
        if (this.state.loading){
            return <CircularProgress />;
        }

        return <Redirect to='/'/>
    }
}

export default withCookies(StopEmulate);