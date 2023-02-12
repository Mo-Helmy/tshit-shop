import { Divider, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';

const DesignedBy = ({ designer }) => {
  return (
    <Stack>
      <Divider sx={{ mb: 1 }} />
      <Typography component="span">
        Designed By:{' '}
        <Link href="#" style={{ fontWeight: 'bold' }}>
          {designer}
        </Link>
      </Typography>
    </Stack>
  );
};

export default DesignedBy;
