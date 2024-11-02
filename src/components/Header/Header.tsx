import { AppBar, Box, Toolbar } from '@mui/material';

import SearchBar from './Search/SearchBar';
import TunerIcon from './Tuner/TunerIcon';

interface HeaderProps {
  height: string;
  onSearchChange: (coords: google.maps.GeocoderGeometry | null) => void;
}

function Header({ height, onSearchChange }: HeaderProps) {
  return (
    <Box height={height} sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <SearchBar onSearchChange={onSearchChange} />
          <TunerIcon />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
