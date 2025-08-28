import { configureStore } from "@reduxjs/toolkit";
import useReducer  from "./userSlice";
import feedReducer  from "./feedSlice";
import connectionreducer from "./connectionSlice"
import requestReducer from "./requestSlice"

const appStore = configureStore({
    reducer : {
        user : useReducer,
        feed : feedReducer,
        connections : connectionreducer,
        requests : requestReducer,
    },
})

export default appStore;