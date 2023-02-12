import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import React from 'react';
import AddDesignForm from '../../components/add-design/AddDesignForm';
import { authOptions } from '../api/auth/[...nextauth]';

const AddDesignPage = ({ session, token }) => {
  return <AddDesignForm session={session} token={token} />;
};

export default AddDesignPage;

export const getServerSideProps = async ({ req, res, query }) => {
  const token = await getToken({ req, raw: true });

  const session = await getServerSession(req, res, authOptions);

  if (!session)
    return {
      redirect: {
        destination: '/auth/login',
        permenant: false,
      },
    };

  const isAutherized = session?.id === query.userId;
  const isAdminOrDesigner =
    session?.role === 'admin' || session?.role === 'designer';

  if (!(isAutherized && isAdminOrDesigner))
    return {
      redirect: {
        destination: '/',
        permenant: false,
      },
    };

  return {
    props: { session, token },
  };
};
