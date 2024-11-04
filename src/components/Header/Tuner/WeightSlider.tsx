import { ChangeEvent, ReactNode } from "react";

import { Box, Grid2, Input, Slider, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const InputWithWeightSliderStyle = styled(Input)(({ theme }) => ({
  padding: theme.spacing(0, 0, 0, 0),
  width: 55,
}));

const IconWithWeightSliderStyle = styled("div")(({ theme }) => ({
  padding: theme.spacing(1.1, 0, 0, 0),
}));

const SliderWithWeightSliderStyle = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 5,
  padding: "15px 0",
  "& .MuiSlider-thumb": {
    height: 20,
    width: 20,
    backgroundColor: "#fff",
    boxShadow: "0 0 2px 0px rgba(0, 0, 0, 0.1)",
    "&:focus, &:hover, &.Mui-active": {
      boxShadow: "0px 0px 3px 1px rgba(0, 0, 0, 0.1)",
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        boxShadow:
          "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)",
      },
    },
    "&:before": {
      boxShadow:
        "0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)",
    },
  },
  "& .MuiSlider-track": {
    border: "none",
    height: 5,
  },
  "& .MuiSlider-rail": {
    opacity: 1,
    boxShadow: "inset 0px 0px 4px -2px #000",
    color: "#000",
    backgroundColor: "#fff",
  },
}));

interface WeightSliderProps {
  content: string;
  children?: ReactNode;
  value: number;
  onWeightChange: (weight: number) => void;
}

function WeightSlider({
  content,
  children,
  value,
  onWeightChange,
}: WeightSliderProps) {
  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    onWeightChange(newValue as number);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onWeightChange(event.target.value === "" ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      onWeightChange(0);
    } else if (value > 100) {
      onWeightChange(100);
    }
  };

  return (
    <Box sx={{ pr: 3 }}>
      <Typography gutterBottom>{content}</Typography>
      <Grid2 container spacing={2} size={10}>
        <Grid2 size={1}>
          <IconWithWeightSliderStyle>{children}</IconWithWeightSliderStyle>
        </Grid2>
        <Grid2 size={10}>
          <SliderWithWeightSliderStyle
            valueLabelDisplay="auto"
            value={typeof value === "number" ? value : 50}
            onChange={handleSliderChange}
          />
        </Grid2>
        <Grid2 size={1}>
          <InputWithWeightSliderStyle
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 1,
              min: 0,
              max: 100,
              type: "number",
              "aria-labelledby": "input-slider",
            }}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
}
export default WeightSlider;
