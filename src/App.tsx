import './App.css';
import {Switch, Route} from 'react-router-dom';
import Login from "./components/login/login";
import Register from "./components/register/register";
import EnterRoom from "./components/enterRoom/enterRoom";
import Messages from "./components/messages/messages";
import React, {useEffect} from 'react';
import Default from "./components/default/default";
import CreateRoom from "./components/createroom/createRoom";
import {useDispatch} from "react-redux";
import { getAuthTC } from './reducers/login_reducer';
import 'antd/dist/antd.css';

const App = function(){
    const dispatch = useDispatch();
    function mount(){
        dispatch(getAuthTC())
    }
    useEffect(mount,[])
      return (
          <div className="App">
              <Switch>
                  <Route path={'/login'} component={Login}/>
                  <Route path={'/register'} component={Register} />
                  <Route path={'/enterroom'} component={EnterRoom} />
                  <Route path={'/createroom'} component={CreateRoom} />
                  <Route path={'/messages'} component={Messages} />
                  <Route exact path={'/'} component={Login} />
              </Switch>
          </div>
      );
}

export default App
