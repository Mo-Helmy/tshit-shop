import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Loading from '../UI/Loading';
import Link from 'next/link';
import CartItem from './CartItem';

const CartList = ({ session }) => {
  const router = useRouter();
  const cartState = useSelector((state) => state.cart);
  console.log('🚀 ~ file: CartList.js:6 ~ CartList ~ cartState', cartState);

  if (cartState.isInitial) {
    return <Loading />;
  }

  return (
    <Paper
      component="div"
      sx={{
        my: router.pathname !== '/[userId]/add-order' ? 3 : 0,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
      elevation={2}
    >
      {router.pathname !== '/[userId]/add-order' && (
        <Typography variant="h5" gutterBottom align="center">
          Subtotal:{' '}
          <Typography variant="h5" fontWeight="bold" component="span">
            <Typography component="sup" variant="body2">
              EGP
            </Typography>
            {cartState.totalPrice}
          </Typography>
        </Typography>
      )}

      {router.pathname !== '/[userId]/add-order' && (
        <Button
          variant="contained"
          color="secondary"
          sx={{ width: '300px' }}
          disabled={cartState.totalQuantity === 0}
          onClick={() => router.push(`/${session.id}/add-order`)}
        >
          Proceed to Buy ({cartState.totalQuantity} Items)
        </Button>
      )}

      {cartState.totalQuantity === 0 && (
        <Link href="/">
          <Button size="small">Add some awsome items.</Button>
        </Link>
      )}

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        flexWrap="wrap"
        gap={2}
        justifyContent="center"
      >
        {cartState.items.map((item, i) => (
          <CartItem item={item} key={i} />
        ))}
      </Stack>

      {router.pathname === '/[userId]/add-order' && (
        <>
          <Divider />
          <Box textAlign="left">
            <Typography variant="h6" align="left">
              Subtotal:{' '}
              <Typography variant="h6" fontWeight="bold" component="span">
                <Typography component="sup" variant="body2">
                  EGP
                </Typography>
                {cartState.totalPrice}
              </Typography>
            </Typography>

            <Typography variant="h6" align="left">
              Shipping:{' '}
              <Typography variant="h6" fontWeight="bold" component="span">
                <Typography component="sup" variant="body2">
                  EGP
                </Typography>
                40
              </Typography>
            </Typography>

            <Divider />

            <Typography variant="h5" align="left">
              Total:{' '}
              <Typography variant="h5" fontWeight="bold" component="span">
                <Typography component="sup" variant="body2">
                  EGP
                </Typography>
                {cartState.totalPrice + 40}
              </Typography>
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default CartList;
