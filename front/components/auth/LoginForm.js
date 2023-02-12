import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  FormHelperText,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

// import Avatar from '@mui/material/Avatar';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Container from '@mui/material/Container';
// import CssBaseline from '@mui/material/CssBaseline';
// import Divider from '@mui/material/Divider';
// import FormHelperText from '@mui/material/FormHelperText';
// import IconButton from '@mui/material/IconButton';
// import InputAdornment from '@mui/material/InputAdornment';
// import Paper from '@mui/material/Paper';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import Link from 'next/link';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { snackbarActions } from '../../store/snackbarSlice';
// import Image from 'next/image';

const LoginForm = () => {
  const [email, setEmail] = useState({ clicked: false, value: '' });
  const [password, setPassword] = useState({ clicked: false, value: '' });
  const [isPassVisible, setIsPassVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const dispatch = useDispatch();

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,10})+$/g;
  const usernameRegex = /^[A-Za-z0-9][A-Za-z0-9.@_-]{3,30}$/g;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)^[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,}$/g;

  const isEmailVaild =
    !email.clicked ||
    email.value.trim().match(emailRegex) ||
    email.value.trim().match(usernameRegex);

  const isPasswordVaild =
    !password.clicked || password.value.trim().length >= 8;

  const isFormInvalid =
    !(isEmailVaild && isPasswordVaild) || !(email.clicked && password.clicked);

  const submitHandler = () => {
    setEmail((prev) => ({ ...prev, clicked: true }));
    setPassword((prev) => ({ ...prev, clicked: true }));
    if (isFormInvalid) return;

    console.log({ email, password });

    (async () => {
      setIsSending(true);
      const response = await signIn('credentials', {
        email: email.value.trim(),
        password: password.value.trim(),
        redirect: false,
      });
      console.log('🚀 ~ file: LoginForm.js:47 ~ response', response);
      if (response.error) {
        setErrorMsg(response.error);
      } else {
        dispatch(
          snackbarActions.openSnackbar({
            severity: 'success',
            message: 'successfully loged in',
          })
        );
        router.back();
      }
      setIsSending(false);
    })();
  };

  return (
    <Container component="div" maxWidth="xs">
      <CssBaseline>
        <Paper
          elevation={5}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'center',
            padding: 4,
            mt: 8,
          }}
          component="div"
        >
          <Avatar sx={{ mb: -2 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h6" gutterBottom>
            Login
          </Typography>

          <TextField
            label="E-mail or Username"
            variant="standard"
            type="text"
            fullWidth
            required
            value={email.value}
            onChange={(e) =>
              setEmail((prev) => ({ ...prev, value: e.target.value }))
            }
            onBlur={(e) =>
              setEmail({ value: e.target.value.trim(), clicked: true })
            }
            error={!isEmailVaild || errorMsg.includes('email')}
            helperText={
              !isEmailVaild
                ? 'please enter a valid e-mail or username'
                : errorMsg.includes('email') && errorMsg
            }
          />

          <TextField
            label="Password"
            variant="standard"
            type={isPassVisible ? 'text' : 'password'}
            fullWidth
            required
            value={password.value}
            onChange={(e) =>
              setPassword((prev) => ({ ...prev, value: e.target.value }))
            }
            onBlur={(e) =>
              setPassword({ value: e.target.value.trim(), clicked: true })
            }
            error={!isPasswordVaild || errorMsg.includes('password')}
            helperText={
              !isPasswordVaild
                ? 'please enter a valid password more than or equal 8 characters'
                : errorMsg.includes('password') && errorMsg
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {isPassVisible ? (
                    <IconButton onClick={() => setIsPassVisible(false)}>
                      <VisibilityOffIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => setIsPassVisible(true)}>
                      <VisibilityIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />

          {errorMsg.includes('password') && (
            <Typography
              width="100%"
              color="primary.main"
              gutterBottom={false}
              align="right"
              lineHeight={0}
              my={-2}
            >
              <Button size="small">Forget Password ?</Button>
            </Typography>
          )}
          <FormHelperText error={Boolean(errorMsg)}>{errorMsg}</FormHelperText>
          <Button
            variant="contained"
            color="secondary"
            sx={{ px: 4, borderRadius: 9999 }}
            disabled={isSending}
            onClick={submitHandler}
          >
            {!isSending ? 'Submit' : 'Sending'}
          </Button>

          <Box
            width="fit-content"
            color="primary.main"
            mb={-3}
            fontSize={{ xs: '0.9rem' }}
          >
            <Link href="/auth/signup">Don't have an account? Sign Up</Link>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Button
            startIcon={
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <GoogleIcon />
              </Avatar>
            }
            fullWidth
            variant="outlined"
            color="primary"
            onClick={() => signIn('google')}
          >
            Sign in with google account
          </Button>
        </Paper>
      </CssBaseline>
    </Container>
  );
};

export default LoginForm;
