import { Box, colors, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React from 'react';

const ColorsButtonGroup = ({
  allColors,
  selectedColor,
  changeSelectedColorHandler,
  exclusive,
}) => {
  return (
    <ToggleButtonGroup
      variant="outlined"
      exclusive={exclusive}
      onChange={changeSelectedColorHandler}
      value={selectedColor}
      sx={{ display: 'flex', flexWrap: 'wrap' }}
    >
      {allColors?.map((color) => (
        <ToggleButton value={color} key={color}>
          <Box
            width={30}
            height={30}
            bgcolor={
              color === 'black'
                ? 'black'
                : color === 'blue'
                ? '#062730'
                : color === 'gray'
                ? '#aeadb1'
                : color === 'red'
                ? '#bd0d32'
                : color === 'green'
                ? '#545840'
                : color === 'white' && 'white'
            }
          />
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ColorsButtonGroup;
