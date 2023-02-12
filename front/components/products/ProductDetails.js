import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  colors,
  Divider,
  Grow,
  IconButton,
  ImageList,
  ImageListItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { favoriteActions } from '../../store/favoriteSlice';
import { snackbarActions } from '../../store/snackbarSlice';
import { cartActions } from '../../store/cartSlice';
import ColorsButtonGroup from './ProductDetails/ColorsButtonGroup';
import { apiUrl } from '../../util/link-config';
import ProductTags from './ProductDetails/ProductTags';
import DesignedBy from './ProductDetails/DesignedBy';

const ProductDetails = ({ product }) => {
  const theme = useTheme();
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState({
    color: false,
    size: false,
    quantity: false,
  });

  console.log(
    '🚀 ~ file: ProductDetails.js:32 ~ ProductDetails ~ product',
    product
  );

  const favorite = useSelector((state) => state.favorite.value);
  console.log(
    '🚀 ~ file: ProductItem.js:31 ~ ProductItem ~ favorite',
    favorite
  );
  const dispatch = useDispatch();

  const toggleFavoriteHandler = async () => {
    const userDataRes = await fetch('/api/get-token');
    const userData = await userDataRes.json();

    if (!userData.user) {
      dispatch(
        snackbarActions.openSnackbar({
          severity: 'info',
          message: 'Please login to add items to favorite',
        })
      );
      return;
    }

    if (favorite.includes(product._id)) {
      dispatch(favoriteActions.removeFormFavorite(product._id));
    } else {
      dispatch(favoriteActions.addToFavorite(product._id));
    }
  };

  const slideRightHandler = () => {
    setMainImageIndex((prevIndex) =>
      prevIndex === product.imagesUrl.length - 1 ? 0 : prevIndex + 1
    );
  };

  const slideLeftHandler = () => {
    setMainImageIndex((prevIndex) =>
      prevIndex === 0 ? product.imagesUrl.length - 1 : prevIndex - 1
    );
  };

  const changeSelectedColorHandler = (e, newValue) => {
    setSelectedColor(newValue);

    const selectedColorIndex = newValue
      ? product.colors.findIndex((c) => c === newValue)
      : 0;

    setMainImageIndex(selectedColorIndex);

    setError((prev) => ({ ...prev, color: false }));
  };

  const changeSizeHandler = (e, newValue) => {
    setSelectedSize(newValue);
    setError((prev) => ({ ...prev, size: false }));
  };

  const addToCartHandler = async () => {
    if (!selectedColor)
      return setError((prev) => ({ ...prev, color: 'Please select color' }));
    if (!selectedSize)
      return setError((prev) => ({ ...prev, size: 'Please select size' }));
    if (quantity < 1)
      return setError((prev) => ({
        ...prev,
        quantity: 'Please select valid quantity',
      }));

    const userDataRes = await fetch('/api/get-token');
    const userData = await userDataRes.json();

    if (!userData.user) {
      dispatch(
        snackbarActions.openSnackbar({
          severity: 'info',
          message: 'Please login to add items to cart',
        })
      );
      return;
    }

    const cartData = {
      id: product._id,
      title: product.title,
      price: product.discount || product.price,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      itemToltalPrice: (product.discount || product.price) * quantity,
      colorUrl: product.imagesUrl[mainImageIndex],
    };

    dispatch(cartActions.addToCart(cartData));
  };

  return (
    <Stack
      direction="column"
      // divider={<Divider />}
      gap={2}
      width={{ xs: 300, md: 700 }}
      mx="auto"
      justifyContent="center"
    >
      <Stack
        pt={2}
        direction={{ xs: 'column', md: 'row' }}
        gap={4}
        width="fit-content"
        maxWidth="100%"
        mx="auto"
      >
        <Badge
          badgeContent={
            '- ' +
            Math.ceil(
              ((product?.price - product?.discount) / product?.price) * 100
            ) +
            '%'
          }
          color="error"
          variant="standard"
          invisible={!product?.discount}
        >
          <Stack
            // flexBasis={1}
            // flexGrow={1}
            flexBasis="50%"
            direction="column"
            maxWidth="100%"
            width="fit-content"
            sx={{
              border: `1px solid ${theme.palette.text.disabled}`,
              borderRadius: '10px',
            }}
          >
            <Box
              width="fit-content"
              position="relative"
              sx={{ width: { xs: 300, md: 400 }, height: { xs: 300, md: 400 } }}
            >
              <Grow in={true}>
                <Image
                  src={
                    product.imagesUrl &&
                    apiUrl + product.imagesUrl[mainImageIndex]
                  }
                  alt={`${product?.type} - ${product?.title} - ${product?.tags} - ${product?.colors}`}
                  // width={350}
                  // height={350}
                  // sizes
                  fill
                />
              </Grow>
              <IconButton
                sx={{
                  position: 'absolute',
                  right: '0.02rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: theme.palette.background.default,
                  opacity: 0.5,
                  color: 'inherit',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    opacity: 1,
                  },
                }}
                onClick={slideRightHandler}
              >
                <KeyboardArrowRightIcon />
              </IconButton>
              <IconButton
                sx={{
                  position: 'absolute',
                  left: '0.02rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: theme.palette.background.default,
                  opacity: 0.5,
                  color: 'inherit',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    opacity: 1,
                  },
                }}
                onClick={slideLeftHandler}
              >
                <KeyboardArrowLeftIcon />
              </IconButton>
              <IconButton
                sx={{
                  position: 'absolute',
                  left: '0.5rem',
                  bottom: '0.5rem',
                  // transform: 'translateY(-50%)',
                  backgroundColor: theme.palette.background.default,
                  opacity: 0.5,
                  color: 'inherit',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    opacity: 1,
                  },
                }}
                onClick={toggleFavoriteHandler}
              >
                {favorite.includes(product?._id) ? (
                  <FavoriteIcon />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            </Box>
            <Divider sx={{ borderColor: theme.palette.text.disabled }} />
            <Box width="fit-content">
              <ImageList cols={4} rowHeight={80} gap={1}>
                {product?.imagesUrl?.map((image, index) => (
                  <ImageListItem key={image}>
                    <IconButton
                      sx={{
                        width: '100%',
                        height: '100%',
                        '&:hover': { bgcolor: 'transparent' },
                      }}
                      onClick={() => setMainImageIndex(index)}
                    >
                      <Image
                        src={apiUrl + image}
                        width={60}
                        height={60}
                        alt={product?.title}
                      />
                    </IconButton>
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          </Stack>
        </Badge>
        <Stack
          // flexBasis={1}
          // flexGrow={1}
          direction="column"
          spacing={3}
          flexBasis="50%"
        >
          <Typography variant="h4">{product.title}</Typography>
          {/* price */}
          <Stack spacing={0} alignItems="flex-end">
            <Typography variant="h6" style={{ lineHeight: '1.5rem' }}>
              {product?.discount || product?.price}EGP
            </Typography>
            {product?.discount && (
              <Typography
                variant="overline"
                component="p"
                color="error"
                style={{
                  lineHeight: '1rem',
                  textDecoration: 'line-through',
                }}
              >
                Was:{product?.price}EGP
              </Typography>
            )}
          </Stack>
          {/* colors */}
          <Stack spacing={1}>
            <Typography lineHeight={1}>Colors:</Typography>
            {error.color && (
              <Typography color="error" variant="body2" lineHeight={1}>
                {error.color}
              </Typography>
            )}
            <ColorsButtonGroup
              allColors={product.colors}
              selectedColor={selectedColor}
              changeSelectedColorHandler={changeSelectedColorHandler}
              exclusive={true}
            />
          </Stack>
          {/* sizes */}
          <Stack spacing={1}>
            <Typography lineHeight={1}>Sizes:</Typography>
            {error.size && (
              <Typography color="error" variant="body2" lineHeight={1}>
                {error.size}
              </Typography>
            )}
            <ToggleButtonGroup
              value={selectedSize}
              onChange={changeSizeHandler}
              exclusive
            >
              <ToggleButton value="s">
                <Typography component="div" width="31px" height="24px">
                  S
                </Typography>
              </ToggleButton>
              <ToggleButton value="md">
                <Typography component="div" width="31px" height="24px">
                  md
                </Typography>
              </ToggleButton>
              <ToggleButton value="lg">
                <Typography component="div" width="31px" height="24px">
                  LG
                </Typography>
              </ToggleButton>
              <ToggleButton value="xl">
                <Typography component="div" width="31px" height="24px">
                  XL
                </Typography>
              </ToggleButton>
              <ToggleButton value="xxl">
                <Typography component="div" width="31px" height="24px">
                  XXL
                </Typography>
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          {/* add to cart */}
          {error.quantity && (
            <Typography color="error" variant="body2" lineHeight={1}>
              {error.quantity}
            </Typography>
          )}
          <ButtonGroup>
            <Button
              onClick={() => setQuantity((prev) => prev - 1)}
              disabled={quantity === 1}
            >
              -
            </Button>
            <Button onClick={addToCartHandler}>
              Add
              <Typography component="div" variant="body1" width={15}>
                {quantity}
              </Typography>
              to Cart
            </Button>
            <Button
              onClick={() => {
                setQuantity((prev) => prev + 1);
                quantity + 1 >= 1 &&
                  setError((prev) => ({ ...prev, quantity: false }));
              }}
            >
              +
            </Button>
          </ButtonGroup>
        </Stack>
      </Stack>
      <DesignedBy designer={product.designedBy} />
      <ProductTags tags={product?.tags} />
    </Stack>
  );
};

export default ProductDetails;
