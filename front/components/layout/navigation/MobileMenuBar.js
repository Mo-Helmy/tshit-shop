import { Box, IconButton, Stack, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import React from 'react';
import AccountIconMenu from './icons/AccountIconMenu';
import ColorModeIcon from './icons/ColorModeIcon';
import SearchIconMenu from './icons/SearchIconMenu';
import Search from './Search';

const MobileMenuBar = ({
  showSearchField,
  openSidebarHandler,
  onshowSearchField,
  setAccountAnchorEl,
  themePaletteMode,
  toggleColorModeHandler,
}) => {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      {!showSearchField && (
        <IconButton color="inherit" onClick={openSidebarHandler}>
          <MenuIcon fontSize="inherit" />
        </IconButton>
      )}
      <Typography variant="h5" component="div">
        <Link href="/" color="inherit" sx={{ textDecoration: 'none' }}>
          Godzilla
        </Link>
      </Typography>
      <Box>
        {!showSearchField && (
          <>
            <SearchIconMenu onshowSearchField={onshowSearchField} />
            <AccountIconMenu setAccountAnchorEl={setAccountAnchorEl} />
            <ColorModeIcon
              themePaletteMode={themePaletteMode}
              toggleColorModeHandler={toggleColorModeHandler}
            />
          </>
        )}
        {showSearchField && <Search />}
      </Box>
    </Stack>
  );
};

export default MobileMenuBar;
