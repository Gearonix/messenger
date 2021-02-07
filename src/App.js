import logo from './logo.svg';
import './App.css';
import {Switch, Route, NavLink} from 'react-router-dom';
import Login from "./components/login/login";
import Register from "./components/register/register";
import EnterRoom from "./components/enterRoom/enterRoom";
import Messages from "./components/messages/messages";
import React from 'react';
import Default from "./components/default/default";
import CreateRoom from "./components/createroom/createRoom";

const App = function(){
      return (
          <div className="App">
              <Switch>
                  <Route path={'/login'} component={Login}/>
                  <Route path={'/register'} component={Register} />
                  <Route path={'/enterroom'} component={EnterRoom} />
                  <Route path={'/createroom'} component={CreateRoom} />
                  <Route path={'/messages'} component={Messages} />
                  <Route exact path={'/'} component={Default} />
              </Switch>
          </div>
      );
}

export default App
