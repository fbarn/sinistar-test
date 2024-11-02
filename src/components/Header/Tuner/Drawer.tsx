import * as React from 'react';

import { Box, Button, Divider, Drawer, Grid2, IconButton, Toolbar, Typography } from '@mui/material'
import { CalendarMonth, ChevronRight, HourglassTop, Reviews, Straighten } from '@mui/icons-material';

import Slider from './Slider';


interface TemporaryDrawerProps {
  open: boolean;
  toggleDrawer: (newOpen: boolean) => () => void;
}

interface DrawerWrapperProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const DrawerWrapper: React.FC<DrawerWrapperProps> = ({ open, onClose, children }) => {
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

function WrappedDrawer({ open, toggleDrawer }: TemporaryDrawerProps) {

  return (
    <DrawerWrapper open={open} onClose={toggleDrawer(false)}>
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
        <Slider content='Distance from Current Home' ><Straighten /></Slider>
        <Slider content='Response Rate' > <HourglassTop /></Slider>
        <Slider content='Review Score' > <Reviews /></Slider>
        <Slider content='Extension Flexibility' > <CalendarMonth /></Slider>
        <Box sx={{ mt: 3 }}>
          <Grid2 container spacing={2}>
            <Grid2>
              <Button sx={{ maxWidth: '55px', minWidth: '55px' }} variant="contained">Save</Button>
            </Grid2>
            <Grid2>
              <Button variant="outlined" sx={{ color: "black", borderColor: "black", maxWidth: '55px', minWidth: '55px' }}>Reset</Button>
            </Grid2>
          </Grid2>
        </Box>
      </Box>
    </DrawerWrapper >
  );
}

export default WrappedDrawer;
