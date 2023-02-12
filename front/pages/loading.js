import React from 'react';
import Loading from '../components/UI/Loading';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';

const LoadingPage = () => {
  return (
    <>
      <Box>
        <Loading />
        <ButtonGroup>
          <Button>Hello</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button>Hello</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button>Hello</Button>
        </ButtonGroup>
        <Paper>
          <Card>
            <CardMedia image="#" />
            <CardContent>
              <Typography>Hello Typo</Typography>
              <Divider />
              <IconButton>
                <LockOutlinedIcon />
              </IconButton>
              <IconButton>
                <VisibilityIcon />
              </IconButton>
              <IconButton>
                <VisibilityOffIcon />
              </IconButton>
              <IconButton>
                <GoogleIcon />
              </IconButton>
            </CardContent>
          </Card>
        </Paper>
      </Box>
    </>
  );
};

export default LoadingPage;
