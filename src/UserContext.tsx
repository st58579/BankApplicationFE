import React, {Component} from "react";
import {User} from "./Types";

const UserContext = React.createContext({user : null, setUser : (user : User) => {}});

class UserProvider extends Component {
    // Context state
    state = {
        user: null
    };

    // Method to update state
    setUser = (user : any) => {
        this.setState((prevState) => ({ user }))
    };

    render() {
        const { children } = this.props;
        const { user } = this.state;
        const { setUser } = this;

        return (
            <UserContext.Provider
                value={{user, setUser,}}
            >
                {children}
            </UserContext.Provider>
        )
    }
}

export default UserContext;
export { UserProvider };