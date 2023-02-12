import {
  AppBar,
  // Box,
  // Button,
  Container,
  CssBaseline,
  // Divider,
  // IconButton,
  // Menu,
  // MenuItem,
  // Stack,
  // Typography,
  useMediaQuery,
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Container from '@mui/material/Container';
// import CssBaseline from '@mui/material/CssBaseline';
// import Divider from '@mui/material/Divider';
// import IconButton from '@mui/material/IconButton';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import useMediaQuery from '@mui/material/useMediaQuery';
// // import useTheme from '@mui/material/useTheme';
// import { useTheme } from '@mui/material';

// import LoginIcon from '@mui/icons-material/Login';
// import PersonAddIcon from '@mui/icons-material/PersonAdd';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
// import LogoutIcon from '@mui/icons-material/Logout';
// import FormatShapesIcon from '@mui/icons-material/FormatShapes';
// import AddBoxIcon from '@mui/icons-material/AddBox';
// import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { ColorModeCtx } from '../../pages/_app';

import { useSession } from 'next-auth/react';

// import Search from './navigation/Search';
// import ColorModeIcon from './navigation/icons/ColorModeIcon';
// import SearchIconMenu from './navigation/icons/SearchIconMenu';
// import AccountIconMenu from './navigation/icons/AccountIconMenu';

import useFavAndCart from '../../hooks/useFavAndCart';
import DesktopMenuBar from './navigation/DesktopMenuBar';
import MobileMenuBar from './navigation/MobileMenuBar';
import MobileNavDrawer from './navigation/MobileNavDrawer';
import AccountMenuList from './navigation/AccountMenuList';

const Navigation = ({ onshowSearchField, showSearchField }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const colorModeCtx = useContext(ColorModeCtx);
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const isAccountMenuOpen = Boolean(anchorEl);

  const { data: session, status } = useSession();

  //set init value for cart and favorite in store and send data to api when changed
  useFavAndCart(session);

  console.log('🚀 ~ file: Navigation.js:50 ~ Navigation ~ session', session);

  useEffect(() => {
    if (localStorage.getItem('colorMode')) {
      const colorMode = localStorage.getItem('colorMode');
      colorModeCtx.setColorMode(colorMode);
    }
  }, []);

  const toggleColorModeHandler = () => {
    localStorage.setItem(
      'colorMode',
      theme.palette.mode === 'light' ? 'dark' : 'light'
    );
    colorModeCtx.toggleColorMode();
  };

  return (
    <AppBar position="static" sx={{ py: 1.5 }} color="primary">
      <CssBaseline />
      <Container>
        {!isMobile && (
          <DesktopMenuBar
            showSearchField={showSearchField}
            onshowSearchField={onshowSearchField}
            themePaletteMode={theme.palette.mode}
            toggleColorModeHandler={toggleColorModeHandler}
            setAccountAnchorEl={(e) => setAnchorEl(e.currentTarget)}
          />
        )}
        {isMobile && (
          <MobileMenuBar
            showSearchField={showSearchField}
            openSidebarHandler={() => setOpenSidebar(true)}
            onshowSearchField={onshowSearchField}
            themePaletteMode={theme.palette.mode}
            toggleColorModeHandler={toggleColorModeHandler}
            setAccountAnchorEl={(e) => setAnchorEl(e.currentTarget)}
          />
        )}

        <MobileNavDrawer
          openSidebar={openSidebar}
          onCloseSidebar={() => setOpenSidebar(false)}
        />

        <AccountMenuList
          isAccountMenuOpen={isAccountMenuOpen}
          anchorEl={anchorEl}
          closeAccountMenuHandler={() => setAnchorEl(null)}
          session={session}
        />
      </Container>
    </AppBar>
  );
};

export default Navigation;
