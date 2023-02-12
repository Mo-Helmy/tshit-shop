import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import React from 'react';
import AddDesignAndProductProcess from '../../components/add-product/AddDesignAndProductProcess';
import { axiosApi } from '../../util/axiosInstance';
import { authOptions } from '../api/auth/[...nextauth]';

const AddProductPage = ({ session, token, designsList }) => {
  return (
    <AddDesignAndProductProcess
      session={session}
      token={token}
      designsList={designsList}
    />
  );
};

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
  try {
    const response = await axiosApi.get(`/api/media/design/${query.userId}`, {
      headers: { Authorization: token },
    });

    return {
      props: { session, token, designsList: response.data },
    };
  } catch (error) {
    return {
      props: { session, token, designsList: [] },
    };
  }
};

export default AddProductPage;
