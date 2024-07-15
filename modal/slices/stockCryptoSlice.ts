import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface DataEntry {
  symbol: string;
  data: any;
  timestamp: string;
}

interface StockCryptoState {
  symbol: string;
  data: DataEntry[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: StockCryptoState = {
  symbol: 'bitcoin',
  data: [],
  status: 'idle',
};

export const fetchData = createAsyncThunk(
  'stockCrypto/fetchData',
  async (symbol: string) => {
    const response = await axios.get(`/api/data/${symbol}`);
    return response.data;
  }
);

const stockCryptoSlice = createSlice({
  name: 'stockCrypto',
  initialState,
  reducers: {
    setSymbol: (state, action: PayloadAction<string>) => {
      state.symbol = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchData.fulfilled, (state, action: PayloadAction<DataEntry[]>) => {
        state.status = 'idle';
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { setSymbol } = stockCryptoSlice.actions;

export default stockCryptoSlice.reducer;
