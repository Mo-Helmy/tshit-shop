import ProductList from '../components/products/ProductList';
import { favoriteActions } from '../store/favoriteSlice';
import axiosInstance, { axiosApi } from '../util/axiosInstance';
import { apiUrl } from '../util/link-config';

export default function Home({ products, user, jwt }) {
  return (
    <>
      <ProductList products={products} />
    </>
  );
}

export const getStaticProps = async ({ req }) => {
  // try {
  //   const response = await fetch(apiUrl + '/api/products');
  //   console.log('🚀 ~ file: index.js:22 ~ getStaticProps ~ response', response);
  //   if (!response.ok) {
  //     return {
  //       props: { products: [] },
  //     };
  //   }
  //   const data = await response.json();

  //   return {
  //     props: { products: data.products },
  //   };
  // } catch (error) {
  //   console.log('🚀 ~ file: index.js:31 ~ getStaticProps ~ error', error);
  //   return {
  //     props: { products: [] },
  //   };
  // }

  try {
    const response = await axiosApi.get('/api/products');
    return {
      props: { products: response.data.products },
    };
  } catch (error) {
    console.log('🚀 ~ file: index.js:31 ~ getStaticProps ~ error', error);
    return {
      props: { products: [] },
    };
  }
};
