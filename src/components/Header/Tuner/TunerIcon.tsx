import { useState } from "react";

import { Box, IconButton } from "@mui/material";
import { Tune } from "@mui/icons-material";
import Drawer from "./Drawer";

import { WeightContext } from "shared/lib/types";

interface TunerProps {
  weightContext: WeightContext;
}

function TunerIcon({ weightContext }: TunerProps) {
  const [open, setOpen] = useState(false);

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
      <Drawer
        open={open}
        toggleDrawer={toggleDrawer}
        weightContext={weightContext}
      />
    </div>
  );
}

export default TunerIcon;
