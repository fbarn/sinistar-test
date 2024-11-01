import React, { useRef } from 'react';

import { Autocomplete, Grid2, InputBase, Typography } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { debounce } from '@mui/material/utils';
import { LocationOn, Search } from '@mui/icons-material';

import { useMapsLibrary } from '@vis.gl/react-google-maps';

import type { PlaceType } from 'shared/lib/types'

const SearchWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.10),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.20),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('xl')]: {
    width: '30%',
  },
  [theme.breakpoints.down('xl')]: {
    width: '50%',
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: theme.spacing(1),
    width: '100%',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

function SearchBar() {
  const autocompleteService = useRef(null as any);

  const [value, setValue] = React.useState<PlaceType | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<readonly PlaceType[]>([]);
  const googleMapsPlaces = useMapsLibrary('places')


  const fetch = React.useMemo(
    () =>
      debounce(
        (
          request: { input: string },
          callback: (results?: readonly PlaceType[]) => void,
        ) => {
          (autocompleteService.current as any).getPlacePredictions(
            request,
            callback,
          );
        },
        400,
      ),
    [],
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && googleMapsPlaces !== null) {
      autocompleteService.current = new googleMapsPlaces.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results?: readonly PlaceType[]) => {
      if (active) {
        let newOptions: readonly PlaceType[] = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch, googleMapsPlaces]);


  return (
    <SearchWrapper>
      <SearchIconWrapper>
        <Search />
      </SearchIconWrapper>
      <Autocomplete
        getOptionLabel={(option) => option.description}
        filterOptions={(x) => x}
        options={options}
        autoComplete
        includeInputInList
        filterSelectedOptions
        value={value}
        noOptionsText="No locations"
        onChange={(_event: any, newValue) => {
          setOptions(newValue ? [newValue, ...options] : options);
          setValue(newValue);
          console.log(newValue)
        }}
        onInputChange={(_event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => {
          const { InputLabelProps, InputProps, ...rest } = params;
          return <InputBase {...params.InputProps} {...rest}
            placeholder="Enter your address..."
            sx={{
              paddingLeft: 6,
              paddingTop: 1,
              paddingBottom: 1,
              paddingRight: 1,
            }}
          />;
        }}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              <Grid2 container sx={{ alignItems: 'center' }}>
                <Grid2 sx={{ display: 'flex', width: 44 }}>
                  <LocationOn sx={{ color: 'text.secondary' }} />
                </Grid2>
                <Grid2 sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                  {option.structured_formatting.main_text}
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {option.structured_formatting.secondary_text}
                  </Typography>
                </Grid2>
              </Grid2>
            </li>
          );
        }}
      />
    </SearchWrapper>
  )
}

export default SearchBar;
