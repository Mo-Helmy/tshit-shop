import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchIconMenu = ({ onshowSearchField }) => {
  return (
    <IconButton color="inherit" onClick={onshowSearchField}>
      <SearchIcon />
    </IconButton>
  );
};

export default SearchIconMenu;
