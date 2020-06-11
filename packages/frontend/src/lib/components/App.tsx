import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {MainPage} from "./MainPage";

export function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" ><MainPage /></Route>
            </Switch>
        </BrowserRouter>
    )
}