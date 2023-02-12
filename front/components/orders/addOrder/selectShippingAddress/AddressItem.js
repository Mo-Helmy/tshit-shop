import { Paper, Typography } from '@mui/material';
import React from 'react';

const AddressItem = ({ address }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5">{address.fullname}</Typography>
      <Typography>
        {address.street}, {address.building}, {address.floor},{' '}
        {address.landmark}
      </Typography>
      <Typography>
        {address.area}, {address.city}
      </Typography>
      <Typography>Mobile: {address.mobile}</Typography>
    </Paper>
  );
};

export default AddressItem;
