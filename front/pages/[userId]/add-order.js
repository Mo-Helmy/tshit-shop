import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import AddOrderProcess from '../../components/orders/addOrder/AddOrderProcess';
import { axiosApi } from '../../util/axiosInstance';
import { authOptions } from '../api/auth/[...nextauth]';

const AddOrderPage = ({ session, userAddresses }) => {
  return <AddOrderProcess session={session} userAddresses={userAddresses} />;
};

export const getServerSideProps = async ({ req, res, query }) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session)
    return {
      redirect: {
        destination: '/auth/login',
        permenant: false,
      },
    };

  const isAutherized = session?.id === query.userId;

  if (!isAutherized)
    return {
      redirect: {
        destination: '/',
        permenant: false,
      },
    };
  console.log('====================ADD ORDER=========================');
  try {
    const token = await getToken({ req, raw: true });

    const response = await axiosApi.get(`/api/users/${query.userId}/data`, {
      headers: { Authorization: token },
    });

    return {
      props: { session, userAddresses: response.data.userData.addresses || [] },
    };
  } catch (error) {
    return {
      props: { session, userAddresses: [] },
    };
  }
};

export default AddOrderPage;
