import { configureStore } from '@reduxjs/toolkit';
import stockCryptoReducer from './slices/stockCryptoSlice';

const store = configureStore({
  reducer: {
    stockCrypto: stockCryptoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
