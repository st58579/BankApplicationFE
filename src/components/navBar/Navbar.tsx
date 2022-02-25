import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import './Navbar.css';
import {UserData} from "../../Types";
import UserContext from "../../UserContext";


//navigační komponenta
const Navbar = (props : any) => {

    const [scrolled,setScrolled]=React.useState(false);
    const [searchBarContent, setSearchBarContent] = React.useState('');

    const handleScroll=() => {
        const offset=window.scrollY;
        if(offset > 0 ){
            setScrolled(true);
        }
        else{
            setScrolled(false);
        }   
    };

    const handleInput =  (event: React.ChangeEvent<HTMLInputElement>) : void => {
      const input = event.target.value;
      setSearchBarContent(input);
    };

    const submitInput = () => {
      const value = searchBarContent.trim().toLowerCase();
      setSearchBarContent('');
      props.searchTermHandler(value);
    };



    useEffect(() => {
        window.addEventListener('scroll',handleScroll)
    });

    const navbarClasses=['navbar'];
    if(scrolled){
        navbarClasses.push('scrolled');
    }

    // @ts-ignore
    let {user} : {user : UserData} = React.useContext(UserContext);

    return (
        <div className='navbarWrapper'>

            {user ? <div className='registrationLoginLinks'>
                <span>
                    <span>
                        {user.login}
                        {user.emulate ? " emuluje " + user.emulate.login : null}
                    </span>

                    {user.role === "ADMIN" ?
                        (!user.emulate ?
                            <span>
                            &nbsp;|&nbsp;
                            <Link to='/emulate' className='blackLink'>
                                Emulovat sezení
                            </Link>
                            </span> : <span>
                            &nbsp;|&nbsp;
                                <Link to='/stopEmulate'
                                      className='blackLink'>
                                        Zastavit emulaci
                                </Link>
                            </span>) : null
                    }

                    &nbsp;|&nbsp;

                    <Link to='/logout' className='blackLink'>
                        Odhlásit se
                    </Link>
                </span>
            </div> : null}


            <header className={navbarClasses.join(' ')}>
                <div className='shopName'>
                    <Link to='/' className='titleLink'>
                        Prohlížeč bankovních údajů
                    </Link>
                </div>
            </header>
        </div>


    )
};

export default Navbar;