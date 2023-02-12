import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { apiUrl } from '../../../util/link-config';

const orderStatus = ['pending', 'printing', 'delivering', 'delivered'];

const OrderItem = ({ order }) => {
  return (
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', px: 1 }}>
      <Typography variant="h6" px={1}>
        Items:
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={2} justifyContent="center">
        {order.items.map((item, i) => (
          <Card key={i} sx={{ display: 'flex', height: 'fit-content' }}>
            <CardMedia
              component="img"
              image={apiUrl + item.colorUrl}
              alt={item.title}
              sx={{ width: 100 }}
            />
            <Box px={0} sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ px: 1, pt: 1 }}>
                <Typography>{item.title}</Typography>
                <Typography>Size: {item.size}</Typography>
                <Typography>Qty: {item.quantity}</Typography>
              </CardContent>
            </Box>
          </Card>
        ))}
      </Stack>

      {/* order summary */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" px={1}>
            Order Summary:{' '}
            <Typography variant="h5" fontWeight="bold" component="span">
              <Typography component="sup" variant="body2">
                EGP
              </Typography>
              {order.totalPrice}
            </Typography>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', px: 1 }}>
            <Typography variant="h6" align="left">
              Subtotal:{' '}
              <Typography variant="h6" fontWeight="bold" component="span">
                <Typography component="sup" variant="body2">
                  EGP
                </Typography>
                {order.cartTotalPrice}
              </Typography>
            </Typography>

            <Typography variant="h6" align="left">
              Shipping:{' '}
              <Typography variant="h6" fontWeight="bold" component="span">
                <Typography component="sup" variant="body2">
                  EGP
                </Typography>
                {order.shippingPrice}
              </Typography>
            </Typography>

            <Divider />

            <Typography variant="h5" align="left">
              Total:{' '}
              <Typography variant="h5" fontWeight="bold" component="span">
                <Typography component="sup" variant="body2">
                  EGP
                </Typography>
                {order.totalPrice}
              </Typography>
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* order status */}

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" px={1}>
            Order Status: {order.status?.toUpperCase()}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Timeline>
            {orderStatus.map((status, i) => (
              <TimelineItem key={i}>
                <TimelineSeparator>
                  <TimelineDot
                    color={order.status === status ? 'success' : 'grey'}
                  />
                  {i !== orderStatus.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent
                  color={order.status === status ? 'success.main' : 'inherit'}
                >
                  {status.toUpperCase()}
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </AccordionDetails>
      </Accordion>

      <Typography>Ordered at: {order.iat?.split('T')[0]}</Typography>
    </Paper>
  );
};

export default OrderItem;
