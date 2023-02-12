import { IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import React from 'react';

const AccountIconMenu = ({ setAccountAnchorEl }) => {
  return (
    <IconButton color="inherit" onClick={setAccountAnchorEl}>
      <AccountCircleIcon />
    </IconButton>
  );
};

export default AccountIconMenu;
