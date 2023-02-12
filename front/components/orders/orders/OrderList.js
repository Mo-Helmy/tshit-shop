import { Stack, Typography } from '@mui/material';
import OrderItem from './OrderItem';

const OrderList = ({ orders }) => {
  return (
    <Stack gap={2} mt={2} maxWidth={600} width="100%" mx="auto">
      <Typography variant="h6" align="center">
        Orders
      </Typography>
      {!orders || orders.length === 0 ? (
        <Typography align="center">No Orders Found</Typography>
      ) : (
        orders.map((order) => <OrderItem order={order} key={order._id} />)
      )}
    </Stack>
  );
};

export default OrderList;
