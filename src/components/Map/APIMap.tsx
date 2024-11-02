import React from 'react';
import { Box } from '@mui/material';

import { AdvancedMarker, Map, useMap, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';

interface APIMapProps {
  geometry: google.maps.GeocoderGeometry | null;
}

function APIMap({ geometry }: APIMapProps) {

  const map = useMap()
  const [markerRef, marker] = useAdvancedMarkerRef();

  React.useEffect(() => {
    console.log(geometry);
    console.log(geometry?.location?.lat());
    console.log(geometry?.location?.lng());
    if (!map || !geometry || !marker) return;

    if (geometry?.viewport) {
      map.fitBounds(geometry?.viewport);
      map.setZoom(12);
    }
    marker.position = geometry?.location;
  }, [map, geometry, marker]);

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
        <AdvancedMarker ref={markerRef} position={null} />
      </Map>
    </Box>
  )
}

export default APIMap;
