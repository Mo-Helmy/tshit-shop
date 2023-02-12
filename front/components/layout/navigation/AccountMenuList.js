import { Divider, IconButton, Menu, MenuItem } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import LogoutIcon from '@mui/icons-material/Logout';
import FormatShapesIcon from '@mui/icons-material/FormatShapes';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

const AccountMenuList = ({
  anchorEl,
  isAccountMenuOpen,
  closeAccountMenuHandler,
  session,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={isAccountMenuOpen}
      onClose={closeAccountMenuHandler}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      PaperProps={{ elevation: 2 }}
    >
      {!session && (
        <Link href="/auth/login">
          <MenuItem onClick={closeAccountMenuHandler}>
            <IconButton size="small">
              <LoginIcon />
            </IconButton>{' '}
            Login
          </MenuItem>
        </Link>
      )}
      {!session && (
        <Link href="/auth/signup">
          <Divider />
          <MenuItem onClick={closeAccountMenuHandler}>
            {' '}
            <IconButton size="small">
              <PersonAddIcon />
            </IconButton>{' '}
            Signup
          </MenuItem>
        </Link>
      )}

      <Link href={session ? `/${session.id}/favorite` : '/auth/login'}>
        <MenuItem onClick={closeAccountMenuHandler}>
          <FavoriteIcon fontSize="medium" sx={{ mr: 1 }} />
          Favorite
        </MenuItem>
      </Link>

      <Divider />

      <Link href={`/${session?.id}/cart`}>
        {/* <Link href={session ? `/${session.id}/cart` : '/auth/login'}> */}
        <MenuItem onClick={closeAccountMenuHandler}>
          <ShoppingCartIcon fontSize="medium" sx={{ mr: 1 }} />
          Cart
        </MenuItem>
      </Link>

      {session && (
        <Link href={`/${session.id}/orders`}>
          <Divider />
          <MenuItem onClick={closeAccountMenuHandler}>
            <ShoppingCartCheckoutIcon fontSize="medium" sx={{ mr: 1 }} />
            Orders
          </MenuItem>
        </Link>
      )}

      {session && (session.role === 'admin' || session.role === 'designer') && (
        <Link href={`/${session.id}/add-design`}>
          <Divider />
          <MenuItem onClick={closeAccountMenuHandler}>
            <FormatShapesIcon fontSize="medium" sx={{ mr: 1 }} />
            Add Design
          </MenuItem>
        </Link>
      )}

      {session && (session.role === 'admin' || session.role === 'designer') && (
        <Link href={`/${session.id}/add-product`}>
          <Divider />
          <MenuItem onClick={closeAccountMenuHandler}>
            <AddBoxIcon fontSize="medium" sx={{ mr: 1 }} />
            Add Product
          </MenuItem>
        </Link>
      )}

      <Divider />

      {session && (
        <MenuItem
          onClick={() => {
            closeAccountMenuHandler();
            signOut();
          }}
        >
          <LogoutIcon fontSize="medium" sx={{ mr: 1 }} />
          LogOut
        </MenuItem>
      )}
    </Menu>
  );
};

export default AccountMenuList;
