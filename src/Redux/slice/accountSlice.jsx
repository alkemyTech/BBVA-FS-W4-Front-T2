// src/Redux/slice/accountSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Acción para obtener las cuentas del usuario
export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAccounts",
  async (userId) => {
    const response = await fetch(`http://localhost:8080/accounts/myAccounts/${userId}`);
    if (!response.ok) {
      throw new Error('Error al obtener las cuentas');
    }
    const data = await response.json();
    return data;
  }
);

const initialState = {
  accounts: [],
  status: 'idle',
  error: null,
  balance: 0,
  account_type: '',
  currency: '',
  cbu:'',
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccount: (state, action) => {
      const { balance, account_type, currency, cbu } = action.payload;
      state.balance = balance;
      state.account_type = account_type;
      state.currency = currency;
      state.cbu = cbu;
    },
    clearAccount: () => initialState,
    addBalance: (state, action) => {
      state.balance += action.payload.amount;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setAccount, clearAccount, addBalance } = accountSlice.actions;
export default accountSlice.reducer;
