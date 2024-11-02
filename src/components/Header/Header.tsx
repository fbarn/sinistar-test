import { AppBar, Box, Toolbar } from '@mui/material';

import { WeightContext } from 'shared/lib/types';

import SearchBar from './Search/SearchBar';
import TunerIcon from './Tuner/TunerIcon';

interface HeaderProps {
  height: string;
  onSearchChange: (coords: google.maps.GeocoderGeometry | null) => void;
  weightContext: WeightContext;
}

function Header({ height, onSearchChange, weightContext }: HeaderProps) {
  return (
    <Box height={height} sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <SearchBar onSearchChange={onSearchChange} />
          <TunerIcon weightContext={weightContext} />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
