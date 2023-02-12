import {
  Badge,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
  Stack,
  Typography,
} from '@mui/material';
// import {
//   FavoriteBorderIcon,
//   FavoriteIcon,
//   VisibilityIcon,
// } from '@mui/icons-material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { favoriteActions } from '../../store/favoriteSlice';
import { snackbarActions } from '../../store/snackbarSlice';
import { apiUrl } from '../../util/link-config';

const ProductItem = ({ product, colorsFilter, onSelectProduct }) => {
  const [mainImage, setMainImage] = useState(null);
  const [showImageList, setShowImageList] = useState(false);
  const router = useRouter();
  const favorite = useSelector((state) => state.favorite.value);

  const dispatch = useDispatch();

  let filteredMainImage = null;

  if (colorsFilter?.length > 0) {
    const filteredColorIndex = product?.colors.findIndex(
      (color) => color === colorsFilter[0]
    );

    filteredMainImage = product?.imagesUrl[filteredColorIndex];
  }

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

  return (
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
      <Card
        onMouseEnter={() => setShowImageList(true)}
        onMouseLeave={() => setShowImageList(false)}
        sx={{ width: 350 }}
      >
        <Link href={`/shop/${product._id}`}>
          <CardMedia
            component="img"
            width="90%"
            height={350}
            // height={150}
            image={
              apiUrl + (mainImage || filteredMainImage || product?.imagesUrl[0])
            }
            sx={{ p: 1 }}
          />
        </Link>
        <CardContent style={{ padding: '0 16px 16px' }}>
          <Typography
            fontWeight="bold"
            variant="h6"
            component="div"
            p={0}
            maxWidth="100%"
          >
            {product?.title.toUpperCase()}
          </Typography>
          <Stack spacing={0} alignItems="flex-end" pb={1}>
            <Typography variant="body1" style={{ lineHeight: '1rem' }}>
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
          <Collapse in={showImageList}>
            <ImageList
              cols={4}
              rowHeight={60}
              gap={10}
              sx={{ width: '100%', overflowX: 'auto' }}
            >
              {product?.imagesUrl.map((image) => (
                <ImageListItem key={image}>
                  <IconButton
                    sx={{ width: '100%', height: '100%' }}
                    onClick={() => setMainImage(image)}
                  >
                    <Image
                      src={apiUrl + image}
                      fill={true}
                      sizes={40}
                      alt={product?.title}
                    />
                  </IconButton>
                </ImageListItem>
              ))}
            </ImageList>
          </Collapse>
        </CardContent>
        <Divider />
        <CardActions>
          <Stack direction="row" justifyContent="space-between" width="100%">
            <IconButton
              sx={{ '&:hover': { color: '#3f50b5' } }}
              onClick={toggleFavoriteHandler}
            >
              {favorite.includes(product._id) ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <IconButton
              sx={{ '&:hover': { color: '#3f50b5' } }}
              onClick={() => onSelectProduct(product)}
            >
              <VisibilityIcon />
            </IconButton>
          </Stack>
        </CardActions>
      </Card>
    </Badge>
  );
};

export default ProductItem;
