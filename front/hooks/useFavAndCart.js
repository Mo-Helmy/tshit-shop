import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cartActions } from '../store/cartSlice';
import { favoriteActions } from '../store/favoriteSlice';
import { snackbarActions } from '../store/snackbarSlice';
import { apiUrl } from '../util/link-config';
import axiosInstance from '../util/axiosInstance';

const useFavAndCart = (session) => {
  const favoriteState = useSelector((state) => state.favorite);
  const cartState = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // set initial value for favorite and cart
  useEffect(() => {
    if ((favoriteState.isInitial || cartState.isInitial) && session) {
      console.log(
        '🚀 ~ file: useFavAndCart.js:20 ~ useEffect ~ apiUrl',
        apiUrl
      );
      axiosInstance
        .get(`${apiUrl}/api/users/${session.id}/data`)
        .then((res) => {
          dispatch(
            favoriteActions.setInitialValue(res.data.userData.favorite || [])
          );
          dispatch(
            cartActions.setInitiatCart(
              res.data.userData.cart || {
                items: [],
                totalPrice: 0,
                totalQuantity: 0,
              }
            )
          );
        })
        .catch((error) =>
          dispatch(
            snackbarActions.openSnackbar({
              severity: 'error',
              message: `${error}`,
            })
          )
        );
    }
  }, [session]);

  // send favorite data to api if changed
  useEffect(() => {
    if (favoriteState.isInitial) return;

    if (favoriteState.changed && session) {
      axiosInstance.post(`/api/users/${session.id}/data`, {
        favorite: favoriteState.value,
      });
    }
  }, [favoriteState.value]);

  // send cart data to api if changed
  useEffect(() => {
    if (cartState.isInitial) return;

    if (cartState.changed && session) {
      axiosInstance
        .post(`/api/users/${session.id}/data`, {
          cart: {
            items: cartState.items,
            totalPrice: cartState.totalPrice,
            totalQuantity: cartState.totalQuantity,
          },
        })
        .then(() => {
          if (cartState.process === 'ADD' || cartState.process === 'REMOVE')
            dispatch(
              snackbarActions.openSnackbar({
                severity: 'success',
                message:
                  cartState.process === 'ADD'
                    ? 'Item added to cart.'
                    : cartState.process === 'REMOVE'
                    ? 'Item removed from cart.'
                    : '',
              })
            );
        })
        .catch(() => {
          dispatch(
            snackbarActions.openSnackbar({
              severity: 'error',
              message: 'Something went wrong',
            })
          );
        });
    }
  }, [cartState.items]);

  return {};
};

export default useFavAndCart;
