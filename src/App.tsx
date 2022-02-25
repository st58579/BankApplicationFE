import React from 'react';
import './App.css';
import {BrowserRouter, NavLink, Route, Switch} from "react-router-dom";
import Navbar from "./components/navBar/Navbar";
import {UserProvider} from "./UserContext";
import MainContent from "./components/MainContent";
import { CookiesProvider } from 'react-cookie';

function App() {

  return (
        <div>
            <UserProvider>
                <BrowserRouter>
                    <CookiesProvider>
                        <Navbar/>
                        <MainContent/>
                    </CookiesProvider>
                </BrowserRouter>
            </UserProvider>
        </div>
  );
}

export default App;
