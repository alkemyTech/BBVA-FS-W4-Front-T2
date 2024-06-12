import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    id:"",
    balance: "",
    account_type:"",
    currency:"",
    token: ""
  };

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
      setUser: (state, action) => {
        const { balance, account_type, currency , token } = action.payload;
        state.balance = balance;
        state.account_type = account_type;
        state.currency = currency;
        state.token = token;
      },
      clearUser: () => initialState, 
    },
  });

export const { setAccount ,clearAccount} = accountSlice.actions;
export default accountSlice.reducer;
