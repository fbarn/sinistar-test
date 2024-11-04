import { AppBar, Box, Toolbar } from "@mui/material";

import { WeightContext } from "shared/lib/types";

import SearchBar from "./Search/SearchBar";
import WeightTunerButton from "./Tuner/WeightTunerButton";

interface HeaderProps {
  height: string;
  weightContext: WeightContext;
  onSearchChange: (coords: google.maps.GeocoderGeometry | null) => void;
}

// Basic wrapper for the header contents, as well as the components that come from them.
// Contains the search bar, tuner button, and tuner. Passes the weights and searched location
// to the parent.
function Header({ height, weightContext, onSearchChange }: HeaderProps) {
  return (
    <Box height={height} sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <SearchBar onSearchChange={onSearchChange} />
          <Box sx={{ flexGrow: 1 }} />
          <WeightTunerButton weightContext={weightContext} />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
