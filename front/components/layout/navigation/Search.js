import {
  Autocomplete,
  Avatar,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { apiUrl } from '../../../util/link-config';

const Search = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const openSearchMenu = Boolean(anchorEl);

  const searchRef = useRef();
  //   console.log('🚀 ~ file: Search.js:8 ~ Search ~ searchValue', searchValue);
  //   console.log('🚀 ~ file: Search.js:11 ~ Search ~ searchResult', searchResult);

  //   useEffect(() => {
  //     fetch(apiUrl + '/api/products/data')
  //       .then((res) => res.json())
  //       .then((data) => setSearchOptions(data.allTitles.concat(data.allTags)));
  //   }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('🚀 ~ file: Search.js:8 ~ Search ~ searchValue', searchValue);
      if (searchValue) {
        fetch(`${apiUrl}/api/products?search=${searchValue}`)
          .then((res) => res.json())
          .then((data) => {
            setSearchResult(data.products || []);
            setAnchorEl(searchRef.current);
          });
      }
    }, 500);

    return () => {
      console.log('===CLEAR===');
      clearTimeout(timer);
    };
  }, [searchValue]);

  return (
    <>
      {/* <Autocomplete
        options={searchOptions.map((option, index) => ({
          id: index + 1,
          label: option,
        }))}
        value={searchValue}
        onChange={(e, n) => setSearchValue(n)}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search"
            type="text"
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ minWidth: 200 }}
            // InputProps={{
            //   endAdornment: (
            //     <InputAdornment position="end">
            //       <SearchIcon />
            //     </InputAdornment>
            //   ),
            // }}
            // onChange={(e) => setSearchValue(e.target.value)}
          />
        )}
      /> */}
      <TextField
        ref={searchRef}
        label="Search"
        type="text"
        variant="outlined"
        color="secondary"
        size="small"
        sx={{ minWidth: 100 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyUp={(e) => e.key === 'Enter' && setAnchorEl(e.currentTarget)}
      />
      <Menu
        anchorEl={anchorEl}
        open={openSearchMenu}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        // PaperProps={{ elevation: 2 }}
      >
        {searchResult.length === 0 ? (
          <Typography px={3} py={1}>
            No Products Found!
          </Typography>
        ) : (
          searchResult.map((item) => (
            <Link
              href={`/shop/${item._id}`}
              key={item._id}
              onClick={() => setAnchorEl(null)}
            >
              <MenuItem>
                <Avatar
                  src={item.imagesUrl[0]}
                  alt={item.title}
                  sx={{ width: 75, height: 75 }}
                />
                <Typography>{item.title}</Typography>
              </MenuItem>
            </Link>
          ))
        )}
      </Menu>
    </>
  );
};

export default Search;
