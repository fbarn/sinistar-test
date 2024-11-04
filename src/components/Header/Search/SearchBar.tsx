import { useEffect, useMemo, useRef, useState } from "react";

import { Autocomplete, Grid2, InputBase, Typography } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { debounce } from "@mui/material/utils";
import { LocationOn, Search } from "@mui/icons-material";

import { useMapsLibrary } from "@vis.gl/react-google-maps";

const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.2),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("xl")]: {
    width: "33%",
  },
  [theme.breakpoints.down("xl")]: {
    width: "50%",
  },
  [theme.breakpoints.down("md")]: {
    marginLeft: theme.spacing(1),
    width: "100%",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

interface SearchBarProps {
  onSearchChange: (coords: google.maps.GeocoderGeometry | null) => void;
}

function SearchBar({ onSearchChange }: SearchBarProps) {
  const autocompleteService = useRef(null as any);
  const geocodeService = useRef(null as any);

  const [value, setValue] =
    useState<google.maps.places.AutocompletePrediction | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<
    readonly google.maps.places.AutocompletePrediction[]
  >([]);
  const places = useMapsLibrary("places");
  const geocoding = useMapsLibrary("geocoding");

  const fetchPlaces = useMemo(() => {
    console.log("Fetching places for autocomplete.");
    return debounce(
      (
        request: { input: string },
        callback: (
          results?: readonly google.maps.places.AutocompletePrediction[],
        ) => void,
      ) => {
        (autocompleteService.current as any)
          .getPlacePredictions(request, callback)
          .catch((e: any) => {
            console.log("Failed to load places for autocomplete: " + e);
          });
      },
      400,
    );
  }, []);

  useEffect(() => {
    console.log("Activated effect for input change.");
    let active = true;

    if (!autocompleteService.current && places !== null) {
      autocompleteService.current = new places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetchPlaces(
      { input: inputValue },
      (results?: readonly google.maps.places.AutocompletePrediction[]) => {
        if (active) {
          let newOptions: readonly google.maps.places.AutocompletePrediction[] =
            [];

          if (value) {
            newOptions = [value];
          }

          if (results) {
            newOptions = [...newOptions, ...results];
          }

          setOptions(newOptions);
        }
      },
    );

    return () => {
      active = false;
    };
  }, [value, inputValue, fetchPlaces, places]);

  const fetchGeocode = useMemo(() => {
    console.log("Fetching geocode for search result.");
    return debounce(
      (
        request: { placeId: string },
        callback: (results?: readonly google.maps.GeocoderResult[]) => void,
      ) => {
        (geocodeService.current as any)
          .geocode(request, callback)
          .catch((e: any) => {
            console.log("Failed to get geocode: " + e);
          });
      },
      400,
    );
  }, []);

  useEffect(() => {
    console.log("Activated effect for value change.");
    let active = true;

    if (!geocodeService.current && geocoding !== null) {
      geocodeService.current = new geocoding.Geocoder();
    }
    if (!geocodeService.current) {
      return undefined;
    }

    if (value === null) {
      onSearchChange(null);
      return undefined;
    }

    fetchGeocode(
      { placeId: value.place_id },
      (results?: readonly google.maps.GeocoderResult[]) => {
        if (active) {
          if (results) {
            const newPosition: google.maps.GeocoderGeometry =
              results[0]?.geometry;
            onSearchChange(newPosition);
          }
        }
      },
    );

    return () => {
      active = false;
    };
  }, [onSearchChange, value, fetchGeocode, geocoding]);

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
        }}
        onInputChange={(_event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => {
          const { InputLabelProps, InputProps, ...rest } = params;
          return (
            <InputBase
              {...params.InputProps}
              {...rest}
              placeholder="Enter your address..."
              sx={{
                paddingLeft: 6,
                paddingTop: 1,
                paddingBottom: 1,
                paddingRight: 1,
              }}
            />
          );
        }}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              <Grid2 container sx={{ alignItems: "center" }}>
                <Grid2 sx={{ display: "flex", width: 44 }}>
                  <LocationOn sx={{ color: "text.secondary" }} />
                </Grid2>
                <Grid2 sx={{ width: "calc(100% - 44px)" }}>
                  {option.structured_formatting.main_text}
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {option.structured_formatting.secondary_text}
                  </Typography>
                </Grid2>
              </Grid2>
            </li>
          );
        }}
      />
    </SearchWrapper>
  );
}

export default SearchBar;
