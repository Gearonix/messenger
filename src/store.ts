import {combineReducers, createStore,applyMiddleware} from "redux";
import {reducer as form} from "redux-form";
import thunk from 'redux-thunk';
import login_reducer from "./reducers/login_reducer";
import messages_reducer from "./reducers/messages_reducer";
let reducers= combineReducers({
    form : form,
    login : login_reducer,
    messages : messages_reducer
})

type GLOBAL_TYPE = typeof reducers;

export type StateType = ReturnType<GLOBAL_TYPE>

let store = createStore(reducers,applyMiddleware(thunk));


export default store