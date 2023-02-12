import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import React from 'react';

const ColorModeIcon = ({ toggleColorModeHandler, themePaletteMode }) => {
  return (
    <IconButton color="inherit" onClick={toggleColorModeHandler}>
      {themePaletteMode === 'light' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default ColorModeIcon;
