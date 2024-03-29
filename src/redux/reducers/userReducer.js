import { useEffect } from 'react';
import { createReducer } from "@reduxjs/toolkit";
import userActions from "../actions/userActions";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { enter, enterAgain, exit, getOneUser,  editUser } = userActions;
const initialState = {
  name: "",
  photo: "",
  logged: false,
  token: "",
  role: "",
  id:"",
  profile: []
};

const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(enter.fulfilled, (state, action) => {
     
      const { success, response } = action.payload;
      

      if (success) {
        let { user, token } = response; 

        AsyncStorage.setItem('token',JSON.stringify({ token: { user: token } }))
                    .catch(err=>console.log(err))
      
        let newState = {
          ...state,
          name: user.name,
          photo: user.photo,
          logged: true,
          token: token,
          role: user.role,
        };
        return newState;
      } else {
        let newState = {
          ...state,
          message: response,
        };
        return newState;
      }
    })

    .addCase(enterAgain.fulfilled, (state, action) => {
     
      const { success, response } = action.payload;
     
      if (success) {
        let { user, token } = response;

        let newState = {
          ...state,
          id: user.id,
          name: user.name,
          photo: user.photo,
          role: user.role,
          logged: true,
          token: token,
        };
        return newState;
      } else {
        let newState = {
          ...state,
          message: response,
        };
        return newState;
      }

    })
    .addCase(getOneUser.fulfilled,(state,action)=>{
      
      return{
          ...state,
      profile: action.payload.user
      }
  
      }).addCase(editUser.fulfilled,(state,action)=>{
          return{
              ...state,
              id:action.payload.id
          }
      })
    .addCase(exit.fulfilled, (state, action) => {
      const { success, response } = action.payload;
      if (success) {
        /* localStorage.removeItem("token"); */
        AsyncStorage.removeItem('token')
        let newState = {
          ...state,
          name: "",
          photo: "",
          role: "",
          logged: false,
          token: "",
        };
        return newState;
      } else {
        let newState = {
          ...state,
          message: response,
        };
        return newState;
      }
    });
});


export default userReducer;
