import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { getServerSession } from 'next-auth';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ProductList from '../../components/products/ProductList';
import Loading from '../../components/UI/Loading';
import axiosInstance from '../../util/axiosInstance';
import { authOptions } from '../api/auth/[...nextauth]';

const FavoritePage = () => {
  const favoriteState = useSelector((state) => state.favorite);
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log(
    '🚀 ~ file: favorite.js:9 ~ FavoritePage ~ favoriteState',
    favoriteState
  );
  console.log(
    '🚀 ~ file: favorite.js:12 ~ FavoritePage ~ productList',
    productList
  );

  useEffect(() => {
    if (!favoriteState.isInitial) {
      setIsLoading(true);
      axiosInstance
        .post('/api/products/all', {
          favorite: favoriteState.value,
        })
        .then((res) => {
          setProductList(res.data.productList);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [favoriteState.value]);

  if (favoriteState.isInitial || isLoading) {
    return <Loading />;
  }

  return (
    <Stack spacing={2} alignItems="center" mt={4}>
      <Typography variant="h5" gutterBottom>
        Favorite Ptoducts
      </Typography>

      {productList.length === 0 ? (
        <Typography>Your favorite list is empety!</Typography>
      ) : (
        <ProductList products={productList} />
      )}
    </Stack>
  );
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

  return {
    props: { session },
  };
};

export default FavoritePage;
