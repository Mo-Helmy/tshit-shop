import {
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import ProductDetails from './ProductDetails';

import ProductItem from './ProductItem';

const ProductList = ({ products, colorsFilter }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const SelectedProductHandler = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };
  return (
    <>
      <Stack
        direction="row"
        // overflow={{ xs: 'auto', sm: 'hidden' }}
        gap={2}
        py={2}
        flexWrap="wrap"
        // flexWrap={{ sm: 'wrap' }}
        alignItems="center"
        justifyContent="center"
        // justifyContent={{ sm: 'center' }}
      >
        {products &&
          products.map((product) => (
            <ProductItem
              key={product._id}
              product={product}
              colorsFilter={colorsFilter}
              onSelectProduct={SelectedProductHandler}
            />
          ))}
      </Stack>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        // sx={{ width: { xs: 400, md: 800 } }}
        // sx={{ width: 'fit-content', maxWidth: 'fit-content' }}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogActions>
          <IconButton
            size="large"
            color="info"
            onClick={() => {
              setOpenDialog(false);
              // setSelectedProduct(null);
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent>
          <ProductDetails product={selectedProduct} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductList;
