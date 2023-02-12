import { Button, Typography, Stack } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import AccountIconMenu from './icons/AccountIconMenu';
import ColorModeIcon from './icons/ColorModeIcon';
import SearchIconMenu from './icons/SearchIconMenu';
import Search from './Search';

const DesktopMenuBar = ({
  showSearchField,
  onshowSearchField,
  setAccountAnchorEl,
  themePaletteMode,
  toggleColorModeHandler,
}) => {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="h4" component="div">
        <Link href="/" color="inherit" sx={{ textDecoration: 'none' }}>
          Godzilla
        </Link>
      </Typography>
      <Stack direction="row">
        {!showSearchField && (
          <>
            <Link href="/">
              <Button color="inherit">Home</Button>
            </Link>
            <Link href="/shop">
              <Button color="inherit">Shop</Button>
            </Link>
            <Link href="/about">
              <Button color="inherit">About</Button>
            </Link>
            <Link href="/contact">
              <Button color="inherit">Contact</Button>
            </Link>
            <SearchIconMenu onshowSearchField={onshowSearchField} />
            <AccountIconMenu setAccountAnchorEl={setAccountAnchorEl} />
            <ColorModeIcon
              themePaletteMode={themePaletteMode}
              toggleColorModeHandler={toggleColorModeHandler}
            />
          </>
        )}
        {showSearchField && <Search />}
      </Stack>
    </Stack>
  );
};

export default DesktopMenuBar;
