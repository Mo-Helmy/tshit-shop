import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import React from 'react';
import { useDispatch } from 'react-redux';
import { cartActions } from '../../store/cartSlice';
import { useRouter } from 'next/router';
import { apiUrl } from '../../util/link-config';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  console.log('🚀 ~ file: CartItem.js:22 ~ CartItem ~ router', router.pathname);

  return (
    <Card sx={{ display: 'flex', maxWidth: '100%', position: 'relative' }}>
      <CardMedia
        component="img"
        image={apiUrl + item.colorUrl}
        alt={item.title}
        sx={{ width: 150 }}
      />
      <Box px={2} sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography>{item.title}</Typography>
          <Typography>Size: {item.size}</Typography>
          {router.pathname === '/[userId]/add-order' && (
            <Typography>Quantity: {item.quantity}</Typography>
          )}
        </CardContent>
        {router.pathname !== '/[userId]/add-order' && (
          <Stack direction="row" spacing={2} mb={1}>
            <ButtonGroup color="inherit">
              <Button
                onClick={() => {
                  dispatch(
                    cartActions.removeFromCart({
                      ...item,
                      quantity: 1,
                      itemToltalPrice: item.price,
                    })
                  );
                  dispatch(cartActions.resetProcess());
                }}
              >
                {item.quantity === 1 ? (
                  <DeleteOutlinedIcon color="inherit" sx={{ opacity: 0.8 }} />
                ) : (
                  '-'
                )}
              </Button>
              <Button>{item.quantity}</Button>
              <Button
                onClick={() => {
                  dispatch(
                    cartActions.addToCart({
                      ...item,
                      quantity: 1,
                      itemToltalPrice: item.price,
                    })
                  );
                  dispatch(cartActions.resetProcess());
                }}
              >
                +
              </Button>
            </ButtonGroup>
            <IconButton
              size="small"
              color="inherit"
              sx={{
                position: 'absolute',
                top: 5,
                right: 5,
                borderRadius: 9999,
              }}
              onClick={() =>
                dispatch(
                  cartActions.removeFromCart({
                    id: item.id,
                    color: item.color,
                    size: item.size,
                    quantity: item.quantity,
                    itemToltalPrice: item.itemToltalPrice,
                  })
                )
              }
            >
              <ClearOutlinedIcon />
            </IconButton>
          </Stack>
        )}
      </Box>
    </Card>
  );
};

export default CartItem;
