import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
  useMediaQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ShopFilter from '../../components/shop/ShopFilter';
import ShopProductList from '../../components/shop/ShopProductList';
import axiosInstance, { axiosApi } from '../../util/axiosInstance';

const ShopPageIndex = ({ products, nextProducts, productCount }) => {
  const [productList, setProductList] = useState([]);
  const [nextProductList, setNextProductList] = useState([]);
  const router = useRouter();

  const isSmallMedia = useMediaQuery('(max-width:895px)');
  const [isExpanded, setIsExpanded] = useState(false);

  const [colorsFilter, setColorsFilter] = useState([]);

  useEffect(() => {
    setProductList(products);
    setNextProductList(nextProducts);
  }, [products, nextProducts]);

  const showmoreHandler = () => {
    if (router.query.showmore) {
      let searchQueryString = `?showmore=${+router.query.showmore + 1}`;
      Object.keys(router.query).map(
        (key) =>
          key !== 'showmore' &&
          (searchQueryString += `&${key}=${router.query[key]}`)
      );
      router.push(`/shop${searchQueryString}`, `/shop${searchQueryString}`, {
        scroll: false,
      });
    } else {
      router.push(`/shop?showmore=2`, `/shop?showmore=2`, { scroll: false });
    }

    setProductList(nextProductList);
  };

  const searchHandler = (searchQuery) => {
    if (searchQuery.colors) {
      setColorsFilter(searchQuery.colors);
    }

    let searchQueryString = `?showmore=1`;
    Object.keys(searchQuery).map(
      (key) =>
        searchQuery[key] && (searchQueryString += `&${key}=${searchQuery[key]}`)
    );
    router.push(`/shop${searchQueryString}`);
  };

  return (
    <Grid container spacing={2} mt={2}>
      <Grid item md={3}>
        {isSmallMedia ? (
          <Accordion
            expanded={isExpanded}
            onChange={(e, expanded) => setIsExpanded(expanded)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">Fillter By:</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ShopFilter
                onSearch={searchHandler}
                onClose={() => setIsExpanded(false)}
              />
            </AccordionDetails>
          </Accordion>
        ) : (
          <ShopFilter onSearch={searchHandler} />
        )}
      </Grid>

      <Grid item md={9}>
        <ShopProductList
          productList={productList}
          productCount={productCount}
          onShowMore={showmoreHandler}
          colorsFilter={colorsFilter}
        />
      </Grid>
    </Grid>
  );
};

export default ShopPageIndex;

export async function getServerSideProps({ query }) {
  try {
    if (query.showmore) {
      console.log(
        '================= query.showMore is definied ==============='
      );
      let searchQueryString = '?';
      Object.keys(query).map(
        (key, index) =>
          (searchQueryString +=
            index === 0 ? `${key}=${query[key]}` : `&${key}=${query[key]}`)
      );

      const response = await axiosApi.get(`/api/products${searchQueryString}`);
      const data = await response.data;

      return {
        props: {
          products: data.products,
          nextProducts: data.nextProducts,
          productCount: data.productCount,
        },
      };
    }

    const response = await axiosApi.get(`/api/products?showmore=1`);
    const data = await response.data;

    return {
      props: {
        products: data.products,
        nextProducts: data.nextProducts,
        productCount: data.productCount,
      },
    };
  } catch (error) {
    console.log('🚀 ~ file: index.js:136 ~ getServerSideProps ~ error', error);
    return {
      props: {
        products: [],
        nextProducts: [],
        productCount: 0,
      },
    };
  }
}
