import { Button, Stack } from '@mui/material';
import React from 'react';
import ProductList from '../products/ProductList';

const ShopProductList = ({
  productList,
  productCount,
  onShowMore,
  colorsFilter,
}) => {
  return (
    <Stack gap={0} alignItems="center" my={2}>
      <ProductList products={productList} colorsFilter={colorsFilter} />
      <Button
        variant="contained"
        onClick={onShowMore}
        disabled={productCount === productList.length}
        fullWidth
      >
        Show More ({productCount - productList.length}) Items
      </Button>
    </Stack>
  );
};

export default ShopProductList;
