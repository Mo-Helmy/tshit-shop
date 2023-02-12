import {
  Autocomplete,
  Box,
  Button,
  colors,
  Divider,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../util/axiosInstance';
import { apiUrl } from '../../util/link-config';
import ColorsButtonGroup from '../products/ProductDetails/ColorsButtonGroup';

const colorsArr = ['black', 'blue', 'gray', 'red', 'green', 'white'];
const typesArr = ['tshirt', 'hoodie', 'tablue'];

const ShopFilter = ({ onSearch, onClose }) => {
  const [sort, setSort] = useState('recent');
  const [selectedColors, setSelectedColors] = useState([]);
  console.log(
    '🚀 ~ file: ShopFilter.js:26 ~ ShopFilter ~ selectedColors',
    selectedColors
  );
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState(['tshirt']);

  useEffect(() => {
    axiosInstance
      .get('/api/media/design/tags')
      .then((res) => setAllTags(res.data));
  }, []);

  const resetHandler = () => {
    setSort('recent');
    setSelectedColors([]);
    setSelectedTags([]);
    setSelectedTypes(['tshirt']);
  };

  const searchHandler = () => {
    const searchQuery = {
      sort,
      colors: selectedColors.length > 0 ? selectedColors : null,
      tags: selectedTags.length > 0 ? selectedTags : null,
      types: selectedTypes.length > 0 ? selectedTypes : null,
    };

    onSearch(searchQuery);

    onClose && onClose();
  };

  return (
    <Stack spacing={2} pt={4}>
      <TextField
        select
        label="Sort By:"
        size="small"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <MenuItem value="recent">Recent</MenuItem>
        <MenuItem value="oldest">Oldest</MenuItem>
      </TextField>
      <Divider />
      <Stack spacing={1}>
        <Typography lineHeight={1}>Colors:</Typography>
        <ColorsButtonGroup
          allColors={colorsArr}
          selectedColor={selectedColors}
          changeSelectedColorHandler={(e, n) => setSelectedColors(n)}
          exclusive={false}
        />
        {/* <ToggleButtonGroup
          variant="outlined"
          onChange={(e, n) => setSelectedColors(n)}
          value={selectedColors}
          sx={{ display: 'flex', flexWrap: 'wrap' }}
        >
          {colorsArr.map((color) => (
            <ToggleButton value={color} key={color}>
              <Box
                width={30}
                height={30}
                bgcolor={
                  color === 'black'
                    ? 'black'
                    : color === 'blue'
                    ? colors.blue[800]
                    : color === 'gray'
                    ? colors.grey[700]
                    : color === 'red'
                    ? colors.red[500]
                    : color === 'green'
                    ? colors.lightGreen[900]
                    : color === 'white'
                    ? 'white'
                    : ''
                }
              ></Box>
            </ToggleButton>
          ))}
        </ToggleButtonGroup> */}
      </Stack>

      <Divider />

      <Autocomplete
        options={allTags}
        value={selectedTags}
        onChange={(e, n) => setSelectedTags(n)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tags"
            sx={{ minWidth: 100, maxWidth: '100%' }}
          />
        )}
        multiple
      />

      <Divider />

      <TextField
        select
        label="Types:"
        value={selectedTypes}
        onChange={(e) => setSelectedTypes(e.target.value)}
        SelectProps={{ multiple: true }}
      >
        {typesArr.map((type) => (
          <MenuItem value={type} key={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>

      <Divider />

      <Stack direction="row" justifyContent="space-between">
        <Button variant="outlined" onClick={resetHandler}>
          Reset
        </Button>
        <Button variant="outlined" onClick={searchHandler}>
          Search
        </Button>
      </Stack>
    </Stack>
  );
};

export default ShopFilter;
