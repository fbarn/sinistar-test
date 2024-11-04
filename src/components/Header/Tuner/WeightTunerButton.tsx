import { useState } from "react";

import { Box, IconButton } from "@mui/material";
import { Tune } from "@mui/icons-material";
import WeightTuner from "./WeightTuner";

import { WeightContext } from "shared/lib/types";

interface WeightTunerButtonProps {
  weightContext: WeightContext;
}

function WeightTunerButton({ weightContext }: WeightTunerButtonProps) {
  const [open, setOpen] = useState(false);

  const toggleWeightTuner = (newOpen: boolean) => () => {
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
          onClick={toggleWeightTuner(true)}
        >
          <Tune />
        </IconButton>
      </Box>
      <WeightTuner
        open={open}
        toggleWeightTuner={toggleWeightTuner}
        weightContext={weightContext}
      />
    </div>
  );
}

export default WeightTunerButton;
