import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./UISlice";   
import userReducer from "./userSlice";

const store = configureStore({
  reducer: { 
    ui: uiReducer.reducer, 
    user: userReducer.reducer 
  }
})

export default store