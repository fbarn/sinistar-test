import { FC, ReactNode } from "react";

import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  CalendarMonth,
  ChevronRight,
  HourglassTop,
  Reviews,
  Straighten,
} from "@mui/icons-material";

import WeightSlider from "./WeightSlider";
import { WeightContext } from "shared/lib/types";

interface DrawerWithWeightTunerParamsProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

// The tuner menu is just an implementation of a MUI Drawer.
// Here is just its underlying structure.
const DrawerWithWeightTunerParams: FC<DrawerWithWeightTunerParamsProps> = ({
  open,
  onClose,
  children,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: "100%", md: "50%", xl: "33%" },
        },
      }}
      PaperProps={{
        sx: {
          height: "auto", // Set height to auto to fit content
          maxHeight: "100vh", // Limit height to viewport height
          overflow: "auto", // Enable scrolling if content is tall
        },
      }}
    >
      <div>{children}</div>
    </Drawer>
  );
};

interface WeightTunerProps {
  open: boolean;
  toggleWeightTuner: (newOpen: boolean) => () => void;
  weightContext: WeightContext;
}

// The weight selector functionality. Takes as props a WeightContext object
// which represents the set of weights to be considered, as well as their corresponding
// setters. Creates a Slider object for each of these weight-setter pairs
function WeightTuner({
  open,
  toggleWeightTuner,
  weightContext,
}: WeightTunerProps) {
  return (
    <DrawerWithWeightTunerParams open={open} onClose={toggleWeightTuner(false)}>
      <Box sx={{ flexGrow: 1, width: "100%" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Adjust Criteria Weights</Typography>
          <IconButton onClick={toggleWeightTuner(false)}>
            <ChevronRight />
          </IconButton>
        </Toolbar>
      </Box>
      <Divider />
      <Box sx={{ mx: 3, my: 3 }}>
        <WeightSlider
          content="Distance from Current Home"
          value={weightContext.distanceWeight}
          onWeightChange={weightContext.setDistanceWeight}
        >
          <Straighten />
        </WeightSlider>
        <WeightSlider
          content="Review Score"
          value={weightContext.reviewWeight}
          onWeightChange={weightContext.setReviewWeight}
        >
          {" "}
          <Reviews />
        </WeightSlider>
        <WeightSlider
          content="Response Rate"
          value={weightContext.responseWeight}
          onWeightChange={weightContext.setResponseWeight}
        >
          {" "}
          <HourglassTop />
        </WeightSlider>
        <WeightSlider
          content="Extension Flexibility"
          value={weightContext.flexibilityWeight}
          onWeightChange={weightContext.setFlexibilityWeight}
        >
          {" "}
          <CalendarMonth />
        </WeightSlider>
      </Box>
    </DrawerWithWeightTunerParams>
  );
}

export default WeightTuner;
