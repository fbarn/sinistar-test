import React, { useRef } from 'react';

import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridEventListener } from '@mui/x-data-grid';
import { debounce } from '@mui/material/utils';
import { ArrowDownward } from '@mui/icons-material';

import { useMapsLibrary } from '@vis.gl/react-google-maps';

import { Home } from 'shared/lib/types';

interface MapTableProps {
  homes: Home[];
  onRowClick: (coords: google.maps.GeocoderGeometry | null) => void;
}

function MapTable({ homes, onRowClick }: MapTableProps) {

  const geocodeService = useRef(null as any)

  const [value, setValue] = React.useState<google.maps.LatLng | null>(null);
  const geocoding = useMapsLibrary('geocoding')

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'address', headerName: 'Address', width: 350 },
    { field: 'review_score', headerName: 'Review Score', width: 110 },
  ];

  const rows = React.useMemo(() => {
    console.log("Updating tables");
    return homes.map(({ id, name, address, review_score, latitude, longitude }) => ({
      id,
      name,
      address,
      review_score,
      latitude,
      longitude
    }));
  }, [homes]);

  const handleRowClick: GridEventListener<'rowClick'> = (params) => {
    setValue(new google.maps.LatLng(params.row.latitude, params.row.longitude));
  };

  const fetchGeocode = React.useMemo(
    () => {
      console.log("Fetching geocode for selected row.");
      return debounce(
        (
          request: { location: google.maps.LatLng },
          callback: (results?: readonly google.maps.GeocoderResult[]) => void,
        ) => {
          (geocodeService.current as any).geocode(
            request,
            callback,
          ).catch((e: any) => {
            console.log('Failed to load geocode for selected row: ' + e);
          });
        },
        400)
    }, []);

  React.useEffect(() => {
    let active = true;
    console.log("Activated effect for rowClick.")

    if (!geocodeService.current && geocoding !== null) {
      geocodeService.current = new geocoding.Geocoder();
    }
    if (!geocodeService.current) {
      return undefined;
    }

    if (value === null) {
      return undefined;
    }

    fetchGeocode({ location: value }, (results?: readonly google.maps.GeocoderResult[]) => {
      if (active) {
        if (results) {
          let newPosition: google.maps.GeocoderGeometry = results[0]?.geometry;
          onRowClick(newPosition);
        }
      }
    });

    return () => {
      active = false;
    };
  }, [onRowClick, value, fetchGeocode, geocoding]);

  return (
    <Box
      width={{ xs: '96vw', md: '60vw', lg: '50vw', xl: '690px' }}
      marginTop={{ xs: '61px', sm: '70px' }}
      marginLeft={{ xs: '2vw', md: '20vw', lg: '25vw', xl: '5px' }}>
      <Box
        borderRadius={0}
        width="100%" flexGrow="1" sx={{ borderRadius: 0 }}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ArrowDownward />}
          >
            <Typography>Available Hosts</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box flexGrow="1" height={{ xs: '50vh', xl: '50vh' }} maxHeight={800}>
              <DataGrid rows={rows}
                columns={columns}
                disableColumnMenu
                disableColumnResize
                disableColumnSorting
                autoPageSize
                onRowClick={handleRowClick} />
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box >
  )
}
export default MapTable;
