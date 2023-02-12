import { Button, IconButton, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddressItem from './selectShippingAddress/AddressItem';
import CartList from '../../cart/CartList';
import { useDispatch } from 'react-redux';
import { snackbarActions } from '../../../store/snackbarSlice';
import { cartActions } from '../../../store/cartSlice';
import { useRouter } from 'next/router';
import { axiosApiAuth } from '../../../util/axiosInstance';

const ConfirmOrderDetails = ({ onBack, selectedAddress, session }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const addOrderHandler = async () => {
    axiosApiAuth
      .post(`/api/orders/${session.id}`, {
        address: selectedAddress,
      })
      .then(() => {
        dispatch(cartActions.clearCart());
        dispatch(
          snackbarActions.openSnackbar({
            severity: 'success',
            message: 'Order added successfully',
          })
        );
        router.push(`/${session.id}/orders`);
      });
  };

  return (
    <Stack direction="column" gap={2} pb={2}>
      <IconButton onClick={onBack} sx={{ width: 'fit-content' }}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h5">Order Details</Typography>
      <CartList />
      <Typography variant="h5">Shipping Address</Typography>
      <AddressItem address={selectedAddress} />
      <Button variant="contained" color="secondary" onClick={addOrderHandler}>
        Confirm
      </Button>
    </Stack>
  );
};

export default ConfirmOrderDetails;
