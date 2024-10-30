import { AppBar, Box, Toolbar } from '@mui/material';
import SearchBar from './Search/Search';
import Tuner from './Tuner/Tuner';

interface HeaderProps {
  height: string;
}

function Header({ height }: HeaderProps) {
  return (
    <Box height={height} sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <SearchBar />

          <Tuner />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
