import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import LoginComponent from "./components/login";
import RegisterComponent from "./components/register";
import UserComponent from "./components/user";

function App() {
  return (
      <div className="App">
        <hgroup>
          <h1>User Management Portal</h1>
        </hgroup>
        <Router>
          <Switch>
            <Route exact path="/login">
              <LoginComponent/>
            </Route>
            <Route exact path="/register">
              <RegisterComponent/>
            </Route>
            <Route exact path="/user/management">
              <UserComponent/>
          </Route>
          <Route path="/">
            <LoginComponent/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
