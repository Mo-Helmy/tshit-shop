import { createSlice } from '@reduxjs/toolkit';

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState: { isInitial: true, value: [], changed: false },
  reducers: {
    setInitialValue: (state, action) => {
      state.value = action.payload;
      state.isInitial = false;
    },
    addToFavorite(state, action) {
      state.changed = true;
      state.value = state.value.concat(action.payload);
    },
    removeFormFavorite(state, action) {
      state.changed = true;
      state.value = state.value.filter((el) => el !== action.payload);
    },
  },
});

export const favoriteActions = favoriteSlice.actions;

export default favoriteSlice;
