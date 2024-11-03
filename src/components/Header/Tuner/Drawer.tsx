import * as React from 'react';

import { Box, Button, Divider, Drawer, Grid2, IconButton, Toolbar, Typography } from '@mui/material'
import { CalendarMonth, ChevronRight, HourglassTop, Reviews, Straighten } from '@mui/icons-material';

import Slider from './Slider';
import { WeightContext } from 'shared/lib/types';


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
          width: { xs: '100%', sm: '100%', md: '50%', xl: '33%' },
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

interface WrappedDrawerProps {
  open: boolean;
  toggleDrawer: (newOpen: boolean) => () => void;
  weightContext: WeightContext;
}

function WrappedDrawer({ open, toggleDrawer, weightContext }: WrappedDrawerProps) {

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
        <Slider content='Distance from Current Home' value={weightContext.distanceWeight} onWeightChange={weightContext.setDistanceWeight} ><Straighten /></Slider>
        <Slider content='Review Score' value={weightContext.reviewWeight} onWeightChange={weightContext.setReviewWeight} > <Reviews /></Slider>
        <Slider content='Response Rate' value={weightContext.responseWeight} onWeightChange={weightContext.setResponseWeight} > <HourglassTop /></Slider>
        <Slider content='Extension Flexibility' value={weightContext.flexibilityWeight} onWeightChange={weightContext.setFlexibilityWeight} > <CalendarMonth /></Slider>
      </Box>
    </DrawerWrapper >
  );
}

export default WrappedDrawer;
