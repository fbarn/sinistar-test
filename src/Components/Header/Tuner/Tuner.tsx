import * as React from 'react';
import { Box, Button, Divider, Drawer, Grid2, IconButton, Toolbar, Typography } from '@mui/material'
import { CalendarMonth, ChevronRight, HourglassTop, Reviews, Straighten, Tune } from '@mui/icons-material';
import TunerSlider from './Slider';



interface MyDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const MyDrawer: React.FC<MyDrawerProps> = ({ open, onClose, children }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: '100%', md: '50%', lg: '33%' },
        },
      }}
      PaperProps={{
        sx: {
          height: 'auto',          // Set height to auto to fit content
          maxHeight: '100vh',       // Limit height to viewport height
          overflow: 'auto',         // Enable scrolling if content is tall
        },
      }}
    >
      <div>
        {children}
      </div>
    </Drawer>
  );
};

function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <div>
      <Box sx={{ ml: 1 }}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer(true)}
        >
          <Tune />
        </IconButton>
      </Box>
      <MyDrawer open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ flexGrow: 1, width: '100%' }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography
              variant="h6"
            >
              Adjust Criteria Weights
            </Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <ChevronRight />
            </IconButton>
          </Toolbar>
        </Box>
        <Divider />
        <Box sx={{ mx: 3, my: 3 }}>
          <TunerSlider color='#4D243D' content='Distance from Current Home' ><Straighten /></TunerSlider>
          <TunerSlider color='#EB8258' content='Response Rate' > <HourglassTop /></TunerSlider>
          <TunerSlider color='#6689A1' content='Review Score' > <Reviews /></TunerSlider>
          <TunerSlider color='#5C573E' content='Extension Flexibility' > <CalendarMonth /></TunerSlider>
          <Grid2 container spacing={2}>
            <Grid2>
              <Button sx={{ maxWidth: '55px', minWidth: '55px' }} variant="contained">Save</Button>
            </Grid2>
            <Grid2>
              <Button variant="outlined" sx={{ color: "black", borderColor: "black", maxWidth: '55px', minWidth: '55px' }}>Reset</Button>
            </Grid2>
          </Grid2>
        </Box>
      </MyDrawer>
    </div >
  );
}

export default TemporaryDrawer;
