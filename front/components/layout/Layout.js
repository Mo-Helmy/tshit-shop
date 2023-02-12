import { Alert, Box, Container, Snackbar } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { snackbarActions } from '../../store/snackbarSlice';
import Navigation from './Navigation';

const Layout = (props) => {
  const [showSearchField, setShowSearchField] = useState(false);
  const snackbarState = useSelector((state) => state.snackbar);
  const dispatch = useDispatch();

  const showSearchFieldHandler = () => {
    setShowSearchField(true);
  };
  const closeSearchFieldHandler = () => {
    setShowSearchField(false);
  };

  return (
    <Box
      width="100vw"
      minHeight="100vh"
      bgcolor="background.default"
      color="text.primary"
    >
      <Navigation
        onshowSearchField={showSearchFieldHandler}
        onCloseSearchField={closeSearchFieldHandler}
        showSearchField={showSearchField}
      />
      <Container onClick={closeSearchFieldHandler} sx={{ minHeight: '100vh' }}>
        {props.children}

        <Snackbar
          open={snackbarState.isOpen}
          autoHideDuration={3000}
          onClose={() => dispatch(snackbarActions.closeSnackbar())}
        >
          <Alert
            severity={snackbarState.severity}
            onClose={() => dispatch(snackbarActions.closeSnackbar())}
            variant="filled"
          >
            {snackbarState.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Layout;
