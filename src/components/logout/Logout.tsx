import React from "react";
import { withCookies, Cookies } from 'react-cookie';
import {Redirect} from "react-router";
import UserContext from "../../UserContext";

//třída zodpovědná za odhlášení
class Logout extends React.Component<any, any>{

    static contextType = UserContext;

    componentDidMount(): void {
        const {cookies} = this.props;
        cookies?.remove('user');
        const {setUser} = this.context;
        setUser(null);
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {
        return <Redirect to={'/'}/>
    }

}

export default withCookies(Logout);