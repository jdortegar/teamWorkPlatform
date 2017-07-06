import React from "react";
import { Route } from "react-router-dom";
import HomeContainer from "./containers/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import SubpageContainer from "./containers/Subpage";
import Main from "./layouts/Main";

export const routesPaths = {
  home: "/",
  login: "/login",
  register: "/Register",
  subpage: "/subpage"
};

export default (
  <Main>
    <Route exact path={routesPaths.home} component={HomeContainer} />
    <Route exact path={routesPaths.login} component={Login} />
    <Route exact path={routesPaths.register} component={Register} />
    <Route exact path={routesPaths.subpage} component={SubpageContainer} />
  </Main>
);
