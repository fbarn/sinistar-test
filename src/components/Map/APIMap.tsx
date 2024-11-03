import React from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { DataGrid, GridRowsProp, GridColDef, GridEventListener } from '@mui/x-data-grid';

import { AdvancedMarker, ControlPosition, Map, MapControl, Pin, useMap, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { Home } from 'shared/lib/types';


interface APIMapProps {
  geometry: google.maps.GeocoderGeometry | null;
  homes: Home[];
}

function APIMap({ geometry, homes }: APIMapProps) {

  const map = useMap()
  const [markerRef, marker] = useAdvancedMarkerRef();

  React.useEffect(() => {
    if (!map || !geometry || !marker) return;

    if (geometry?.viewport) {
      map.fitBounds(geometry?.viewport);
      map.setZoom(12);
    }
    if (geometry?.location) {
      marker.position = geometry?.location;
    }
  }, [map, geometry, marker]);


  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'address', headerName: 'Address', width: 150 },
    { field: 'review_score', headerName: 'Review Score', width: 150 },
  ];

  const rows = React.useMemo(() => {
    return homes.map(({ id, name, address, review_score }) => ({
      id,
      name,
      address,
      review_score,
    }));
  }, [homes]);

  return (
    <Box
      position={'absolute'}
      sx={{ top: 0, bottom: 0, left: 0, right: 0, zIndex: -1 }}>

      <Map
        mapId={'663505692a16ecbb'}
        defaultCenter={{ lat: 45.0019088, lng: -76.2177276 }}
        minZoom={4}
        defaultZoom={6}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        <MapControl position={ControlPosition.LEFT_TOP}>
          <Box
            width={{ xs: '95vw', lg: '600px', xl: '800px' }}
            height={{ xs: 0, xl: '80vh' }}
            m={'10px'}>

            <Box width="100%" flexGrow="1">
              <Card >
                <CardContent>
                  <Box mx="15px" mt="10px" mb="20px">
                    <Typography
                      variant="h5"
                      component="div"
                      fontWeight={'bold'}
                    >
                      Hosts
                    </Typography>
                  </Box>

                  <Box m="10px" flexGrow="1" height={{ xs: '50vh', xl: '85%' }}>
                    <DataGrid rows={rows}
                      disableColumnMenu
                      disableColumnResize
                      disableColumnSorting
                      columns={columns} />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </MapControl>

        <AdvancedMarker key={'my_home'} ref={markerRef} position={null} />
        {homes?.map(({ latitude, longitude, id }) => (
          <AdvancedMarker
            key={id}
            position={{ lat: latitude, lng: longitude }}
          >
            <Pin
              background={'#edcc1f'}
              glyphColor={'#000'}
              borderColor={'#000'}
            />
          </AdvancedMarker>
        ))}
      </Map>
    </Box >
  )
}

export default APIMap;
