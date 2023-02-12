import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InfoIcon from '@mui/icons-material/Info';
import ContactPageIcon from '@mui/icons-material/ContactPage';

import { useRouter } from 'next/navigation';

const MobileNavDrawer = ({ openSidebar, onCloseSidebar }) => {
  const router = useRouter();
  return (
    <Drawer open={openSidebar} onClose={onCloseSidebar}>
      <List style={{ minWidth: '70vw' }}>
        <ListItem>
          <ListItemButton
            onClick={() => {
              router.push('/');
              onCloseSidebar();
            }}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>Home</ListItemText>
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemButton
            onClick={() => {
              router.push('/shop');
              onCloseSidebar();
            }}
          >
            <ListItemIcon>
              <StorefrontIcon />
            </ListItemIcon>
            <ListItemText>Shop</ListItemText>
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemButton
            onClick={() => {
              router.push('/about');
              onCloseSidebar();
            }}
          >
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText>About</ListItemText>
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemButton
            onClick={() => {
              router.push('/contact');
              onCloseSidebar();
            }}
          >
            <ListItemIcon>
              <ContactPageIcon />
            </ListItemIcon>
            <ListItemText>Contact</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default MobileNavDrawer;
