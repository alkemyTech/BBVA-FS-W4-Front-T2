// src/Redux/slice/transactionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async ({ page = 0, fromDate, toDate, transactionType, currency }) => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    params.append('page', page);

    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    if (transactionType) params.append('transactionType', transactionType);
    if (currency) params.append('currency', currency);

    const response = await fetch(`http://localhost:8080/transactions/filter?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error fetching transactions');
    }

    const data = await response.json();
    return data;
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: [],
    currentPage: 0,
    totalPages: 1,
    status: 'idle',
    error: null,
    
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactions = action.payload.transactions;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default transactionSlice.reducer;
