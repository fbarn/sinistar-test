import { useEffect, useMemo, useRef, useState } from "react";

import { Autocomplete, Grid2, InputBase, Typography } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { debounce } from "@mui/material/utils";
import { LocationOn, Search } from "@mui/icons-material";

import { useMapsLibrary } from "@vis.gl/react-google-maps";

const SearchBarStyler = styled("div")(({ theme }) => ({
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

const SearchIconStyler = styled("div")(({ theme }) => ({
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

// Functionality for the search bar
// Uses the google maps AutocompleteService
// Passes the corresponding location to the parent so it
// could get used in the map and for sorting the candidate homes
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

  // Load the autocomplete service
  const fetchPlaces = useMemo(() => {
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
            console.error("Failed to load places for autocomplete: " + e);
          });
      },
      400,
    );
  }, []);

  // Triggered by a change in the search input (any keystroke)
  // determines suggestions based on this input, and passes them to
  // the user as a grid element.
  useEffect(() => {
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

  // Load the geocode service
  // Used for determining the location of an autocomplete result
  const fetchGeocode = useMemo(() => {
    return debounce(
      (
        request: { placeId: string },
        callback: (results?: readonly google.maps.GeocoderResult[]) => void,
      ) => {
        (geocodeService.current as any)
          .geocode(request, callback)
          .catch((e: any) => {
            console.error("Failed to get geocode: " + e);
          });
      },
      400,
    );
  }, []);

  // Triggered by a suggestion being filterSelected
  // Passes the suggestion in the geocode service to determine
  // its location. This location then gets passed to the parent
  // to change the state of the map.
  useEffect(() => {
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
    <SearchBarStyler>
      <SearchIconStyler>
        <Search />
      </SearchIconStyler>
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
    </SearchBarStyler>
  );
}

export default SearchBar;
