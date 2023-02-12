import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import SignupForm from '../../components/auth/SignupForm';
import Loading from '../../components/UI/Loading';
import { authOptions } from '../api/auth/[...nextauth]';

const SignupPage = () => {
  return <SignupForm />;
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

export default SignupPage;
