import { Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { axiosApi } from '../../../util/axiosInstance';
import ShopProductList from '../../shop/ShopProductList';
import ProductList from '../ProductList';

const RelatedProducts = ({ type, tags, excludeId }) => {
  const [products, setProducts] = useState([]);
  const [nextProducts, setNextProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [showmore, setShowmore] = useState(1);

  useEffect(() => {
    axiosApi
      .get(`/api/products?showmore=${showmore}&type=${type}&tags=${tags}`)
      .then((res) => {
        setProducts(
          res.data.products.filter((prodcut) => prodcut._id !== excludeId)
        );
        setNextProducts(
          res.data.nextProducts.filter((prodcut) => prodcut._id !== excludeId)
        );
        setProductCount(res.data.productCount - 1);
      });
  }, []);

  const showmoreHandler = () => {
    setShowmore((prev) => prev + 1);
    setProducts(nextProducts);

    axiosApi
      .get(`/api/products?showmore=${showmore + 1}&type=${type}&tags=${tags}`)
      .then((res) => {
        setNextProducts(
          res.data.nextProducts.filter((prodcut) => prodcut._id !== excludeId)
        );
      });
  };
  return (
    <Stack>
      <Typography fontWeight="bold">Related Products:</Typography>
      <ShopProductList
        productList={products}
        productCount={productCount}
        onShowMore={showmoreHandler}
      />
    </Stack>
  );
};

export default RelatedProducts;
