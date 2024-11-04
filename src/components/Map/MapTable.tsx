import { Button, Tooltip } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { debounce } from "@mui/material/utils";
import { ArrowDownward } from "@mui/icons-material";

import { useMapsLibrary } from "@vis.gl/react-google-maps";

import { Home } from "shared/lib/types";

interface MapTableProps {
  homes: Home[];
  disabled: boolean;
  onRowClick: (coords: google.maps.GeocoderGeometry | null) => void;
  onSort: () => void;
}

function MapTable({ homes, disabled, onRowClick, onSort }: MapTableProps) {
  const geocodeService = useRef(null as any);

  const [value, setValue] = useState<google.maps.LatLng | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);
  const geocoding = useMapsLibrary("geocoding");

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "address", headerName: "Address", width: 350 },
    { field: "review_score", headerName: "Review Score", width: 110 },
  ];

  // Triggered by home sorting. Will update values in the table.
  const rows = useMemo(() => {
    return homes.map(
      ({ id, name, address, review_score, latitude, longitude }) => ({
        id,
        name,
        address,
        review_score,
        latitude,
        longitude,
      }),
    );
  }, [homes]);

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    setValue(new google.maps.LatLng(params.row.latitude, params.row.longitude));
  };

  // Geocode functionality used to get location information on the clicked row.
  const fetchGeocode = useMemo(() => {
    return debounce(
      (
        request: { location: google.maps.LatLng },
        callback: (results?: readonly google.maps.GeocoderResult[]) => void,
      ) => {
        (geocodeService.current as any)
          .geocode(request, callback)
          .catch((e: any) => {
            console.error("Failed to load geocode for selected row: " + e);
          });
      },
      400,
    );
  }, []);

  // Triggered by a row being clicked. Leads to the parent changing focus.
  useEffect(() => {
    let active = true;

    if (!geocodeService.current && geocoding !== null) {
      geocodeService.current = new geocoding.Geocoder();
    }
    if (!geocodeService.current) {
      return undefined;
    }

    if (value === null) {
      return undefined;
    }

    fetchGeocode(
      { location: value },
      (results?: readonly google.maps.GeocoderResult[]) => {
        if (active) {
          if (results) {
            const newPosition: google.maps.GeocoderGeometry =
              results[0]?.geometry;
            onRowClick(newPosition);
          }
        }
      },
    );
    setExpanded(false);

    return () => {
      active = false;
    };
  }, [onRowClick, value, fetchGeocode, geocoding]);

  return (
    <Box
      width={{ xs: "96vw", md: "60vw", lg: "50vw", xl: "690px" }}
      marginTop={{ xs: "69px", sm: "80px" }}
      marginLeft={{ xs: "2vw", md: "20vw", lg: "25vw", xl: "15px" }}
    >
      <Box width="100%" flexGrow="1" sx={{ borderRadius: 0 }}>
        <Accordion
          expanded={expanded}
          onChange={(e, expanded) => setExpanded(expanded)}
        >
          <AccordionSummary expandIcon={<ArrowDownward />}>
            <Typography>Available Hosts</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              flexGrow="1"
              height={{ xs: "50vh", xl: "50vh" }}
              maxHeight={800}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                disableColumnMenu
                disableColumnResize
                disableColumnSorting
                autoPageSize
                onRowClick={handleRowClick}
              />
            </Box>

            <Box marginY={3}></Box>
            <Tooltip
              title={
                disabled
                  ? "Sorting requires an address and one non-zero weight."
                  : ""
              }
            >
              <span>
                <Button
                  variant="contained"
                  onClick={onSort}
                  disabled={disabled}
                  style={disabled ? { pointerEvents: "none" } : {}}
                >
                  Sort Candidates
                </Button>
              </span>
            </Tooltip>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
export default MapTable;
