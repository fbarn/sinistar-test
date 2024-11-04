import { styled } from "@mui/material/styles";
import {
  AppBar,
  Box,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import { WeightContext } from "shared/lib/types";

import SearchBar from "./Search/SearchBar";
import TunerIcon from "./Tuner/TunerIcon";

const MenuItemWrapper = styled(MenuItem)(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  marginLeft: 5,
  height: 50,
}));

interface HeaderProps {
  height: string;
  weightContext: WeightContext;
  disabled: boolean;
  onSort: () => void;
  onSearchChange: (coords: google.maps.GeocoderGeometry | null) => void;
}

function Header({
  height,
  weightContext,
  disabled,
  onSort,
  onSearchChange,
}: HeaderProps) {
  return (
    <Box height={height} sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <SearchBar onSearchChange={onSearchChange} />

          <Tooltip title={disabled ? "Please enter an address" : ""}>
            <span>
              <MenuItemWrapper
                onClick={onSort}
                disabled={disabled}
                style={disabled ? { pointerEvents: "none" } : {}}
              >
                <Typography sx={{ textAlign: "center" }}>Sort</Typography>
              </MenuItemWrapper>
            </span>
          </Tooltip>

          <Box sx={{ flexGrow: 1 }} />
          <TunerIcon weightContext={weightContext} />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
