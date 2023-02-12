import { createSlice } from '@reduxjs/toolkit';

const itemDetails = {
  id: '',
  title: '',
  price: '',
  color: '',
  size: '',
  quantity: '',
  itemToltalPrice: '',
  colorUrl: '',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    isInitial: true,
    changed: false,
    process: null,
    items: [],
    totalPrice: 0,
    totalQuantity: 0,
  },
  reducers: {
    resetProcess: (state) => {
      state.process = null;
    },
    setInitiatCart: (state, action) => {
      state.isInitial = false;
      state.items = action.payload.items;
      state.totalPrice = action.payload.totalPrice;
      state.totalQuantity = action.payload.totalQuantity;
    },
    addToCart: (state, action) => {
      state.process = 'ADD';
      state.changed = true;
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.color === action.payload.color &&
          item.size === action.payload.size
      );

      if (existingItemIndex === -1) {
        state.items = state.items.concat(action.payload);
      } else {
        state.items[existingItemIndex].quantity += action.payload.quantity;
        state.items[existingItemIndex].itemToltalPrice +=
          action.payload.itemToltalPrice;
      }

      state.totalPrice = state.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      state.totalQuantity = state.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
    },
    removeFromCart: (state, action) => {
      state.process = 'REMOVE';
      state.changed = true;
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.color === action.payload.color &&
          item.size === action.payload.size
      );
      if (state.items[existingItemIndex].quantity === action.payload.quantity) {
        state.items = state.items.filter(
          (item, index) => index !== existingItemIndex
        );
      } else {
        state.items[existingItemIndex].quantity -= action.payload.quantity;
        state.items[existingItemIndex].itemToltalPrice -=
          action.payload.itemToltalPrice;
      }
      state.totalPrice = state.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      state.totalQuantity = state.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
    },
    clearCart: (state) => {
      state.changed = true;
      state.process = null;
      state.items = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice;
