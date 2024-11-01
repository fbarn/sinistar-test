import * as React from 'react';

import { Box, IconButton } from '@mui/material'
import { Tune } from '@mui/icons-material';
import Drawer from './Drawer';


function TunerIcon() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <div>
      <Box sx={{ ml: 4 }}>
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
      <Drawer open={open} toggleDrawer={toggleDrawer} />
    </div >
  );
}

export default TunerIcon;
