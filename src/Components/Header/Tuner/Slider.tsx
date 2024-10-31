import React from 'react';
import { Box, Grid2, Slider, Typography } from '@mui/material';
import MuiInput from '@mui/material/Input';
import { styled } from '@mui/material/styles';


interface PrettySliderProps {
  inputcolor: string;
}
interface SliderProps {
  color: string;
  content: string;
  children?: React.ReactNode;
}

const Input = styled(MuiInput)(() => ({
  width: 42,
}));

const PrettySlider = styled(Slider)<PrettySliderProps>(({ inputcolor }) => ({
  color: inputcolor,
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&::before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: inputcolor,
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&::before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
}));


function WrappedSlider({ color, content, children }: SliderProps) {
  const [value, setValue] = React.useState(50);
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value === '' ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  return (
    <Box sx={{ pr: 3 }}>
      <Typography gutterBottom >{content}</Typography>
      <Grid2 container spacing={2} size={10}>
        <Grid2 size={1}>
          {children}
        </Grid2>
        <Grid2 size={10}>
          <PrettySlider
            inputcolor={color}
            valueLabelDisplay="auto"
            value={typeof value === 'number' ? value : 50}
            onChange={handleSliderChange}
            aria-label="pretto slider"
          />
        </Grid2>
        <Grid2 size={1}>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 1,
              min: 0,
              max: 100,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid2>
      </Grid2>
    </Box >
  )
}
export default WrappedSlider;
