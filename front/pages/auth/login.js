import { Login } from '@mui/icons-material';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import Loading from '../../components/UI/Loading';
import { authOptions } from '../api/auth/[...nextauth]';

const AuthPage = () => {
  return <LoginForm />;
};

export const getServerSideProps = async ({ req, res, query }) => {
  const session = await getServerSession(req, res, authOptions);

  if (session)
    return {
      redirect: {
        destination: '/',
        permenant: false,
      },
    };

  return {
    props: { session },
  };
};

export default AuthPage;
