import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import cartSlice from './cartSlice';
import favoriteSlice from './favoriteSlice';
import snackbarSlice from './snackbarSlice';

const store = configureStore({
  reducer: {
    snackbar: snackbarSlice.reducer,
    favorite: favoriteSlice.reducer,
    cart: cartSlice.reducer,
  },
});

export default store;
