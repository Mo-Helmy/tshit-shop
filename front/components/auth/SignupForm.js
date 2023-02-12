import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import Link from 'next/link';
import React, { useState } from 'react';
import axiosInstance from '../../util/axiosInstance';
import { clientUrl } from '../../util/link-config';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { snackbarActions } from '../../store/snackbarSlice';

const SignupForm = () => {
  const [firstName, setFirstName] = useState({ clicked: false, value: '' });
  const [lastName, setLastName] = useState({ clicked: false, value: '' });
  const [username, setUsername] = useState({ clicked: false, value: '' });
  const [email, setEmail] = useState({ clicked: false, value: '' });
  const [password, setPassword] = useState({ clicked: false, value: '' });
  const [confirmPassword, setConfirmPassword] = useState({
    clicked: false,
    value: '',
  });

  const [isPassVisible, setIsPassVisible] = useState(false);
  const [isConfirmPassVisible, setIsConfirmPassVisible] = useState(false);

  const [isSending, setIsSending] = useState(false);

  const [isUsernameExist, setIsUsernameExist] = useState(false);
  const [isEmailExist, setIsEmailExist] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const nameRegex = /^[a-zA-Z0-9\s]{1,}$/g;
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,10})+$/g;
  const usernameRegex = /^[A-Za-z0-9][A-Za-z0-9.@_-]{3,30}$/g;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)^[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,}$/g;

  const isFirstNameVaild =
    !firstName.clicked || firstName.value.match(nameRegex);
  const isLastNameVaild = !lastName.clicked || lastName.value.match(nameRegex);
  const isUsernameVaild =
    !username.clicked || username.value.match(usernameRegex);
  const isEmailVaild = !email.clicked || email.value.match(emailRegex);
  const isPasswordVaild =
    !password.clicked || password.value.trim().match(passwordRegex);
  const isConfirmPasswordVaild =
    !confirmPassword.clicked ||
    confirmPassword.value.trim() === password.value.trim();

  const isFormInvalid =
    !(
      isFirstNameVaild &&
      isLastNameVaild &&
      isEmailVaild &&
      isUsernameVaild &&
      isPasswordVaild &&
      isConfirmPasswordVaild
    ) ||
    !(
      firstName.clicked &&
      lastName.clicked &&
      username.clicked &&
      email.clicked &&
      password.clicked &&
      confirmPassword.clicked
    );

  const submitHandler = () => {
    setFirstName((prev) => ({ ...prev, clicked: true }));
    setLastName((prev) => ({ ...prev, clicked: true }));
    setUsername((prev) => ({ ...prev, clicked: true }));
    setEmail((prev) => ({ ...prev, clicked: true }));
    setPassword((prev) => ({ ...prev, clicked: true }));
    setConfirmPassword((prev) => ({ ...prev, clicked: true }));

    if (isFormInvalid) return;

    const user = {
      firstname: firstName.value.trim(),
      lastname: lastName.value.trim(),
      username: username.value.trim(),
      email: email.value.trim(),
      password: password.value.trim(),
    };
    setIsSending(true);
    axiosInstance
      .post(clientUrl + '/api/auth/signup', user)
      .then((res) => {
        if (res.data.message === 'user created') setOpenDialog(true);
        dispatch(
          snackbarActions.openSnackbar({
            severity: 'success',
            message: 'signed up successfully',
          })
        );
      })
      .catch((res) => {
        console.log(
          '🚀 ~ file: SignupForm.js:118 ~ catch ~ submitHandler ~ res',
          res.data.error
        );
        res.data.error.keyPattern.email === 1
          ? setIsEmailExist(true)
          : setIsEmailExist(false);

        res.data.error.keyPattern.username === 1
          ? setIsUsernameExist(true)
          : setIsUsernameExist(false);
      })
      .finally(() => setIsSending(false));
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
        >
          <Avatar sx={{ mb: -2 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h6" gutterBottom>
            Signup
          </Typography>
          <Stack direction="row" gap={2}>
            <TextField
              label="First Name"
              variant="standard"
              type="text"
              required
              fullWidth
              value={firstName.value}
              onChange={(e) =>
                setFirstName((prev) => ({
                  ...prev,
                  value: e.target.value,
                }))
              }
              onBlur={(e) =>
                setFirstName((prev) => ({
                  value: e.target.value.trim(),
                  clicked: true,
                }))
              }
              error={!isFirstNameVaild}
              helperText={
                !isFirstNameVaild &&
                'name should be at least 2 english characters only'
              }
            />
            <TextField
              label="Last Name"
              variant="standard"
              type="text"
              required
              fullWidth
              value={lastName.value}
              onChange={(e) =>
                setLastName((prev) => ({
                  ...prev,
                  value: e.target.value,
                }))
              }
              onBlur={(e) =>
                setLastName((prev) => ({
                  value: e.target.value.trim(),
                  clicked: true,
                }))
              }
              error={!isLastNameVaild}
              helperText={
                !isLastNameVaild &&
                'name should be at least 2 english characters only'
              }
            />
          </Stack>

          <TextField
            label="Username"
            variant="standard"
            type="text"
            fullWidth
            required
            value={username.value}
            onChange={(e) =>
              setUsername((prev) => ({ ...prev, value: e.target.value }))
            }
            onBlur={(e) =>
              setUsername((prev) => ({
                value: e.target.value.trim(),
                clicked: true,
              }))
            }
            error={!isUsernameVaild || isUsernameExist}
            helperText={
              !isUsernameVaild
                ? 'USERNAME should start with letter or digit,could contain @-_. and (3-30) length in english'
                : isUsernameExist &&
                  'username already exist change it and submit agin.'
            }
          />

          <TextField
            label="E-mail"
            variant="standard"
            type="text"
            fullWidth
            required
            value={email.value}
            onChange={(e) =>
              setEmail((prev) => ({ ...prev, value: e.target.value }))
            }
            onBlur={(e) =>
              setEmail((prev) => ({
                value: e.target.value.trim(),
                clicked: true,
              }))
            }
            error={!isEmailVaild || isEmailExist}
            helperText={
              !isEmailVaild
                ? 'please enter a valid e-mail Ex. example@gmail.com'
                : isEmailExist &&
                  'Email already exist change it and submit agin.'
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
              setPassword((prev) => ({
                value: e.target.value.trim(),
                clicked: true,
              }))
            }
            error={!isPasswordVaild}
            helperText={
              !isPasswordVaild &&
              'password should be minimum 8 characters, at least one letter and one number'
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

          <TextField
            label="Confirm Password"
            variant="standard"
            type={isConfirmPassVisible ? 'text' : 'password'}
            fullWidth
            required
            value={confirmPassword.value}
            onChange={(e) =>
              setConfirmPassword((prev) => ({
                ...prev,
                value: e.target.value,
              }))
            }
            onBlur={(e) =>
              setConfirmPassword((prev) => ({
                value: e.target.value.trim(),
                clicked: true,
              }))
            }
            error={!isConfirmPasswordVaild}
            helperText={!isConfirmPasswordVaild && "passwords did'nt match"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {isConfirmPassVisible ? (
                    <IconButton onClick={() => setIsConfirmPassVisible(false)}>
                      <VisibilityOffIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => setIsConfirmPassVisible(true)}>
                      <VisibilityIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />

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
            <Link href="/auth/login">Do you have an account? Login</Link>
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
          >
            Sign in with google account
          </Button>
        </Paper>
        <Dialog
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            router.push('/auth/login');
          }}
        >
          <DialogContent>
            <DialogContentText>
              You succeffully signed, a verification link will be sent to your
              email in minutes to verify your account
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={() => {
                setOpenDialog(false);
                router.push('/auth/login');
              }}
              color="success"
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </CssBaseline>
    </Container>
  );
};

export default SignupForm;
